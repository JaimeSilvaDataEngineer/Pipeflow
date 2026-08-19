import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  const { workspace } = params;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar workspaceSlug={workspace} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header workspaceSlug={workspace} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
