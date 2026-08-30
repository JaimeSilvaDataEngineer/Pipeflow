import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SettingsNav workspaceSlug={params.workspace} />
      {children}
    </div>
  );
}
