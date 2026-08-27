import { notFound } from "next/navigation";

import { LeadsExplorer } from "@/components/leads/leads-explorer";
import { getWorkspaceMembers } from "@/lib/supabase/members";
import { createClient } from "@/lib/supabase/server";
import { getLeads } from "@/lib/supabase/leads";
import { getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import type { LeadStatus } from "@/types/lead";

const DATE_RANGE_DAYS: Record<string, number> = { "7d": 7, "30d": 30 };

export default async function LeadsPage({
  params,
  searchParams,
}: {
  params: { workspace: string };
  searchParams: { search?: string; status?: string; assignedTo?: string; dateRange?: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);

  if (!workspace) notFound();

  const [leads, members] = await Promise.all([
    getLeads(supabase, workspace.id, {
      search: searchParams.search,
      status: (searchParams.status as LeadStatus | "all" | undefined) ?? "all",
      assignedTo: searchParams.assignedTo ?? "all",
      dateRangeDays: searchParams.dateRange ? (DATE_RANGE_DAYS[searchParams.dateRange] ?? null) : null,
    }),
    getWorkspaceMembers(supabase, workspace.id),
  ]);

  return <LeadsExplorer leads={leads} members={members} workspaceSlug={params.workspace} />;
}
