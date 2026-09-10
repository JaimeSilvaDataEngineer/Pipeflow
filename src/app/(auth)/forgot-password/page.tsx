import Link from "next/link";

import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { requestPasswordReset } from "@/app/(auth)/actions";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Esqueceu sua senha?</CardTitle>
        <CardDescription>
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </CardDescription>
      </CardHeader>
      <form action={requestPasswordReset}>
        <CardContent className="flex flex-col gap-4">
          {searchParams.message ? (
            <p className="text-muted-foreground text-sm">{searchParams.message}</p>
          ) : null}
          {searchParams.error ? (
            <p className="text-destructive text-sm">{searchParams.error}</p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton className="w-full">Enviar link de redefinição</SubmitButton>
          <p className="text-muted-foreground text-center text-sm">
            Lembrou a senha?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
