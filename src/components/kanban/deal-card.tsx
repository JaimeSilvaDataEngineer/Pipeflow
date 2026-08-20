"use client";

import { useDraggable } from "@dnd-kit/core";
import { CalendarIcon } from "lucide-react";

import { DealFormDialog } from "@/components/kanban/deal-form-dialog";
import { MemberAvatar } from "@/components/leads/member-avatar";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { getLeadById } from "@/lib/mock/leads";
import { cn } from "@/lib/utils";
import type { DealFormValues } from "@/lib/validations/deal";
import type { Deal } from "@/types/deal";

function formatDueDate(dueDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(dueDate));
}

function DealCard({
  deal,
  onEdit,
}: {
  deal: Deal;
  onEdit: (dealId: string, values: DealFormValues) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  });
  const lead = getLeadById(deal.leadId);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={cn("touch-none", isDragging && "z-10 opacity-50")}
    >
      <DealFormDialog
        deal={deal}
        onSubmit={(values) => onEdit(deal.id, values)}
        trigger={
          <Card className="cursor-grab gap-2 p-3 shadow-sm active:cursor-grabbing">
            <p className="text-foreground text-sm font-medium">{deal.title}</p>
            <p className="text-sm font-semibold text-blue-700">
              {formatCurrency(deal.valueCents)}
            </p>
            {lead && <p className="text-muted-foreground truncate text-xs">{lead.company}</p>}
            <div className="mt-1 flex items-center justify-between">
              <MemberAvatar memberId={deal.assignedTo} className="size-5 text-xs" />
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <CalendarIcon className="size-3" />
                {formatDueDate(deal.dueDate)}
              </span>
            </div>
          </Card>
        }
      />
    </div>
  );
}

export { DealCard };
