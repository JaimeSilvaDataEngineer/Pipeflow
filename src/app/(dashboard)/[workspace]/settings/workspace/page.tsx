import { notFound, redirect } from "next/navigation";

import { WorkspaceSettingsForm } from "@/components/settings/workspace-settings-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: { workspace: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);
  if (!workspace) notFound();

  const role = await getCurrentUserRole(supabase, workspace.id, user.id);
  const isAdmin = role === "admin";

  return (
    <WorkspaceSettingsForm
      workspaceSlug={workspace.slug}
      initialValues={{ name: workspace.name, slug: workspace.slug }}
      isAdmin={isAdmin}
    />
  );
}
