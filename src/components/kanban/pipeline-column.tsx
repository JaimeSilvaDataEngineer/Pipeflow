"use client";

import { useDroppable } from "@dnd-kit/core";
import { PlusIcon } from "lucide-react";

import { DealCard } from "@/components/kanban/deal-card";
import { DealFormDialog } from "@/components/kanban/deal-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PIPELINE_STAGE_COLORS, type PipelineStageId } from "@/lib/constants/pipeline";
import { formatCurrency } from "@/lib/formatCurrency";
import type { WorkspaceMember } from "@/lib/supabase/members";
import { cn } from "@/lib/utils";
import type { DealFormValues } from "@/lib/validations/deal";
import type { Deal } from "@/types/deal";
import type { Lead } from "@/types/lead";

function PipelineColumn({
  stageId,
  label,
  color,
  deals,
  leads,
  members,
  onCreate,
  onEdit,
}: {
  stageId: PipelineStageId;
  label: string;
  color: keyof typeof PIPELINE_STAGE_COLORS;
  deals: Deal[];
  leads: Lead[];
  members: WorkspaceMember[];
  onCreate: (values: DealFormValues) => Promise<void>;
  onEdit: (dealId: string, values: DealFormValues) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId });

  const totalCents = deals.reduce((sum, deal) => sum + deal.valueCents, 0);

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", PIPELINE_STAGE_COLORS[color])} />
          <h2 className="truncate text-sm font-semibold">{label}</h2>
          <Badge variant="secondary" className="shrink-0">
            {deals.length}
          </Badge>
        </div>
        <DealFormDialog
          defaultStageId={stageId}
          leads={leads}
          members={members}
          onSubmit={onCreate}
          trigger={
            <Button variant="ghost" size="icon" className="size-6 shrink-0">
              <PlusIcon className="size-4" />
              <span className="sr-only">Novo negócio em {label}</span>
            </Button>
          }
        />
      </div>
      <p className="text-muted-foreground -mt-2 text-xs font-medium">
        {formatCurrency(totalCents)}
      </p>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[60vh] flex-col gap-2 rounded-lg border border-dashed p-2 transition-colors",
          isOver ? "border-blue-400 bg-blue-50/60" : "border-border bg-muted/30",
        )}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} leads={leads} members={members} onEdit={onEdit} />
        ))}
        {deals.length === 0 && (
          <p className="text-muted-foreground p-2 text-center text-xs">Nenhum negócio</p>
        )}
      </div>
    </div>
  );
}

export { PipelineColumn };
