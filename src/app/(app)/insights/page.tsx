import { InsightsGate } from "@/components/insights/insights-gate";
import { getMonthKey } from "@/lib/payments/occurrences";

interface InsightsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const params = await searchParams;
  const initialMonth = params.month ?? getMonthKey(new Date());

  return <InsightsGate initialMonth={initialMonth} />;
}
