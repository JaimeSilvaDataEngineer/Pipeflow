import type { PipelineStageId } from "@/lib/constants/pipeline";

export type Deal = {
  id: string;
  title: string;
  valueCents: number;
  stageId: PipelineStageId;
  leadId: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
};
