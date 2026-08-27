import { redirect } from "next/navigation";

export default function SettingsPage({ params }: { params: { workspace: string } }) {
  redirect(`/${params.workspace}/settings/billing`);
}
