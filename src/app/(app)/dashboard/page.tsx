import { Suspense } from "react";

import {
  DashboardClient,
  DashboardSkeleton,
} from "@/components/dashboard/dashboard-client";
import { getPayments, getProfile } from "@/lib/data/queries";
import { getMonthKey } from "@/lib/payments/occurrences";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const [payments, profile] = await Promise.all([getPayments(), getProfile()]);

  const initialMonth = params.month ?? getMonthKey(new Date());
  const defaultCurrency = profile?.default_currency ?? "USD";

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient
        payments={payments}
        defaultCurrency={defaultCurrency}
        initialMonth={initialMonth}
      />
    </Suspense>
  );
}
