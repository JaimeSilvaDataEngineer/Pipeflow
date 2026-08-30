create table public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  -- pgcrypto lives in the "extensions" schema on hosted Supabase projects
  -- (not "public"), and a column DEFAULT is evaluated against the session's
  -- search_path rather than any function's `set search_path` — so the call
  -- must be schema-qualified here.
  token text not null unique default encode(extensions.gen_random_bytes(32), 'hex'),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references auth.users (id) on delete set null,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

create index workspace_invites_workspace_id_idx on public.workspace_invites (workspace_id);

-- One outstanding invite per e-mail per workspace at a time — re-inviting
-- requires the previous pending invite to be revoked or accepted first.
create unique index workspace_invites_pending_email_idx
  on public.workspace_invites (workspace_id, lower(email))
  where status = 'pending';

alter table public.workspace_invites enable row level security;

-- Only admins manage invites for their workspace. There is no policy for the
-- authenticated role's UPDATE — the only writer of `status` after creation is
-- accept_workspace_invite() below, which runs SECURITY DEFINER.
create policy "workspace_invites_select_admins"
  on public.workspace_invites
  for select
  to authenticated
  using (public.is_workspace_admin(workspace_id));

create policy "workspace_invites_insert_admins"
  on public.workspace_invites
  for insert
  to authenticated
  with check (public.is_workspace_admin(workspace_id) and invited_by = (select auth.uid()));

create policy "workspace_invites_delete_admins"
  on public.workspace_invites
  for delete
  to authenticated
  using (public.is_workspace_admin(workspace_id));

-- Lets the /invite/[token] page resolve a token to display info (workspace
-- name, invited e-mail, role, status, expiry) before the visitor is even
-- signed in. The token itself is the credential — knowing it is what grants
-- read access to this narrow subset of the invite, so this is intentionally
-- callable by anon as well as authenticated, bypassing the admin-only SELECT
-- policy above via SECURITY DEFINER.
create or replace function public.get_invite_by_token(p_token text)
returns table (
  workspace_name text,
  email text,
  role text,
  status text,
  expires_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select w.name, wi.email, wi.role, wi.status, wi.expires_at
  from public.workspace_invites wi
  join public.workspaces w on w.id = wi.workspace_id
  where wi.token = p_token;
$$;

revoke execute on function public.get_invite_by_token(text) from public;
grant execute on function public.get_invite_by_token(text) to anon, authenticated;

-- Accepting an invite requires inserting into workspace_members for a
-- workspace the caller isn't an admin of (and isn't bootstrapping as the
-- first member of) — outside what that table's own INSERT policy allows —
-- so this runs SECURITY DEFINER. All the checks a client could otherwise
-- skip are re-verified here: invite must exist, be pending, unexpired, and
-- match the signed-in account's e-mail; the Free plan member cap is
-- re-checked too, since the per-invite check at send time (see
-- lib/limits.ts canAddMember, FREE_PLAN_LIMITS.maxMembers) can't account for
-- multiple invites outstanding at once.
create or replace function public.accept_workspace_invite(p_token text)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.workspace_invites;
  v_user_email text;
  v_plan text;
  v_member_count integer;
  v_workspace public.workspaces;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into v_invite
  from public.workspace_invites
  where token = p_token
  for update;

  if v_invite is null then
    raise exception 'invite not found';
  end if;

  if v_invite.status <> 'pending' then
    raise exception 'invite is no longer valid';
  end if;

  if v_invite.expires_at < now() then
    raise exception 'invite has expired';
  end if;

  select email into v_user_email from auth.users where id = auth.uid();

  if v_user_email is null or lower(v_user_email) <> lower(v_invite.email) then
    raise exception 'invite email does not match the signed-in account';
  end if;

  select plan into v_plan from public.workspaces where id = v_invite.workspace_id;

  if v_plan = 'free' then
    select count(*) into v_member_count
    from public.workspace_members
    where workspace_id = v_invite.workspace_id;

    if v_member_count >= 2 then
      raise exception 'workspace has reached the Free plan member limit';
    end if;
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_invite.workspace_id, auth.uid(), v_invite.role)
  on conflict (workspace_id, user_id) do update set role = excluded.role;

  update public.workspace_invites set status = 'accepted' where id = v_invite.id;

  select * into v_workspace from public.workspaces where id = v_invite.workspace_id;
  return v_workspace;
end;
$$;

revoke execute on function public.accept_workspace_invite(text) from public;
grant execute on function public.accept_workspace_invite(text) to authenticated;
