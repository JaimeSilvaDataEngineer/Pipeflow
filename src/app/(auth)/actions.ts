"use server";

import { redirect } from "next/navigation";

import { friendlyAuthErrorMessage } from "@/lib/supabase/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces } from "@/lib/supabase/workspaces";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validations/auth";

// Only follow `next` when it's a same-app relative path — an absolute or
// protocol-relative ("//host") value could redirect the user off PipeFlow
// after they authenticate.
function safeNextPath(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value === "" || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}

export async function login(formData: FormData) {
  const next = safeNextPath(formData.get("next"));
  const nextParam = next ? `&next=${encodeURIComponent(next)}` : "";

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}${nextParam}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    if (error) console.error("signInWithPassword failed:", error.code, error.message);
    redirect(`/login?error=${encodeURIComponent("E-mail ou senha inválidos")}${nextParam}`);
  }

  if (next) {
    redirect(next);
  }

  const workspaces = await getUserWorkspaces(supabase, data.user.id);

  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  redirect(`/${workspaces[0].slug}/dashboard`);
}

export async function signup(formData: FormData) {
  const next = safeNextPath(formData.get("next"));
  const nextParam = next ? `&next=${encodeURIComponent(next)}` : "";

  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0].message)}${nextParam}`);
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
    console.error("signUp failed:", error.code, error.message);
    redirect(`/signup?error=${encodeURIComponent(friendlyAuthErrorMessage(error))}${nextParam}`);
  }

  // Email confirmation enabled on the project: signUp succeeds but returns
  // no session yet — the user must click the link before they can sign in.
  if (!data.session) {
    redirect(
      `/login?message=${encodeURIComponent("Confirme seu e-mail para ativar sua conta.")}${nextParam}`,
    );
  }

  if (next) {
    redirect(next);
  }

  redirect("/onboarding");
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    redirect(`/forgot-password?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?type=recovery&next=/reset-password`,
  });

  // Same success message whether or not the email exists — an error message
  // here would let anyone probe which emails are registered.
  if (error && error.code !== "over_email_send_rate_limit") {
    console.error("resetPasswordForEmail failed:", error.code, error.message);
  }

  const message =
    error?.code === "over_email_send_rate_limit"
      ? friendlyAuthErrorMessage(error)
      : "Se esse e-mail estiver cadastrado, enviamos um link para redefinir sua senha.";

  redirect(`/forgot-password?message=${encodeURIComponent(message)}`);
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reaching this page without an active recovery session means the link
  // was already used, expired, or never existed — send back to request a
  // fresh one rather than letting the form submit with nothing to update.
  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("Link expirado ou inválido. Solicite um novo.")}`,
    );
  }

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    redirect(`/reset-password?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(friendlyAuthErrorMessage(error))}`);
  }

  redirect(`/login?message=${encodeURIComponent("Senha atualizada. Entre com sua nova senha.")}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
