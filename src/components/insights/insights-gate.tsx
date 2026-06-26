"use client";

import { useEffect } from "react";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-client";
import { InsightsClient } from "@/components/insights/insights-client";
import { useAppData } from "@/components/data/app-data-provider";

interface InsightsGateProps {
  initialMonth: string;
}

export function InsightsGate({ initialMonth }: InsightsGateProps) {
  const { payments, defaultCurrency, hasCache, isLoading, loadIfEmpty } = useAppData();

  useEffect(() => {
    void loadIfEmpty();
  }, [loadIfEmpty]);

  if (!hasCache || isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <InsightsClient
      payments={payments}
      defaultCurrency={defaultCurrency}
      initialMonth={initialMonth}
    />
  );
}
