create table public.deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  title text not null,
  value_cents integer not null default 0 check (value_cents >= 0),
  stage text not null default 'novo_lead'
    check (stage in (
      'novo_lead',
      'contato_realizado',
      'proposta_enviada',
      'negociacao',
      'fechado_ganho',
      'fechado_perdido'
    )),
  assigned_to uuid references auth.users (id) on delete set null,
  due_date date,
  created_at timestamptz not null default now()
);

create index deals_workspace_id_idx on public.deals (workspace_id);
create index deals_lead_id_idx on public.deals (lead_id);
create index deals_assigned_to_idx on public.deals (assigned_to);

create trigger deals_check_lead_workspace_match
  before insert or update on public.deals
  for each row
  execute function public.check_lead_workspace_match();

alter table public.deals enable row level security;

create policy "deals_select_members"
  on public.deals
  for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "deals_insert_members"
  on public.deals
  for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "deals_update_members"
  on public.deals
  for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "deals_delete_members"
  on public.deals
  for delete
  to authenticated
  using (public.is_workspace_member(workspace_id));
