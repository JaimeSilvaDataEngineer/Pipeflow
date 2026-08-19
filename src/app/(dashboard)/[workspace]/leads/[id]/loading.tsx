import { Skeleton } from "@/components/ui/skeleton";

export default function LeadDetailLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-32" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-1" />
        <Skeleton className="h-80 lg:col-span-2" />
      </div>
    </div>
  );
}
