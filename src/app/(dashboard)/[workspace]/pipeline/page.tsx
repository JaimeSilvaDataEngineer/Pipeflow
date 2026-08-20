import { PipelineBoard } from "@/components/kanban/pipeline-board";
import { mockDelay } from "@/lib/mock/delay";
import { MOCK_DEALS } from "@/lib/mock/deals";

export default async function PipelinePage() {
  await mockDelay();

  return <PipelineBoard initialDeals={MOCK_DEALS} />;
}
