import { Skeleton } from "@/components/ui/skeleton";

export function PaymentDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-48 max-w-full" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 w-full rounded-xl sm:flex-1" />
        <Skeleton className="h-11 w-full rounded-xl sm:flex-1" />
        <Skeleton className="h-11 w-full rounded-xl sm:flex-1" />
      </div>
    </div>
  );
}
