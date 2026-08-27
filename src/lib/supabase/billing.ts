import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

export type WorkspaceBilling = {
  plan: "free" | "pro";
  stripeCustomerId: string | null;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
  } | null;
};

// subscriptions has RLS restricting select to workspace admins
// ("subscriptions_select_admins") — a non-admin caller simply gets `null`
// back here, not an error, which is why `subscription` is nullable even for
// a Pro workspace when called by a Member.
export async function getWorkspaceBilling(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<WorkspaceBilling> {
  const [{ data: workspace }, { data: subscription }] = await Promise.all([
    supabase.from("workspaces").select("plan, stripe_customer_id").eq("id", workspaceId).single(),
    supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("workspace_id", workspaceId)
      .maybeSingle(),
  ]);

  return {
    plan: (workspace?.plan as "free" | "pro" | undefined) ?? "free",
    stripeCustomerId: workspace?.stripe_customer_id ?? null,
    subscription: subscription
      ? { status: subscription.status, currentPeriodEnd: subscription.current_period_end }
      : null,
  };
}
