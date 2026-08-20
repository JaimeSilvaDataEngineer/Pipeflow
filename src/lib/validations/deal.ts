import { z } from "zod";

import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";

const PIPELINE_STAGE_IDS = PIPELINE_STAGES.map((stage) => stage.id) as [
  PipelineStageId,
  ...PipelineStageId[],
];

export const dealSchema = z.object({
  title: z.string().trim().min(2, "Informe o título do negócio"),
  valueReais: z.coerce.number().positive("Informe um valor maior que zero"),
  stageId: z.enum(PIPELINE_STAGE_IDS),
  leadId: z.string().min(1, "Selecione um lead"),
  assignedTo: z.string().min(1, "Selecione um responsável"),
  dueDate: z.string().min(1, "Informe um prazo"),
});

export type DealFormValues = z.infer<typeof dealSchema>;

export const dealFormDefaultValues: DealFormValues = {
  title: "",
  valueReais: 0,
  stageId: "novo_lead",
  leadId: "",
  assignedTo: "",
  dueDate: "",
};
