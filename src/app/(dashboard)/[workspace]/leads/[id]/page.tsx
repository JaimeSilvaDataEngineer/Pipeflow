import { notFound } from "next/navigation";

import { LeadDetail } from "@/components/leads/lead-detail";
import { getWorkspaceMembers } from "@/lib/supabase/members";
import { createClient } from "@/lib/supabase/server";
import { getLeadById } from "@/lib/supabase/leads";
import { getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";

export default async function LeadDetailPage({
  params,
}: {
  params: { workspace: string; id: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);

  if (!workspace) notFound();

  const [lead, members] = await Promise.all([
    getLeadById(supabase, workspace.id, params.id),
    getWorkspaceMembers(supabase, workspace.id),
  ]);

  if (!lead) notFound();

  return <LeadDetail lead={lead} members={members} workspaceSlug={params.workspace} />;
}
