"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DealForm, type DealFormErrors } from "@/components/kanban/deal-form";
import { dealFormDefaultValues, dealSchema, type DealFormValues } from "@/lib/validations/deal";
import type { PipelineStageId } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";

function toFormValues(deal?: Deal, defaultStageId?: PipelineStageId): DealFormValues {
  if (!deal) {
    return { ...dealFormDefaultValues, stageId: defaultStageId ?? dealFormDefaultValues.stageId };
  }

  return {
    title: deal.title,
    valueReais: deal.valueCents / 100,
    stageId: deal.stageId,
    leadId: deal.leadId,
    assignedTo: deal.assignedTo,
    dueDate: deal.dueDate.slice(0, 10),
  };
}

function DealFormDialog({
  deal,
  defaultStageId,
  trigger,
  onSubmit,
}: {
  deal?: Deal;
  defaultStageId?: PipelineStageId;
  trigger: React.ReactElement;
  onSubmit: (values: DealFormValues) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<DealFormValues>(() =>
    toFormValues(deal, defaultStageId),
  );
  const [errors, setErrors] = React.useState<DealFormErrors>({});

  const isEditing = Boolean(deal);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setValues(toFormValues(deal, defaultStageId));
      setErrors({});
    }
  }

  function handleChange<K extends keyof DealFormValues>(field: K, value: DealFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit() {
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

    onSubmit(result.data);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogTitle>{isEditing ? "Editar negócio" : "Novo negócio"}</DialogTitle>
        <DealForm values={values} errors={errors} onChange={handleChange} />
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button onClick={handleSubmit}>{isEditing ? "Salvar alterações" : "Criar negócio"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DealFormDialog };
