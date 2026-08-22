"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { PipelineColumn } from "@/components/kanban/pipeline-column";
import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";
import type { DealFormValues } from "@/lib/validations/deal";
import type { Deal } from "@/types/deal";

function isPipelineStageId(value: string): value is PipelineStageId {
  return PIPELINE_STAGES.some((stage) => stage.id === value);
}

function PipelineBoard({ initialDeals }: { initialDeals: Deal[] }) {
  const [deals, setDeals] = React.useState(initialDeals);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const dealId = event.active.id as string;
    const overId = event.over?.id;

    if (typeof overId !== "string" || !isPipelineStageId(overId)) return;

    setDeals((current) =>
      current.map((deal) => (deal.id === dealId ? { ...deal, stageId: overId } : deal)),
    );
  }

  function handleCreate(values: DealFormValues) {
    const newDeal: Deal = {
      id: `deal_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      title: values.title,
      valueCents: Math.round(values.valueReais * 100),
      stageId: values.stageId,
      leadId: values.leadId,
      assignedTo: values.assignedTo,
      dueDate: new Date(values.dueDate).toISOString(),
    };
    setDeals((current) => [newDeal, ...current]);
  }

  function handleEdit(dealId: string, values: DealFormValues) {
    setDeals((current) =>
      current.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              title: values.title,
              valueCents: Math.round(values.valueReais * 100),
              stageId: values.stageId,
              leadId: values.leadId,
              assignedTo: values.assignedTo,
              dueDate: new Date(values.dueDate).toISOString(),
            }
          : deal,
      ),
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stageId={stage.id}
            label={stage.label}
            color={stage.color}
            deals={deals.filter((deal) => deal.stageId === stage.id)}
            onCreate={handleCreate}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </DndContext>
  );
}

export { PipelineBoard };
