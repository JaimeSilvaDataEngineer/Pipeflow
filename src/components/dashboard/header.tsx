import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { UserMenu } from "@/components/dashboard/user-menu";
import type { UserSummary, WorkspaceSummary } from "@/types/workspace";

function Header({
  workspaceSlug,
  workspaces,
  user,
}: {
  workspaceSlug: string;
  workspaces: WorkspaceSummary[];
  user: UserSummary;
}) {
  return (
    <header className="bg-background flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <MobileSidebar workspaceSlug={workspaceSlug} />
      <WorkspaceSwitcher workspaces={workspaces} activeSlug={workspaceSlug} />
      <div className="flex-1" />
      <UserMenu workspaceSlug={workspaceSlug} user={user} />
    </header>
  );
}

export { Header };
