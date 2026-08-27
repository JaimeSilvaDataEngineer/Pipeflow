"use server";

import { revalidatePath } from "next/cache";

import { mapLeadRow } from "@/lib/supabase/leads";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { leadSchema, type LeadFormValues } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

async function resolveWorkspace(workspaceSlug: string) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, workspaceSlug);

  if (!workspace) {
    throw new Error("Workspace não encontrado.");
  }

  return { supabase, workspaceId: workspace.id };
}

export async function createLead(workspaceSlug: string, values: LeadFormValues): Promise<Lead> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { data, error } = await supabase
    .from("leads")
    .insert({
      workspace_id: workspaceId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      role_title: parsed.data.roleTitle,
      status: parsed.data.status,
      assigned_to: parsed.data.assignedTo,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Não foi possível criar o lead.");
  }

  revalidatePath(`/${workspaceSlug}/leads`);
  return mapLeadRow(data);
}

export async function updateLead(
  workspaceSlug: string,
  id: string,
  values: LeadFormValues,
): Promise<Lead> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { data, error } = await supabase
    .from("leads")
    .update({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      role_title: parsed.data.roleTitle,
      status: parsed.data.status,
      assigned_to: parsed.data.assignedTo,
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Não foi possível salvar o lead.");
  }

  revalidatePath(`/${workspaceSlug}/leads`);
  revalidatePath(`/${workspaceSlug}/leads/${id}`);
  return mapLeadRow(data);
}

export async function deleteLead(workspaceSlug: string, id: string): Promise<void> {
  const { supabase, workspaceId } = await resolveWorkspace(workspaceSlug);

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) {
    throw new Error("Não foi possível excluir o lead.");
  }

  revalidatePath(`/${workspaceSlug}/leads`);
}
