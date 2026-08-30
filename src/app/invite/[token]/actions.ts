"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// Every failure mode accept_workspace_invite() can raise (not found,
// expired, wrong account, Free plan limit) is surfaced as a Postgres
// exception — there's no structured error code to switch on, so the raw
// message is shown as-is rather than re-mapped to a generic string.
export async function acceptInvite(token: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const { data: workspace, error } = await supabase.rpc("accept_workspace_invite", {
    p_token: token,
  });

  if (error || !workspace) {
    redirect(`/invite/${token}?error=${encodeURIComponent(error?.message ?? "Não foi possível aceitar o convite.")}`);
  }

  redirect(`/${workspace.slug}/dashboard`);
}
