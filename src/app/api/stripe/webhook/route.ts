import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

// The only Route Handler in the app for a mutation path — every other write
// goes through a Server Action. Stripe webhooks are the one exception: they
// arrive from Stripe's servers with no Next.js session/cookies to hang a
// Server Action off of, and the signature check below needs the exact raw
// request body, which Server Actions have no access to.
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode !== "subscription" || !session.subscription) break;

      const workspaceId = session.metadata?.workspace_id ?? session.client_reference_id;
      if (!workspaceId) {
        console.error("checkout.session.completed with no workspace_id metadata:", session.id);
        break;
      }

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const item = subscription.items.data[0];

      await supabase.from("subscriptions").upsert(
        {
          workspace_id: workspaceId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: item?.price.id ?? null,
          status: subscription.status,
          current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
        },
        { onConflict: "workspace_id" },
      );

      await supabase
        .from("workspaces")
        .update({ plan: "pro", stripe_customer_id: session.customer as string })
        .eq("id", workspaceId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const workspaceId = subscription.metadata?.workspace_id;

      if (!workspaceId) {
        console.error("customer.subscription.deleted with no workspace_id metadata:", subscription.id);
        break;
      }

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("workspace_id", workspaceId);

      await supabase.from("workspaces").update({ plan: "free" }).eq("id", workspaceId);

      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
