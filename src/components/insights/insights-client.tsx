"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";

import {
  CategoryDonut,
  MonthlyBarChart,
} from "@/components/charts/insights-charts";
import { LedgerFilterSwitcher } from "@/components/ledger/ledger-filter";
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
import { localeToIntl } from "@/lib/i18n/locale";
import {
  appendLedgerParam,
  filterPaymentsByLedger,
  parseLedgerFilter,
  type LedgerFilter,
} from "@/lib/payments/ledger";
import { sanitizeHexColor } from "@/lib/security/colors";
import type { PaymentView } from "@/lib/types";

interface InsightsClientProps {
  payments: PaymentView[];
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
  const t = useTranslations("insights");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const intlLocale = localeToIntl(locale as "en" | "fr" | "es" | "de");

  const monthParam = searchParams.get("month") ?? initialMonth;
  const ledger = parseLedgerFilter(searchParams.get("ledger"));
  const { year, month } = parseMonthParam(monthParam);
  const { start, end } = getMonthRange(year, month);

  const filteredPayments = useMemo(
    () => filterPaymentsByLedger(payments, ledger),
    [payments, ledger],
  );

  const monthlyData = useMemo(() => {
    return getMonthsWindow(year, month, 6, intlLocale).map(
      ({ year: y, month: m, label }) => {
        const range = getMonthRange(y, m);
        const occurrences = expandAllOccurrences(filteredPayments, range.start, range.end);
        return {
          label,
          total: sumOccurrences(occurrences, defaultCurrency),
        };
      },
    );
  }, [filteredPayments, year, month, defaultCurrency, intlLocale]);

  const categoryData = useMemo(() => {
    const occurrences = expandAllOccurrences(filteredPayments, start, end);
    const grouped = groupByCategory(occurrences);
    return Array.from(grouped.values()).map(({ category, total }) => ({
      name: category?.name ?? t("uncategorized"),
      value: total,
      color: category?.color,
    }));
  }, [filteredPayments, start, end, t]);

  const monthTotal = sumOccurrences(
    expandAllOccurrences(filteredPayments, start, end),
    defaultCurrency,
  );

  function setLedger(nextLedger: LedgerFilter) {
    if (nextLedger === ledger) {
      return;
    }
    const params = new URLSearchParams({ month: monthParam });
    appendLedgerParam(params, nextLedger);
    startTransition(() => {
      router.push(`/insights?${params.toString()}`);
    });
  }

  function navigateMonth(delta: number) {
    const next = shiftMonth(year, month, delta);
    const key = `${next.year}-${String(next.month).padStart(2, "0")}`;
    const params = new URLSearchParams({ month: key });
    appendLedgerParam(params, ledger);
    startTransition(() => {
      router.push(`/insights?${params.toString()}`);
    });
  }

  return (
    <PageTransition className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{t("trends")}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        </div>
        <LedgerFilterSwitcher value={ledger} onChange={setLedger} className="mt-1" />
      </header>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          {t("lastSixMonths")}
        </h2>
        <MonthlyBarChart data={monthlyData} currency={defaultCurrency} intlLocale={intlLocale} />
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("byCategory")}
            </h2>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrency(monthTotal, defaultCurrency, intlLocale)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label={tCommon("previousMonth")}
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-28 text-center text-sm font-medium">
              {formatMonthYear(year, month, intlLocale)}
            </span>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label={tCommon("nextMonth")}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <CategoryDonut data={categoryData} currency={defaultCurrency} intlLocale={intlLocale} />
        <ul className="mt-4 space-y-2">
          {categoryData.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: sanitizeHexColor(item.color, "#64748b") }}
                />
                {item.name}
              </span>
              <span className="font-medium tabular-nums">
                {formatCurrency(item.value, defaultCurrency, intlLocale)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </PageTransition>
  );
}
