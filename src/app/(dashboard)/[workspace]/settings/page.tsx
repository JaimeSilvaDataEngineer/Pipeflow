import { CreditCardIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getWorkspaceBySlugForCurrentUser } from "@/lib/supabase/workspaces";
import { createCheckoutSession } from "./actions";

export default async function SettingsPage({
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

  const role = await getCurrentUserRole(supabase, workspace.id, user.id);
  const isAdmin = role === "admin";
  const isPro = workspace.plan === "pro";

  return (
    <div className="flex max-w-lg flex-col gap-4">
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
            Plano
          </CardTitle>
          <CardDescription>{workspace.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant={isPro ? "default" : "secondary"} className="uppercase">
            {workspace.plan}
          </Badge>
        </CardContent>
        {isAdmin && !isPro && (
          <CardFooter>
            <form action={createCheckoutSession.bind(null, workspace.slug)}>
              <Button type="submit">Assinar Pro — R$49/mês</Button>
            </form>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
