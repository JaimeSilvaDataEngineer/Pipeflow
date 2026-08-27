import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";
import { getInitials } from "@/lib/utils";

export type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "admin" | "member";
};

// Two queries instead of a PostgREST embed: workspace_members.user_id points
// at auth.users, not at profiles.id directly, so there's no FK PostgREST can
// follow to embed profiles(...) from a workspace_members select.
export async function getWorkspaceMembers(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const { data: memberships, error: membershipsError } = await supabase
    .from("workspace_members")
    .select("user_id, role")
    .eq("workspace_id", workspaceId);

  if (membershipsError || !memberships || memberships.length === 0) {
    return [];
  }

  const userIds = memberships.map((membership) => membership.user_id);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  if (profilesError || !profiles) {
    return [];
  }

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  return memberships.map((membership) => {
    const profile = profileById.get(membership.user_id);
    const name = profile?.full_name || profile?.email || "Usuário";

    return {
      id: membership.user_id,
      name,
      email: profile?.email ?? "",
      initials: getInitials(name),
      role: membership.role as "admin" | "member",
    };
  });
}
