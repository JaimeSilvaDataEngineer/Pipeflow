create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  role_title text,
  status text not null default 'novo'
    check (status in ('novo', 'contatado', 'qualificado', 'convertido', 'desqualificado')),
  assigned_to uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index leads_workspace_id_idx on public.leads (workspace_id);
create index leads_assigned_to_idx on public.leads (assigned_to);

alter table public.leads enable row level security;

-- Any member of the workspace can read/write its leads (Admin and Member
-- both have full access to leads/deals per the PRD role model).
create policy "leads_select_members"
  on public.leads
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "leads_insert_members"
  on public.leads
  for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "leads_update_members"
  on public.leads
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "leads_delete_members"
  on public.leads
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));
