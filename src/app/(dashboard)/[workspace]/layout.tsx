import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { getInitials } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS returns null both for a nonexistent slug and for one the user isn't
  // a member of — 404 either way so tenant existence never leaks.
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);

  if (!workspace) {
    notFound();
  }

  const workspaces = await getUserWorkspaces(supabase, user.id);
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Usuário";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar workspaceSlug={workspace.slug} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          workspaceSlug={workspace.slug}
          workspaces={workspaces}
          user={{ name, email: user.email ?? "", initials: getInitials(name) }}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
