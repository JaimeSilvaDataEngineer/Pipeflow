"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { updateWorkspaceSchema, type UpdateWorkspaceValues } from "@/lib/validations/workspace";

async function resolveAdminWorkspace(workspaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, workspaceSlug);
  if (!workspace) {
    throw new Error("Workspace não encontrado.");
  }

  const role = await getCurrentUserRole(supabase, workspace.id, user.id);
  if (role !== "admin") {
    throw new Error("Apenas administradores podem editar o workspace.");
  }

  return { supabase, workspace };
}

export async function updateWorkspace(
  workspaceSlug: string,
  values: UpdateWorkspaceValues,
): Promise<{ slug: string }> {
  const parsed = updateWorkspaceSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { supabase, workspace } = await resolveAdminWorkspace(workspaceSlug);

  const { error } = await supabase
    .from("workspaces")
    .update({ name: parsed.data.name, slug: parsed.data.slug })
    .eq("id", workspace.id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Esse identificador já está em uso por outro workspace.");
    }
    throw new Error("Não foi possível salvar as alterações.");
  }

  revalidatePath(`/${workspaceSlug}/settings/workspace`);
  if (parsed.data.slug !== workspaceSlug) {
    revalidatePath(`/${parsed.data.slug}/settings/workspace`);
  }

  return { slug: parsed.data.slug };
}
