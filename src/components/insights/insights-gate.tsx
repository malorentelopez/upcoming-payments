"use client";

import { useAppData } from "@/components/data/app-data-provider";
import { InsightsClient } from "@/components/insights/insights-client";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsGateProps {
  initialMonth: string;
}

export function InsightsGate({ initialMonth }: InsightsGateProps) {
  const { payments, defaultCurrency, hasCache } = useAppData();

  if (!hasCache) {
    return (
      <div className="space-y-8" aria-busy="true">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <InsightsClient
      payments={payments}
      defaultCurrency={defaultCurrency}
      initialMonth={initialMonth}
    />
  );
}
