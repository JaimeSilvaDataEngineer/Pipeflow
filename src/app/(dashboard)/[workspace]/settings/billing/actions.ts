"use server";

import { notFound, redirect } from "next/navigation";

import { stripe } from "@/lib/stripe/client";
import { getWorkspaceBilling } from "@/lib/supabase/billing";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";

async function resolveAdminWorkspace(workspaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, workspaceSlug);
  if (!workspace) notFound();

  const role = await getCurrentUserRole(supabase, workspace.id, user.id);
  if (role !== "admin") {
    redirect(
      `/${workspaceSlug}/settings/billing?error=${encodeURIComponent("Apenas administradores podem gerenciar o plano.")}`,
    );
  }

  return { supabase, workspace, user };
}

export async function createCheckoutSession(workspaceSlug: string) {
  const { workspace, user } = await resolveAdminWorkspace(workspaceSlug);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${workspace.slug}/settings/billing?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${workspace.slug}/settings/billing?checkout=canceled`,
    customer_email: user.email,
    client_reference_id: workspace.id,
    // The webhook has no request-scoped session to resolve "which workspace"
    // (or "which user triggered this") from — metadata on both the session
    // and the subscription it creates is the only link back. Set on
    // subscription_data too so it's still present on subscription/invoice
    // events later (checkout.session.completed carries the session's own
    // metadata, but customer.subscription.deleted and invoice.payment_failed
    // only see the subscription/invoice object).
    metadata: { workspace_id: workspace.id, user_id: user.id },
    subscription_data: { metadata: { workspace_id: workspace.id, user_id: user.id } },
  });

  if (!session.url) {
    redirect(
      `/${workspaceSlug}/settings/billing?error=${encodeURIComponent("Não foi possível iniciar o checkout. Tente novamente.")}`,
    );
  }

  redirect(session.url);
}

export async function createPortalSession(workspaceSlug: string) {
  const { supabase, workspace } = await resolveAdminWorkspace(workspaceSlug);
  const billing = await getWorkspaceBilling(supabase, workspace.id);

  if (!billing.stripeCustomerId) {
    redirect(
      `/${workspaceSlug}/settings/billing?error=${encodeURIComponent("Nenhuma assinatura encontrada para gerenciar.")}`,
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: billing.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${workspaceSlug}/settings/billing`,
  });

  redirect(session.url);
}
