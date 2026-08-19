import { notFound } from "next/navigation";

import { LeadDetail } from "@/components/leads/lead-detail";
import { mockDelay } from "@/lib/mock/delay";
import { getLeadById } from "@/lib/mock/leads";

export default async function LeadDetailPage({
  params,
}: {
  params: { workspace: string; id: string };
}) {
  await mockDelay();

  const lead = getLeadById(params.id);

  if (!lead) notFound();

  return <LeadDetail lead={lead} workspaceSlug={params.workspace} />;
}
