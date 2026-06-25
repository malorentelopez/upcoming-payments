"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useTransition } from "react";

import {
  CategoryDonut,
  MonthlyBarChart,
} from "@/components/charts/insights-charts";
import { PageTransition } from "@/components/motion/page-transition";
import {
  expandAllOccurrences,
  getMonthRange,
  getMonthsWindow,
  groupByCategory,
  parseMonthParam,
  shiftMonth,
  sumOccurrences,
} from "@/lib/payments/occurrences";
import { formatCurrency, formatMonthYear } from "@/lib/payments/formatters";
import type { Payment } from "@/lib/types";

interface InsightsClientProps {
  payments: Payment[];
  defaultCurrency: string;
  initialMonth: string;
}

export function InsightsClient({
  payments,
  defaultCurrency,
  initialMonth,
}: InsightsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const monthParam = searchParams.get("month") ?? initialMonth;
  const { year, month } = parseMonthParam(monthParam);
  const { start, end } = getMonthRange(year, month);

  const monthlyData = useMemo(() => {
    return getMonthsWindow(year, month, 6).map(({ year: y, month: m, label }) => {
      const range = getMonthRange(y, m);
      const occurrences = expandAllOccurrences(payments, range.start, range.end);
      return {
        label,
        total: sumOccurrences(occurrences, defaultCurrency),
      };
    });
  }, [payments, year, month, defaultCurrency]);

  const categoryData = useMemo(() => {
    const occurrences = expandAllOccurrences(payments, start, end);
    const grouped = groupByCategory(occurrences);
    return Array.from(grouped.values()).map(({ category, total }) => ({
      name: category?.name ?? "Uncategorized",
      value: total,
      color: category?.color,
    }));
  }, [payments, start, end]);

  const monthTotal = sumOccurrences(
    expandAllOccurrences(payments, start, end),
    defaultCurrency,
  );

  function navigateMonth(delta: number) {
    const next = shiftMonth(year, month, delta);
    const key = `${next.year}-${String(next.month).padStart(2, "0")}`;
    startTransition(() => {
      router.push(`/insights?month=${key}`);
    });
  }

  return (
    <PageTransition className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Trends</p>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
      </header>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Last 6 months
        </h2>
        <MonthlyBarChart data={monthlyData} currency={defaultCurrency} />
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              By category
            </h2>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrency(monthTotal, defaultCurrency)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-28 text-center text-sm font-medium">
              {formatMonthYear(year, month)}
            </span>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <CategoryDonut data={categoryData} currency={defaultCurrency} />
        <ul className="mt-4 space-y-2">
          {categoryData.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color ?? "#64748b" }}
                />
                {item.name}
              </span>
              <span className="font-medium tabular-nums">
                {formatCurrency(item.value, defaultCurrency)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </PageTransition>
  );
}
