"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";

import {
  DashboardMonthHero,
  DashboardMonthList,
} from "@/components/dashboard/dashboard-month-panel";
import {
  DashboardUpcomingHero,
  DashboardUpcomingList,
  type HorizonDays,
} from "@/components/dashboard/dashboard-upcoming-panel";
import { LedgerFilterSwitcher } from "@/components/ledger/ledger-filter";
import { PageTransition } from "@/components/motion/page-transition";
import { MotionEntranceProvider } from "@/components/motion/motion-entrance";
import { ScrollFadeOverlay } from "@/components/layout/scroll-fade-overlay";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  expandAllOccurrences,
  getHorizonRange,
  getMonthRange,
  isCurrentMonth,
  isFutureMonth,
  isPastMonth,
  parseMonthParam,
  shiftMonth,
  splitOccurrencesByDueDate,
  startOfToday,
  sumOccurrences,
} from "@/lib/payments/occurrences";
import { localeToIntl } from "@/lib/i18n/locale";
import {
  appendLedgerParam,
  filterPaymentsByLedger,
  parseLedgerFilter,
  type LedgerFilter,
} from "@/lib/payments/ledger";
import type { PaymentView } from "@/lib/types";

interface DashboardClientProps {
  payments: PaymentView[];
  defaultCurrency: string;
  initialMonth: string;
}

type DashboardView = "upcoming" | "month";

function parseViewParam(value: string | null): DashboardView {
  return value === "month" ? "month" : "upcoming";
}

function buildDashboardUrl(options: {
  view: DashboardView;
  monthKey?: string;
  ledger: LedgerFilter;
}): string {
  const params = new URLSearchParams();
  appendLedgerParam(params, options.ledger);
  if (options.view === "month") {
    params.set("view", "month");
    if (options.monthKey) {
      params.set("month", options.monthKey);
    }
  }
  const query = params.toString();
  return query ? `/dashboard?${query}` : "/dashboard";
}

