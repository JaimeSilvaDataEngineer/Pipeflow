import { Skeleton } from "@/components/ui/skeleton";

function LeadsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full sm:max-w-xs" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="border-border overflow-hidden rounded-lg border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b p-3 last:border-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { LeadsTableSkeleton };
