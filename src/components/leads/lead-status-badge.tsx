import { PIPELINE_STAGE_COLORS } from "@/lib/constants/pipeline";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

function LeadStatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  const definition = LEAD_STATUSES.find((item) => item.id === status);

  if (!definition) return null;

  return (
    <span
      data-slot="lead-status-badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        PIPELINE_STAGE_COLORS[definition.color],
        className,
      )}
    >
      {definition.label}
    </span>
  );
}

export { LeadStatusBadge };
