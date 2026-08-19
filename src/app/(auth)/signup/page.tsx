import Link from "next/link";

import { Button } from "@/components/ui/button";
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
import { mockSignIn } from "@/app/(auth)/actions";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Comece grátis, sem cartão de crédito.</CardDescription>
      </CardHeader>
      <form action={mockSignIn}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" placeholder="Seu nome" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            Criar conta
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
