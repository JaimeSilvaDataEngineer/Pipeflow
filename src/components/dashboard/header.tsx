import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { UserMenu } from "@/components/dashboard/user-menu";

function Header({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <header className="bg-background flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <MobileSidebar workspaceSlug={workspaceSlug} />
      <WorkspaceSwitcher workspaceSlug={workspaceSlug} />
      <div className="flex-1" />
      <UserMenu workspaceSlug={workspaceSlug} />
    </header>
  );
}

export { Header };
