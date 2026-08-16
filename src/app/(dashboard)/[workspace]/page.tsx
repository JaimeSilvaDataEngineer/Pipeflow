import { redirect } from "next/navigation";

export default function WorkspaceIndexPage({ params }: { params: { workspace: string } }) {
  redirect(`/${params.workspace}/dashboard`);
}
