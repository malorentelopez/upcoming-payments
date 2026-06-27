"use client";

import { AppShellGate } from "@/components/data/app-shell-gate";
import { useAppData } from "@/components/data/app-data-provider";
import { InsightsClient } from "@/components/insights/insights-client";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsGateProps {
  initialMonth: string;
}

function InsightsSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}

export function InsightsGate({ initialMonth }: InsightsGateProps) {
  const { payments, defaultCurrency } = useAppData();

  return (
    <AppShellGate skeleton={<InsightsSkeleton />}>
      <InsightsClient
        payments={payments}
        defaultCurrency={defaultCurrency}
        initialMonth={initialMonth}
      />
    </AppShellGate>
  );
}