export function DashboardClient({
  payments,
  defaultCurrency,
  initialMonth,
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const intlLocale = localeToIntl(locale as "en" | "fr" | "es" | "de");

  const view = parseViewParam(searchParams.get("view"));
  const ledger = parseLedgerFilter(searchParams.get("ledger"));
  const monthParam = searchParams.get("month") ?? initialMonth;
  const { year, month } = parseMonthParam(monthParam);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const [horizonDays, setHorizonDays] = useState<HorizonDays>(14);

  const filteredPayments = useMemo(
    () => filterPaymentsByLedger(payments, ledger),
    [payments, ledger],
  );

  const today = useMemo(() => startOfToday(), []);
  const viewingCurrentMonth = isCurrentMonth(year, month, today);
  const viewingPastMonth = isPastMonth(year, month, today);
  const viewingFutureMonth = isFutureMonth(year, month, today);

  const { start, end } = getMonthRange(year, month);
  const horizonRange = useMemo(
    () => getHorizonRange(horizonDays, today),
    [horizonDays, today],
  );

  const horizonOccurrences = useMemo(
    () => expandAllOccurrences(filteredPayments, horizonRange.start, horizonRange.end),
    [filteredPayments, horizonRange.start, horizonRange.end],
  );

  const monthOccurrences = useMemo(
    () => expandAllOccurrences(filteredPayments, start, end),
    [filteredPayments, start, end],
  );

  const { upcoming: monthUpcoming, pastDue: monthPastDue } = useMemo(
    () => splitOccurrencesByDueDate(monthOccurrences, today),
    [monthOccurrences, today],
  );

  const monthTotal = sumOccurrences(monthOccurrences, defaultCurrency);
  const monthPending = sumOccurrences(monthUpcoming, defaultCurrency);
  const horizonTotal = sumOccurrences(horizonOccurrences, defaultCurrency);

  const visibleMonthList = viewingPastMonth ? [] : viewingFutureMonth ? monthOccurrences : monthUpcoming;
  const collapsedMonthList = viewingPastMonth ? monthOccurrences : monthPastDue;

  function setView(nextView: DashboardView) {
    if (nextView === view) {
      return;
    }
    startTransition(() => {
      router.replace(
        buildDashboardUrl({
          view: nextView,
          monthKey: nextView === "month" ? monthKey : undefined,
          ledger,
        }),
      );
    });
  }

  function setLedger(nextLedger: LedgerFilter) {
    if (nextLedger === ledger) {
      return;
    }
    startTransition(() => {
      router.replace(
        buildDashboardUrl({
          view,
          monthKey: view === "month" ? monthKey : undefined,
          ledger: nextLedger,
        }),
      );
    });
  }

  function navigateMonth(delta: number) {
    const next = shiftMonth(year, month, delta);
    const key = `${next.year}-${String(next.month).padStart(2, "0")}`;
    startTransition(() => {
      router.replace(
        buildDashboardUrl({ view: "month", monthKey: key, ledger }),
      );
    });
  }

  return (
    <MotionEntranceProvider entrance={false}>
      <PageTransition className="flex h-full min-h-0 flex-col overflow-hidden md:h-auto md:space-y-6 md:overflow-visible">
      <div className="relative z-10 shrink-0 space-y-4 md:space-y-6">
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <LedgerFilterSwitcher value={ledger} onChange={setLedger} />
        </header>

        <Tabs value={view} onValueChange={(value) => setView(value as DashboardView)} className="gap-4">
          <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="upcoming" className="rounded-lg">
              {t("tabUpcoming")}
            </TabsTrigger>
            <TabsTrigger value="month" className="rounded-lg">
              {t("tabMonth")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            <DashboardUpcomingHero
              horizonDays={horizonDays}
              onHorizonDaysChange={setHorizonDays}
              total={horizonTotal}
              defaultCurrency={defaultCurrency}
              intlLocale={intlLocale}
            />
          </TabsContent>

          <TabsContent value="month" className="mt-0">
            <DashboardMonthHero
              year={year}
              month={month}
              viewingCurrentMonth={viewingCurrentMonth}
              monthPending={monthPending}
              monthTotal={monthTotal}
              defaultCurrency={defaultCurrency}
              intlLocale={intlLocale}
              onNavigateMonth={navigateMonth}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="relative z-0 min-h-0 flex-1 max-md:-mt-4 md:static">
        <div className="no-scrollbar h-full min-h-0 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] md:h-auto md:overflow-visible">
          <div className="space-y-6 pb-8 max-md:pt-8 md:pb-0">
            {view === "upcoming" ? (
              <DashboardUpcomingList
                occurrences={horizonOccurrences}
                horizonDays={horizonDays}
                defaultCurrency={defaultCurrency}
                intlLocale={intlLocale}
                showLedgerBadge={ledger === "all"}
              />
            ) : (
              <DashboardMonthList
                visibleOccurrences={visibleMonthList}
                collapsedOccurrences={collapsedMonthList}
                viewingPastMonth={viewingPastMonth}
                hasPayments={filteredPayments.length > 0}
                defaultCurrency={defaultCurrency}
                intlLocale={intlLocale}
                showLedgerBadge={ledger === "all"}
              />
            )}

            <p className="pb-1 text-center text-xs text-muted-foreground">
              {view === "upcoming" ? (
                t("horizonCount", { count: horizonOccurrences.length, days: horizonDays })
              ) : viewingCurrentMonth && monthPastDue.length > 0 ? (
                <>
                  {t("upcomingCount", { count: monthUpcoming.length })}
                  {" · "}
                  {t("pastDueCount", { count: monthPastDue.length })}
                </>
              ) : (
                t("paymentCount", { count: monthOccurrences.length })
              )}
            </p>
          </div>
        </div>
        <ScrollFadeOverlay variant="inset" className="absolute inset-x-0 bottom-0 z-10 h-20 md:hidden" />
      </div>
    </PageTransition>
    </MotionEntranceProvider>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden md:h-auto md:space-y-6 md:overflow-visible">
      <div className="relative z-10 shrink-0 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto max-md:-mt-4 max-md:pt-8 md:flex-none md:overflow-visible md:pt-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
