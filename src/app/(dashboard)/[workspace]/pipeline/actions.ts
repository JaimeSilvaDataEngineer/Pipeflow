"use server";

import { revalidatePath } from "next/cache";

import type { PipelineStageId } from "@/lib/constants/pipeline";
import { mapDealRow } from "@/lib/supabase/deals";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { dealSchema, type DealFormValues } from "@/lib/validations/deal";
import type { Deal } from "@/types/deal";

async function resolveWorkspace(workspaceSlug: string) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, workspaceSlug);

  if (!workspace) {
    throw new Error("Workspace não encontrado.");
  }

  return { supabase, workspaceId: workspace.id };
}

export async function createDeal(workspaceSlug: string, values: DealFormValues): Promise<Deal> {
  const parsed = dealSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { data, error } = await supabase
    .from("deals")
    .insert({
      workspace_id: workspaceId,
      title: parsed.data.title,
      value_cents: Math.round(parsed.data.valueReais * 100),
      stage: parsed.data.stageId,
      lead_id: parsed.data.leadId,
      assigned_to: parsed.data.assignedTo,
      due_date: parsed.data.dueDate,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Não foi possível criar o negócio.");
  }

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return mapDealRow(data);
}

export async function updateDeal(
  workspaceSlug: string,
  id: string,
  values: DealFormValues,
): Promise<Deal> {
  const parsed = dealSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { data, error } = await supabase
    .from("deals")
    .update({
      title: parsed.data.title,
      value_cents: Math.round(parsed.data.valueReais * 100),
      stage: parsed.data.stageId,
      lead_id: parsed.data.leadId,
      assigned_to: parsed.data.assignedTo,
      due_date: parsed.data.dueDate,
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Não foi possível salvar o negócio.");
  }

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return mapDealRow(data);
}

export async function deleteDeal(workspaceSlug: string, id: string): Promise<void> {
  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { error } = await supabase
    .from("deals")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) {
    throw new Error("Não foi possível excluir o negócio.");
  }

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
}

export async function moveDealStage(
  workspaceSlug: string,
  id: string,
  stageId: PipelineStageId,
): Promise<void> {
  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { error } = await supabase
    .from("deals")
    .update({ stage: stageId })
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) {
    throw new Error("Não foi possível mover o negócio.");
  }

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
}
