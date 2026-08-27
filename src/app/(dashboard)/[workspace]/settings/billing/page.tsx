import { CheckIcon, CreditCardIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FREE_PLAN_LIMITS } from "@/lib/limits";
import { getWorkspaceBilling } from "@/lib/supabase/billing";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { createCheckoutSession, createPortalSession } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export default async function BillingPage({
  params,
  searchParams,
}: {
  params: { workspace: string };
  searchParams: { checkout?: string; error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const workspace = await getWorkspaceBySlugForCurrentUser(supabase, params.workspace);
  if (!workspace) notFound();

  const [role, billing, leadsCount, membersCount] = await Promise.all([
    getCurrentUserRole(supabase, workspace.id, user.id),
    getWorkspaceBilling(supabase, workspace.id),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .then((res) => res.count ?? 0),
    supabase
      .from("workspace_members")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .then((res) => res.count ?? 0),
  ]);

  const isAdmin = role === "admin";
  const isPro = billing.plan === "pro";
  const isPastDue = billing.subscription?.status === "past_due";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {searchParams.checkout === "success" && (
        <p className="text-sm text-green-700">
          Assinatura confirmada! Pode levar alguns segundos para refletir aqui.
        </p>
      )}
      {searchParams.error && <p className="text-destructive text-sm">{searchParams.error}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCardIcon className="size-4" />
            Plano atual
          </CardTitle>
          <CardDescription>{workspace.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant={isPro ? "default" : "secondary"} className="uppercase">
            {billing.plan}
          </Badge>

          {isPro && isPastDue && (
            <span className="text-destructive text-sm font-medium">
              Pagamento pendente — atualize seu método de pagamento
            </span>
          )}
          {isPro && !isPastDue && billing.subscription?.currentPeriodEnd && (
            <span className="text-muted-foreground text-sm">
              Renova em {dateFormatter.format(new Date(billing.subscription.currentPeriodEnd))}
            </span>
          )}
          {!isPro && (
            <span className="text-muted-foreground text-sm">
              {leadsCount}/{FREE_PLAN_LIMITS.maxLeads} leads · {membersCount}/{FREE_PLAN_LIMITS.maxMembers} membros
            </span>
          )}
        </CardContent>
        {isAdmin && (
          <CardFooter>
            {isPro ? (
              <form action={createPortalSession.bind(null, workspace.slug)}>
                <Button type="submit" variant="outline">
                  Gerenciar assinatura
                </Button>
              </form>
            ) : (
              <form action={createCheckoutSession.bind(null, workspace.slug)}>
                <Button type="submit">Assinar Pro — R$50/mês</Button>
              </form>
            )}
          </CardFooter>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className={cn(!isPro && "border-primary")}>
          <CardHeader>
            <CardTitle className="text-base">Free</CardTitle>
            <CardDescription>Para começar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckIcon className="text-muted-foreground size-4" />
                Até {FREE_PLAN_LIMITS.maxMembers} membros
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-muted-foreground size-4" />
                Até {FREE_PLAN_LIMITS.maxLeads} leads
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="text-muted-foreground size-4" />
                Pipeline Kanban completo
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className={cn(isPro && "border-primary")}>
          <CardHeader>
            <CardTitle className="text-base">Pro — R$50/mês</CardTitle>
            <CardDescription>Para times em crescimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-blue-600" />
                Membros ilimitados
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-blue-600" />
                Leads ilimitados
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-blue-600" />
                Pipeline Kanban completo
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
