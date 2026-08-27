"use server";

import { redirect } from "next/navigation";

import { friendlyAuthErrorMessage } from "@/lib/supabase/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces } from "@/lib/supabase/workspaces";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent("E-mail ou senha inválidos")}`);
  }

  const workspaces = await getUserWorkspaces(supabase, data.user.id);

  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  redirect(`/${workspaces[0].slug}/dashboard`);
}

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  // No `emailRedirectTo` here — the confirmation link's destination comes
  // from the Supabase project's "Confirm signup" email template, which
  // points to /auth/confirm (token_hash/verifyOtp) rather than this app
  // passing a PKCE redirect URL. See /auth/confirm/route.ts.
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(friendlyAuthErrorMessage(error))}`);
  }

  // Email confirmation enabled on the project: signUp succeeds but returns
  // no session yet — the user must click the link before they can sign in.
  if (!data.session) {
    redirect(
      `/login?message=${encodeURIComponent("Confirme seu e-mail para ativar sua conta.")}`,
    );
  }

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
