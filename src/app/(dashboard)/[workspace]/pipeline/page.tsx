import { notFound } from "next/navigation";

import { PipelineBoard } from "@/components/kanban/pipeline-board";
import { getDeals } from "@/lib/supabase/deals";
import { getLeads } from "@/lib/supabase/leads";
import { getWorkspaceMembers } from "@/lib/supabase/members";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";

export default async function PipelinePage({ params }: { params: { workspace: string } }) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);

  if (!workspace) notFound();

  const [deals, leads, members] = await Promise.all([
    getDeals(supabase, workspace.id),
    getLeads(supabase, workspace.id),
    getWorkspaceMembers(supabase, workspace.id),
  ]);

  return (
    <PipelineBoard
      initialDeals={deals}
      leads={leads}
      members={members}
      workspaceSlug={params.workspace}
    />
  );
}
