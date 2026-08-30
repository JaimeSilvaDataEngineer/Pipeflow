"use server";

import { revalidatePath } from "next/cache";

import { canAddMember } from "@/lib/limits";
import { sendWorkspaceInviteEmail } from "@/lib/resend/invite";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { inviteMemberSchema, type InviteMemberValues } from "@/lib/validations/invite";

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
    throw new Error("Apenas administradores podem gerenciar membros.");
  }

  return { supabase, workspace, user };
}

export async function inviteMember(workspaceSlug: string, values: InviteMemberValues): Promise<void> {
  const parsed = inviteMemberSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { supabase, workspace, user } = await resolveAdminWorkspace(workspaceSlug);

  const { allowed, limit } = await canAddMember(supabase, workspace.id);
  if (!allowed) {
    throw new Error(
      `Limite do plano Free atingido (${limit} membros). Faça upgrade para o Pro para convidar mais pessoas.`,
    );
  }

  // profiles is only visible for people who already share a workspace with
  // the caller (see profiles_select_workspace_mates) — so this lookup only
  // ever succeeds for someone who could plausibly already be a member here,
  // which is exactly the case worth catching early.
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (existingProfile) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("user_id")
      .eq("workspace_id", workspace.id)
      .eq("user_id", existingProfile.id)
      .maybeSingle();

    if (membership) {
      throw new Error("Esse e-mail já faz parte do workspace.");
    }
  }

  const { data: invite, error } = await supabase
    .from("workspace_invites")
    .insert({
      workspace_id: workspace.id,
      email: parsed.data.email,
      role: parsed.data.role,
      invited_by: user.id,
    })
    .select("id, token")
    .single();

  if (error || !invite) {
    if (error?.code === "23505") {
      throw new Error("Já existe um convite pendente para esse e-mail.");
    }
    throw new Error("Não foi possível criar o convite.");
  }

  const inviterName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Um administrador";

  try {
    await sendWorkspaceInviteEmail({
      to: parsed.data.email,
      workspaceName: workspace.name,
      inviterName,
      acceptUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`,
    });
  } catch {
    await supabase.from("workspace_invites").delete().eq("id", invite.id);
    throw new Error("Convite criado, mas não foi possível enviar o e-mail. Tente novamente.");
  }

  revalidatePath(`/${workspaceSlug}/settings/members`);
}

export async function revokeInvite(workspaceSlug: string, inviteId: string): Promise<void> {
  const { supabase, workspace } = await resolveAdminWorkspace(workspaceSlug);

  const { error } = await supabase
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId)
    .eq("workspace_id", workspace.id);

  if (error) {
    throw new Error("Não foi possível revogar o convite.");
  }

  revalidatePath(`/${workspaceSlug}/settings/members`);
}

export async function removeMember(workspaceSlug: string, userId: string): Promise<void> {
  const { supabase, workspace } = await resolveAdminWorkspace(workspaceSlug);

  const { data: target } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspace.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (target?.role === "admin") {
    const { count } = await supabase
      .from("workspace_members")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("role", "admin");

    if ((count ?? 0) <= 1) {
      throw new Error("O workspace precisa de pelo menos um administrador.");
    }
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspace.id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Não foi possível remover o membro.");
  }

  revalidatePath(`/${workspaceSlug}/settings/members`);
}
