-- Extensions
create extension if not exists pgcrypto;

-- is_workspace_member/is_workspace_admin below reference public.workspace_members,
-- which isn't created until a later migration. `language sql` functions are
-- validated against the catalog at CREATE FUNCTION time (unlike plpgsql,
-- which defers name resolution to first call), so this forward reference
-- would otherwise fail. Disabling body checks for this migration is the
-- standard Postgres/Supabase pattern for that ordering — it only skips
-- static validation, not the function's actual RLS behavior at runtime.
set check_function_bodies = off;

-- Helper: is the current user a member of the given workspace?
-- SECURITY DEFINER so it can read workspace_members without being blocked by
-- that table's own RLS policies (avoids recursive-policy issues) and so it
-- can be reused safely across every workspace-scoped table's policies.
create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  -- auth.uid() wrapped in a `select` so Postgres evaluates it once per
  -- statement (InitPlan) instead of once per row being filtered.
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = p_workspace_id
      and wm.user_id = (select auth.uid())
  );
$$;

-- Helper: is the current user an admin of the given workspace?
create or replace function public.is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = p_workspace_id
      and wm.user_id = (select auth.uid())
      and wm.role = 'admin'
  );
$$;

-- Helper: generic updated_at touch trigger, reused by tables that track it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Helper: guard against a row's lead_id pointing at a lead from a *different*
-- workspace than the row's own workspace_id. RLS only checks that the caller
-- is a member of workspace_id — without this, a member could still attach a
-- deal/activity to an arbitrary lead_id belonging to another tenant.
create or replace function public.check_lead_workspace_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.lead_id is not null and not exists (
    select 1 from public.leads l
    where l.id = new.lead_id
      and l.workspace_id = new.workspace_id
  ) then
    raise exception 'lead_id must belong to the same workspace_id';
  end if;
  return new;
end;
$$;
