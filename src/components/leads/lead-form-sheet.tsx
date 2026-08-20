"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LeadForm, type LeadFormErrors } from "@/components/leads/lead-form";
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
    assignedTo: lead.assignedTo,
  };
}

function LeadFormSheet({
  lead,
  trigger,
  onSubmit,
}: {
  lead?: Lead;
  trigger: React.ReactElement;
  onSubmit: (values: LeadFormValues) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<LeadFormValues>(() => toFormValues(lead));
  const [errors, setErrors] = React.useState<LeadFormErrors>({});

  const isEditing = Boolean(lead);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setValues(toFormValues(lead));
      setErrors({});
    }
  }

  function handleChange<K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit() {
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

    onSubmit(result.data);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="w-full max-w-md gap-0 p-6">
        <SheetTitle className="mb-6 text-base">
          {isEditing ? "Editar lead" : "Novo lead"}
        </SheetTitle>
        <div className="flex-1 overflow-y-auto">
          <LeadForm values={values} errors={errors} onChange={handleChange} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
          <Button onClick={handleSubmit}>{isEditing ? "Salvar alterações" : "Criar lead"}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { LeadFormSheet };
