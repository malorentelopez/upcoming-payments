import { Suspense } from "react";

import { InsightsClient } from "@/components/insights/insights-client";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-client";
import { getPayments, getProfile } from "@/lib/data/queries";
import { getMonthKey } from "@/lib/payments/occurrences";

interface InsightsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const params = await searchParams;
  const initialMonth = params.month ?? getMonthKey(new Date());

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <InsightsContent initialMonth={initialMonth} />
    </Suspense>
  );
}

async function InsightsContent({ initialMonth }: { initialMonth: string }) {
  const [payments, profile] = await Promise.all([getPayments(), getProfile()]);

  return (
    <InsightsClient
      payments={payments}
      defaultCurrency={profile?.default_currency ?? "USD"}
      initialMonth={initialMonth}
    />
  );
}
