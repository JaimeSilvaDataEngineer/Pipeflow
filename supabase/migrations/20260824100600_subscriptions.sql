create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces (id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'incomplete'
    check (status in (
      'trialing',
      'active',
      'past_due',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'unpaid'
    )),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

-- Billing is Admin-only per the PRD role model (Members have no access to
-- billing/settings). Writes only ever happen via the Stripe webhook Edge
-- Function using the service role key, which bypasses RLS entirely — so no
-- insert/update/delete policy is defined for the authenticated role here.
create policy "subscriptions_select_admins"
  on public.subscriptions
  for select
  to authenticated
  using (public.is_workspace_admin(workspace_id));
