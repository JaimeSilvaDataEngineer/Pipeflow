import { Skeleton } from "@/components/ui/skeleton";

function PipelineBoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 6 }).map((_, columnIndex) => (
        <div key={columnIndex} className="flex w-72 shrink-0 flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, cardIndex) => (
              <Skeleton key={cardIndex} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { PipelineBoardSkeleton };
