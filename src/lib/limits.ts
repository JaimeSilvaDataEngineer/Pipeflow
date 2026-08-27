import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

export const FREE_PLAN_LIMITS = {
  maxLeads: 50,
  maxMembers: 2,
} as const;

export type LimitCheck = {
  allowed: boolean;
  /** null means unlimited (Pro plan) */
  limit: number | null;
  count: number;
};

async function checkLimit(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  table: "leads" | "workspace_members",
  limit: number,
): Promise<LimitCheck> {
  const [{ data: workspace }, { count }] = await Promise.all([
    supabase.from("workspaces").select("plan").eq("id", workspaceId).single(),
    supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
  ]);

  const currentCount = count ?? 0;

  if (workspace?.plan === "pro") {
    return { allowed: true, limit: null, count: currentCount };
  }

  return { allowed: currentCount < limit, limit, count: currentCount };
}

export function canAddLead(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<LimitCheck> {
  return checkLimit(supabase, workspaceId, "leads", FREE_PLAN_LIMITS.maxLeads);
}

export function canAddMember(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<LimitCheck> {
  return checkLimit(supabase, workspaceId, "workspace_members", FREE_PLAN_LIMITS.maxMembers);
}
