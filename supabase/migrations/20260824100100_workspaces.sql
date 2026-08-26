create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

-- Members can see their own workspaces.
create policy "workspaces_select_members"
  on public.workspaces
  for select
  to authenticated
  using (public.is_workspace_member(id));

-- Any authenticated user can create a workspace; the app then inserts the
-- creator into workspace_members as admin in the same flow (see
-- create_workspace_with_admin() and M7 onboarding).
-- New workspaces always start on the free plan with no Stripe customer yet —
-- billing state is only ever advanced by the Stripe webhook (service role),
-- so we block a self-signup from inserting itself as already-paid.
create policy "workspaces_insert_authenticated"
  on public.workspaces
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and plan = 'free'
    and stripe_customer_id is null
  );

-- Only admins can change workspace settings (name, slug, billing fields).
create policy "workspaces_update_admins"
  on public.workspaces
  for update
  to authenticated
  using (public.is_workspace_admin(id))
  with check (public.is_workspace_admin(id));

create policy "workspaces_delete_admins"
  on public.workspaces
  for delete
  to authenticated
  using (public.is_workspace_admin(id));
