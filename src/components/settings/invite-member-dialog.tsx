"use client";

import { UserPlusIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inviteFormDefaultValues,
  inviteMemberSchema,
  type InviteMemberValues,
} from "@/lib/validations/invite";

const ROLE_LABELS: Record<InviteMemberValues["role"], string> = {
  admin: "Administrador",
  member: "Membro",
};

function InviteMemberDialog({
  onSubmit,
}: {
  onSubmit: (values: InviteMemberValues) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<InviteMemberValues>(inviteFormDefaultValues);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setValues(inviteFormDefaultValues);
      setError(null);
    }
  }

  async function handleSubmit() {
    const result = inviteMemberSchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(result.data);
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Algo deu errado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <UserPlusIcon />
            Convidar
          </Button>
        }
      />
      <DialogContent>
        <DialogTitle>Convidar por e-mail</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">E-mail</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colega@empresa.com"
              value={values.email}
              onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Papel</Label>
            <Select
              value={values.role}
              onValueChange={(value) =>
                value && setValues((current) => ({ ...current, role: value as InviteMemberValues["role"] }))
              }
            >
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue>{(value: string) => ROLE_LABELS[value as InviteMemberValues["role"]]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Enviar convite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { InviteMemberDialog };
