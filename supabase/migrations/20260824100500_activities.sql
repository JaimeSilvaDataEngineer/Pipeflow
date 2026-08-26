create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null check (type in ('call', 'email', 'meeting', 'note')),
  description text,
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index activities_workspace_id_idx on public.activities (workspace_id);
create index activities_lead_id_idx on public.activities (lead_id);
create index activities_author_id_idx on public.activities (author_id);

create trigger activities_check_lead_workspace_match
  before insert or update on public.activities
  for each row
  execute function public.check_lead_workspace_match();

alter table public.activities enable row level security;

create policy "activities_select_members"
  on public.activities
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "activities_insert_members"
  on public.activities
  for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "activities_update_members"
  on public.activities
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "activities_delete_members"
  on public.activities
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));
