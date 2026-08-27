"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { createDeal, moveDealStage, updateDeal } from "@/app/(dashboard)/[workspace]/pipeline/actions";
import { PipelineColumn } from "@/components/kanban/pipeline-column";
import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";
import type { WorkspaceMember } from "@/lib/supabase/members";
import type { DealFormValues } from "@/lib/validations/deal";
import type { Deal } from "@/types/deal";
import type { Lead } from "@/types/lead";

function isPipelineStageId(value: string): value is PipelineStageId {
  return PIPELINE_STAGES.some((stage) => stage.id === value);
}

function PipelineBoard({
  initialDeals,
  leads,
  members,
  workspaceSlug,
}: {
  initialDeals: Deal[];
  leads: Lead[];
  members: WorkspaceMember[];
  workspaceSlug: string;
}) {
  const [deals, setDeals] = React.useState(initialDeals);

  React.useEffect(() => {
    setDeals(initialDeals);
  }, [initialDeals]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const dealId = event.active.id as string;
    const overId = event.over?.id;

    if (typeof overId !== "string" || !isPipelineStageId(overId)) return;

    const previousDeals = deals;
    const deal = previousDeals.find((item) => item.id === dealId);
    if (!deal || deal.stageId === overId) return;

    setDeals((current) =>
      current.map((item) => (item.id === dealId ? { ...item, stageId: overId } : item)),
    );

    try {
      await moveDealStage(workspaceSlug, dealId, overId);
    } catch {
      setDeals(previousDeals);
    }
  }

  async function handleCreate(values: DealFormValues) {
    const newDeal = await createDeal(workspaceSlug, values);
    setDeals((current) => [newDeal, ...current]);
  }

  async function handleEdit(dealId: string, values: DealFormValues) {
    const updated = await updateDeal(workspaceSlug, dealId, values);
    setDeals((current) => current.map((deal) => (deal.id === dealId ? updated : deal)));
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
            leads={leads}
            members={members}
            onCreate={handleCreate}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </DndContext>
  );
}

export { PipelineBoard };
