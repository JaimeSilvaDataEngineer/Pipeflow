export const PIPELINE_STAGE_COLORS = {
  gray: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  amber: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  green: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
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
