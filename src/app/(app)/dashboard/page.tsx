import { Suspense } from "react";

import {
  DashboardClient,
  DashboardSkeleton,
} from "@/components/dashboard/dashboard-client";
import { getProfile } from "@/lib/data/queries";
import { getInitialMonthKey } from "@/lib/payments/occurrences";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const profile = await getProfile();
  const cycleStartDay = profile?.income_cycle_day ?? 1;
  const initialMonth = params.month ?? getInitialMonthKey(new Date(), cycleStartDay);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient initialMonth={initialMonth} />
    </Suspense>
  );
}
