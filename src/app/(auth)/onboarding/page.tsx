import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserWorkspaces } from "@/lib/supabase/workspaces";
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
import { createWorkspace } from "@/app/(auth)/onboarding/actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspaces = await getUserWorkspaces(supabase, user.id);

  if (workspaces.length > 0) {
    redirect(`/${workspaces[0].slug}/dashboard`);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crie seu workspace</CardTitle>
        <CardDescription>É onde seus leads, negócios e equipe vão viver.</CardDescription>
      </CardHeader>
      <form action={createWorkspace}>
        <CardContent className="flex flex-col gap-4">
          {searchParams.error ? (
            <p className="text-destructive text-sm">{searchParams.error}</p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome do workspace</Label>
            <Input id="name" name="name" placeholder="Minha Empresa" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
