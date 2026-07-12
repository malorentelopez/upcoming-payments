import { InsightsGate } from "@/components/insights/insights-gate";
import { getProfile } from "@/lib/data/queries";
import { getInitialMonthKey } from "@/lib/payments/occurrences";

interface InsightsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const params = await searchParams;
  const profile = await getProfile();
  const cycleStartDay = profile?.income_cycle_day ?? 1;
  const initialMonth = params.month ?? getInitialMonthKey(new Date(), cycleStartDay);

  return <InsightsGate initialMonth={initialMonth} />;
}
