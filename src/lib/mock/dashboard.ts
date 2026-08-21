import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";
import { MOCK_DEALS } from "@/lib/mock/deals";
import { MOCK_LEADS } from "@/lib/mock/leads";
import type { Deal } from "@/types/deal";

const CLOSED_STAGE_IDS: PipelineStageId[] = ["fechado_ganho", "fechado_perdido"];

function isOpenDeal(deal: Deal): boolean {
  return !CLOSED_STAGE_IDS.includes(deal.stageId);
}

export type DashboardMetrics = {
  totalLeads: number;
  openDealsCount: number;
  pipelineValueCents: number;
  conversionRate: number;
};

export function getDashboardMetrics(): DashboardMetrics {
  const openDeals = MOCK_DEALS.filter(isOpenDeal);
  const wonDeals = MOCK_DEALS.filter((deal) => deal.stageId === "fechado_ganho").length;
  const lostDeals = MOCK_DEALS.filter((deal) => deal.stageId === "fechado_perdido").length;
  const decidedDeals = wonDeals + lostDeals;

  return {
    totalLeads: MOCK_LEADS.length,
    openDealsCount: openDeals.length,
    pipelineValueCents: openDeals.reduce((sum, deal) => sum + deal.valueCents, 0),
    conversionRate: decidedDeals === 0 ? 0 : wonDeals / decidedDeals,
  };
}

export type FunnelStageData = {
  stageId: PipelineStageId;
  label: string;
  count: number;
};

const FUNNEL_STAGE_IDS: PipelineStageId[] = [
  "novo_lead",
  "contato_realizado",
  "proposta_enviada",
  "negociacao",
  "fechado_ganho",
];

export function getFunnelData(): FunnelStageData[] {
  return FUNNEL_STAGE_IDS.map((stageId) => {
    const stage = PIPELINE_STAGES.find((item) => item.id === stageId)!;
    return {
      stageId,
      label: stage.label,
      count: MOCK_DEALS.filter((deal) => deal.stageId === stageId).length,
    };
  });
}

export function getUpcomingDeals(limit = 5): Deal[] {
  return MOCK_DEALS.filter(isOpenDeal)
    .slice()
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);
}
