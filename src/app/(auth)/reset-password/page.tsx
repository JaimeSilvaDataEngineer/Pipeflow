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
import { resetPassword } from "@/app/(auth)/actions";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Defina uma nova senha</CardTitle>
        <CardDescription>Escolha uma senha com pelo menos 8 caracteres.</CardDescription>
      </CardHeader>
      <form action={resetPassword}>
        <CardContent className="flex flex-col gap-4">
          {searchParams.error ? (
            <p className="text-destructive text-sm">{searchParams.error}</p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton className="w-full">Redefinir senha</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
