export const PIPELINE_STAGE_COLORS = {
  gray: "bg-slate-100 text-slate-700 border-slate-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  green: "bg-green-100 text-green-700 border-green-200",
  red: "bg-red-100 text-red-700 border-red-200",
} as const;

export type PipelineStageColor = keyof typeof PIPELINE_STAGE_COLORS;

export const PIPELINE_STAGES = [
  {
    id: "novo_lead",
    label: "Novo Lead",
    color: "gray" as const,
  },
  {
    id: "contato_realizado",
    label: "Contato Realizado",
    color: "blue" as const,
  },
  {
    id: "proposta_enviada",
    label: "Proposta Enviada",
    color: "amber" as const,
  },
  {
    id: "negociacao",
    label: "Negociação",
    color: "amber" as const,
  },
  {
    id: "fechado_ganho",
    label: "Fechado Ganho",
    color: "green" as const,
  },
  {
    id: "fechado_perdido",
    label: "Fechado Perdido",
    color: "red" as const,
  },
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"];
