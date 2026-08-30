import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "./actions";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invite } = await supabase
    .rpc("get_invite_by_token", { p_token: params.token })
    .maybeSingle();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      {!invite ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Convite inválido</CardTitle>
            <CardDescription>Este link de convite não existe ou já foi usado.</CardDescription>
          </CardHeader>
        </Card>
      ) : !user ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Convite para {invite.workspace_name}</CardTitle>
            <CardDescription>
              Entre ou crie uma conta com <strong>{invite.email}</strong> para aceitar este convite.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              render={<Link href={`/login?next=${encodeURIComponent(`/invite/${params.token}`)}`} />}
            >
              Entrar
            </Button>
            <Button
              variant="outline"
              className="w-full"
              render={<Link href={`/signup?next=${encodeURIComponent(`/invite/${params.token}`)}`} />}
            >
              Criar conta
            </Button>
          </CardFooter>
        </Card>
      ) : invite.status !== "pending" || new Date(invite.expires_at) < new Date() ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Convite expirado</CardTitle>
            <CardDescription>
              Este convite não está mais válido. Peça a um administrador do workspace para enviar um
              novo.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : user.email?.toLowerCase() !== invite.email.toLowerCase() ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>E-mail diferente</CardTitle>
            <CardDescription>
              Este convite foi enviado para <strong>{invite.email}</strong>, mas você está logado como{" "}
              <strong>{user.email}</strong>.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Convite para {invite.workspace_name}</CardTitle>
            <CardDescription>
              Você foi convidado como{" "}
              <strong>{invite.role === "admin" ? "Administrador" : "Membro"}</strong>.
            </CardDescription>
          </CardHeader>
          {searchParams.error && (
            <CardContent>
              <p className="text-destructive text-sm">{searchParams.error}</p>
            </CardContent>
          )}
          <CardFooter>
            <form action={acceptInvite.bind(null, params.token)} className="w-full">
              <Button type="submit" className="w-full">
                Aceitar convite
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
