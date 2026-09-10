"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkspace } from "@/app/(dashboard)/[workspace]/settings/workspace/actions";
import { slugify } from "@/lib/utils";
import { updateWorkspaceSchema, type UpdateWorkspaceValues } from "@/lib/validations/workspace";

function WorkspaceSettingsForm({
  workspaceSlug,
  initialValues,
  isAdmin,
}: {
  workspaceSlug: string;
  initialValues: UpdateWorkspaceValues;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = React.useState(initialValues);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isDirty = values.name !== initialValues.name || values.slug !== initialValues.slug;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = updateWorkspaceSchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const { slug } = await updateWorkspace(workspaceSlug, result.data);
      setSuccess(true);
      if (slug !== workspaceSlug) {
        router.push(`/${slug}/settings/workspace`);
      } else {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Algo deu errado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workspace</CardTitle>
        <CardDescription>Nome e identificador usados na URL do seu workspace.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workspace-name">Nome</Label>
            <Input
              id="workspace-name"
              value={values.name}
              disabled={!isAdmin}
              onChange={(event) =>
                setValues((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workspace-slug">Identificador (URL)</Label>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-sm">/</span>
              <Input
                id="workspace-slug"
                value={values.slug}
                disabled={!isAdmin}
                onChange={(event) =>
                  setValues((current) => ({ ...current, slug: slugify(event.target.value) }))
                }
              />
            </div>
            <p className="text-muted-foreground text-xs">
              Alterar o identificador muda o endereço do workspace para todos os membros.
            </p>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && !error && <p className="text-sm text-green-600 dark:text-green-400">Alterações salvas.</p>}
        </CardContent>
        {isAdmin && (
          <CardFooter>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              Salvar alterações
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}

export { WorkspaceSettingsForm };
