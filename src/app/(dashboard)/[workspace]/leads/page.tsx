import { LeadsExplorer } from "@/components/leads/leads-explorer";
import { mockDelay } from "@/lib/mock/delay";
import { MOCK_LEADS } from "@/lib/mock/leads";

export default async function LeadsPage({ params }: { params: { workspace: string } }) {
  await mockDelay();

  return <LeadsExplorer initialLeads={MOCK_LEADS} workspaceSlug={params.workspace} />;
}
