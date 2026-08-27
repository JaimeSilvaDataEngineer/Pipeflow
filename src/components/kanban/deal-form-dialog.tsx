"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DealForm, type DealFormErrors } from "@/components/kanban/deal-form";
import type { WorkspaceMember } from "@/lib/supabase/members";
import { dealFormDefaultValues, dealSchema, type DealFormValues } from "@/lib/validations/deal";
import type { PipelineStageId } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";
import type { Lead } from "@/types/lead";

function toFormValues(deal?: Deal, defaultStageId?: PipelineStageId): DealFormValues {
  if (!deal) {
    return { ...dealFormDefaultValues, stageId: defaultStageId ?? dealFormDefaultValues.stageId };
  }

  return {
    title: deal.title,
    valueReais: deal.valueCents / 100,
    stageId: deal.stageId,
    leadId: deal.leadId ?? "",
    assignedTo: deal.assignedTo ?? "",
    dueDate: deal.dueDate ? deal.dueDate.slice(0, 10) : "",
  };
}

function DealFormDialog({
  deal,
  defaultStageId,
  leads,
  members,
  trigger,
  onSubmit,
}: {
  deal?: Deal;
  defaultStageId?: PipelineStageId;
  leads: Lead[];
  members: WorkspaceMember[];
  trigger: React.ReactElement;
  onSubmit: (values: DealFormValues) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<DealFormValues>(() =>
    toFormValues(deal, defaultStageId),
  );
  const [errors, setErrors] = React.useState<DealFormErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditing = Boolean(deal);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setValues(toFormValues(deal, defaultStageId));
      setErrors({});
      setSubmitError(null);
    }
  }

  function handleChange<K extends keyof DealFormValues>(field: K, value: DealFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    const result = dealSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: DealFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof DealFormValues;
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogTitle>{isEditing ? "Editar negócio" : "Novo negócio"}</DialogTitle>
        <DealForm values={values} errors={errors} leads={leads} members={members} onChange={handleChange} />
        {submitError && <p className="text-destructive text-sm">{submitError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isEditing ? "Salvar alterações" : "Criar negócio"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DealFormDialog };
