"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { workspaceSchema } from "@/lib/validations/workspace";

const MAX_SLUG_ATTEMPTS = 5;

export async function createWorkspace(formData: FormData) {
  const parsed = workspaceSchema.safeParse({ name: formData.get("name") });

  if (!parsed.success) {
    redirect(`/onboarding?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const baseSlug = slugify(parsed.data.name) || "workspace";
  let slug = baseSlug;
  let workspace: { id: string; slug: string } | null = null;

  // Creates the workspace and the caller's admin membership atomically (see
  // create_workspace_with_admin() in the workspace_members migration) — a
  // partial failure here would otherwise leave an orphaned workspace nobody
  // can reach, since every RLS policy requires membership.
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS && !workspace; attempt++) {
    const { data, error } = await supabase.rpc("create_workspace_with_admin", {
      p_name: parsed.data.name,
      p_slug: slug,
    });

    if (error) {
      if (error.code === "23505") {
        slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
        continue;
      }
      redirect(
        `/onboarding?error=${encodeURIComponent("Não foi possível criar o workspace. Tente novamente.")}`,
      );
    }

    workspace = data;
  }

  if (!workspace) {
    redirect(
      `/onboarding?error=${encodeURIComponent("Não foi possível gerar um identificador único. Tente outro nome.")}`,
    );
  }

  redirect(`/${workspace.slug}/dashboard`);
}
