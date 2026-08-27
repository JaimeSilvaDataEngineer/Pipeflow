import type { PipelineStageId } from "@/lib/constants/pipeline";

export type Deal = {
  id: string;
  title: string;
  valueCents: number;
  stageId: PipelineStageId;
  leadId: string | null;
  assignedTo: string | null;
  dueDate: string | null;
  createdAt: string;
};
