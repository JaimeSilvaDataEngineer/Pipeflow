create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index workspace_members_user_id_idx on public.workspace_members (user_id);

alter table public.workspace_members enable row level security;

-- A member can see the membership roster of any workspace they belong to.
create policy "workspace_members_select_same_workspace"
  on public.workspace_members
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

-- Helper: does *any* row exist for this workspace, regardless of who's
-- asking? SECURITY DEFINER is required here, not just convenient: the
-- bootstrap check below runs as the inserting (non-member) user, and
-- workspace_members' own SELECT policy hides other members' rows from
-- non-members. A plain "not exists (select ... from workspace_members ...)"
-- would therefore see zero rows for *any* workspace the caller isn't in yet
-- — including ones that already have an admin — letting anyone self-insert
-- as admin into an existing workspace. This function bypasses that RLS scan
-- the same way is_workspace_member/is_workspace_admin do.
create or replace function public.workspace_has_any_member(p_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = p_workspace_id
  );
$$;

revoke execute on function public.workspace_has_any_member(uuid) from public, anon;
grant execute on function public.workspace_has_any_member(uuid) to authenticated;

-- Bootstrap: a user can add themselves as the first (admin) member of a
-- workspace that has no members yet. Otherwise, only existing admins can add
-- new members (invites).
create policy "workspace_members_insert_bootstrap_or_admin"
  on public.workspace_members
  for insert
  to authenticated
  with check (
    (
      user_id = (select auth.uid())
      and not public.workspace_has_any_member(workspace_id)
    )
    or public.is_workspace_admin(workspace_id)
  );

-- Only admins can change roles.
create policy "workspace_members_update_admins"
  on public.workspace_members
  for update
  to authenticated
  using (public.is_workspace_admin(workspace_id))
  with check (public.is_workspace_admin(workspace_id));

-- Admins can remove members; a member can remove themselves (leave workspace).
create policy "workspace_members_delete_admin_or_self"
  on public.workspace_members
  for delete
  to authenticated
  using (public.is_workspace_admin(workspace_id) or user_id = (select auth.uid()));

-- Onboarding needs to insert a workspace AND its first admin member as one
-- atomic unit — two separate client-side inserts risk leaving an orphaned,
-- memberless workspace (unreachable by anyone, since every RLS policy above
-- requires membership) if the second insert fails. SECURITY INVOKER: this
-- runs as the calling user, so both inserts are still checked against the
-- same policies above (workspaces_insert_authenticated and the bootstrap
-- policy) — it grants no privilege the caller didn't already have, it only
-- makes the two inserts transactional.
--
-- The id is generated up front and the first insert has no RETURNING: a
-- RETURNING clause is governed by the table's SELECT policy (not just the
-- INSERT policy's WITH CHECK), and workspaces_select_members requires
-- is_workspace_member(id) — which is still false at that instant, since the
-- membership row is only created by the second insert. Reading the finished
-- row back happens last, once membership exists and that policy passes.
create or replace function public.create_workspace_with_admin(p_name text, p_slug text)
returns public.workspaces
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid := gen_random_uuid();
  v_workspace public.workspaces;
begin
  insert into public.workspaces (id, name, slug)
  values (v_id, p_name, p_slug);

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_id, auth.uid(), 'admin');

  select * into v_workspace from public.workspaces where id = v_id;
  return v_workspace;
end;
$$;

grant execute on function public.create_workspace_with_admin(text, text) to authenticated;
