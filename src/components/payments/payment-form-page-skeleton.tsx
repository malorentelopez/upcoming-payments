import { Skeleton } from "@/components/ui/skeleton";

export function PaymentFormPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-40" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
