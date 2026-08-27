create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_self"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- Workspace-mates need each other's name/email for assignee pickers and
-- avatars across leads/deals — without this, only a user's own profile row
-- would ever be visible to a caller other than themselves.
create policy "profiles_select_workspace_mates"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members wm
      where wm.user_id = profiles.id
        and public.is_workspace_member(wm.workspace_id)
    )
  );

-- Mirrors auth.users into a table PostgREST/RLS can actually query — auth.users
-- itself isn't exposed to the API. Populated from the signUp() call's
-- `options.data.full_name` (see (auth)/actions.ts).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
