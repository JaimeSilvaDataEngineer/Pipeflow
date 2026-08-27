"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LeadForm, type LeadFormErrors } from "@/components/leads/lead-form";
import type { WorkspaceMember } from "@/lib/supabase/members";
import { leadFormDefaultValues, leadSchema, type LeadFormValues } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

function toFormValues(lead?: Lead): LeadFormValues {
  if (!lead) return leadFormDefaultValues;

  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    roleTitle: lead.roleTitle,
    status: lead.status,
    assignedTo: lead.assignedTo ?? "",
  };
}

function LeadFormSheet({
  lead,
  members,
  trigger,
  onSubmit,
}: {
  lead?: Lead;
  members: WorkspaceMember[];
  trigger: React.ReactElement;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<LeadFormValues>(() => toFormValues(lead));
  const [errors, setErrors] = React.useState<LeadFormErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditing = Boolean(lead);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setValues(toFormValues(lead));
      setErrors({});
      setSubmitError(null);
    }
  }

  function handleChange<K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    const result = leadSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: LeadFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LeadFormValues;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(result.data);
      setOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Algo deu errado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="w-full max-w-md gap-0 p-6">
        <SheetTitle className="mb-6 text-base">
          {isEditing ? "Editar lead" : "Novo lead"}
        </SheetTitle>
        <div className="flex-1 overflow-y-auto">
          <LeadForm values={values} errors={errors} members={members} onChange={handleChange} />
          {submitError && <p className="text-destructive mt-3 text-sm">{submitError}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isEditing ? "Salvar alterações" : "Criar lead"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { LeadFormSheet };
