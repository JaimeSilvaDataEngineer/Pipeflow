import type { SupabaseClient } from "@supabase/supabase-js";

import type { PipelineStageId } from "@/lib/constants/pipeline";
import type { Database } from "@/types/supabase";
import type { Deal } from "@/types/deal";

type DealRow = Database["public"]["Tables"]["deals"]["Row"];

export function mapDealRow(row: DealRow): Deal {
  return {
    id: row.id,
    title: row.title,
    valueCents: row.value_cents,
    stageId: row.stage as PipelineStageId,
    leadId: row.lead_id,
    assignedTo: row.assigned_to,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

export async function getDeals(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("getDeals failed:", error.message);
    return [];
  }

  return data.map(mapDealRow);
}

export async function getDealById(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  id: string,
): Promise<Deal | null> {
  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", id)
    .maybeSingle();

  return data ? mapDealRow(data) : null;
}
