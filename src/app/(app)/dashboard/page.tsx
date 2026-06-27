import { Suspense } from "react";

import {
  DashboardClient,
  DashboardSkeleton,
} from "@/components/dashboard/dashboard-client";
import { getMonthKey } from "@/lib/payments/occurrences";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const initialMonth = params.month ?? getMonthKey(new Date());

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient initialMonth={initialMonth} />
    </Suspense>
  );
}
