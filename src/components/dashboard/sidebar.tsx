import Link from "next/link";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";

function Sidebar({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <aside className="bg-sidebar border-sidebar-border hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-14 items-center px-4">
        <Link href={`/${workspaceSlug}/dashboard`} className="text-sidebar-foreground text-lg font-semibold">
          PipeFlow
        </Link>
      </div>
      <SidebarNav workspaceSlug={workspaceSlug} />
    </aside>
  );
}

export { Sidebar };
