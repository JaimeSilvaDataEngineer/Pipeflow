import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";
import type { WorkspaceSummary } from "@/types/workspace";

export async function getUserWorkspaces(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<WorkspaceSummary[]> {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspaces(id, slug, name, plan)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<{ workspaces: WorkspaceSummary | null }[]>();

  if (error || !data) {
    return [];
  }

  return data
    .map((row) => row.workspaces)
    .filter((workspace): workspace is WorkspaceSummary => workspace !== null);
}

// Relies on RLS ("workspaces_select_members") to return null for a slug the
// current user isn't a member of — the caller treats that the same as a
// nonexistent workspace (404), so tenant existence never leaks.
export async function getWorkspaceBySlugForCurrentUser(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<WorkspaceSummary | null> {
  const { data } = await supabase
    .from("workspaces")
    .select("id, slug, name, plan")
    .eq("slug", slug)
    .maybeSingle()
    .returns<WorkspaceSummary | null>();

  return data;
}

// Billing is Admin-only per the PRD role model — callers that gate a
// billing action must check this server-side (never trust the UI alone,
// which only hides the button for non-admins).
export async function getCurrentUserRole(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  userId: string,
): Promise<"admin" | "member" | null> {
  const { data } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .maybeSingle();

  return (data?.role as "admin" | "member" | undefined) ?? null;
}
