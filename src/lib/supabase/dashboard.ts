import type { SupabaseClient } from "@supabase/supabase-js";

import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";
import { getDeals } from "@/lib/supabase/deals";
import type { Database } from "@/types/supabase";
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

export type FunnelStageData = {
  stageId: PipelineStageId;
  label: string;
  count: number;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  funnelData: FunnelStageData[];
  upcomingDeals: Deal[];
};

const FUNNEL_STAGE_IDS: PipelineStageId[] = [
  "novo_lead",
  "contato_realizado",
  "proposta_enviada",
  "negociacao",
  "fechado_ganho",
];

export async function getDashboardData(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<DashboardData> {
  const [{ count: totalLeads }, deals] = await Promise.all([
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
    getDeals(supabase, workspaceId),
  ]);

  const openDeals = deals.filter(isOpenDeal);
  const wonDeals = deals.filter((deal) => deal.stageId === "fechado_ganho").length;
  const lostDeals = deals.filter((deal) => deal.stageId === "fechado_perdido").length;
  const decidedDeals = wonDeals + lostDeals;

  const funnelData = FUNNEL_STAGE_IDS.map((stageId) => {
    const stage = PIPELINE_STAGES.find((item) => item.id === stageId)!;
    return {
      stageId,
      label: stage.label,
      count: deals.filter((deal) => deal.stageId === stageId).length,
    };
  });

  const upcomingDeals = openDeals
    .filter((deal): deal is Deal & { dueDate: string } => deal.dueDate !== null)
    .slice()
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return {
    metrics: {
      totalLeads: totalLeads ?? 0,
      openDealsCount: openDeals.length,
      pipelineValueCents: openDeals.reduce((sum, deal) => sum + deal.valueCents, 0),
      conversionRate: decidedDeals === 0 ? 0 : wonDeals / decidedDeals,
    },
    funnelData,
    upcomingDeals,
  };
}
