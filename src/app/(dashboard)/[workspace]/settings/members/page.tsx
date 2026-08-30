import { notFound, redirect } from "next/navigation";

import { MembersManager } from "@/components/settings/members-manager";
import { getPendingInvites } from "@/lib/supabase/invites";
import { getWorkspaceMembers } from "@/lib/supabase/members";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";

export default async function MembersPage({ params }: { params: { workspace: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);
  if (!workspace) notFound();

  const role = await getCurrentUserRole(supabase, workspace.id, user.id);
  const isAdmin = role === "admin";

  const [members, pendingInvites] = await Promise.all([
    getWorkspaceMembers(supabase, workspace.id),
    isAdmin ? getPendingInvites(supabase, workspace.id) : Promise.resolve([]),
  ]);

  return (
    <MembersManager
      members={members}
      pendingInvites={pendingInvites}
      workspaceSlug={workspace.slug}
      currentUserId={user.id}
      isAdmin={isAdmin}
    />
  );
}
