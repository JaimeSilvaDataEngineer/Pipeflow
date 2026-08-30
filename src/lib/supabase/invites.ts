import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

export type PendingInvite = {
  id: string;
  email: string;
  role: "admin" | "member";
  expiresAt: string;
  createdAt: string;
};

// Callers must already be an admin of `workspaceId` — enforced by the
// "workspace_invites_select_admins" RLS policy, so a non-admin caller simply
// gets an empty list back here, not an error.
export async function getPendingInvites(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<PendingInvite[]> {
  const { data, error } = await supabase
    .from("workspace_invites")
    .select("id, email, role, expires_at, created_at")
    .eq("workspace_id", workspaceId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role as "admin" | "member",
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}
