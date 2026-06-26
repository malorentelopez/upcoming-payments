import { Suspense } from "react";

import {
  DashboardClient,
  DashboardSkeleton,
} from "@/components/dashboard/dashboard-client";
import { getDashboardData } from "@/lib/data/queries";
import { getMonthKey } from "@/lib/payments/occurrences";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const initialMonth = params.month ?? getMonthKey(new Date());

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent initialMonth={initialMonth} />
    </Suspense>
  );
}

async function DashboardContent({ initialMonth }: { initialMonth: string }) {
  const { payments, profile } = await getDashboardData();

  return (
    <DashboardClient
      payments={payments}
      defaultCurrency={profile?.default_currency ?? "USD"}
      initialMonth={initialMonth}
    />
  );
}
