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
import { PageTransition } from "@/components/motion/page-transition";
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

function buildDashboardUrl(view: DashboardView, monthKey?: string): string {
  const params = new URLSearchParams();
  if (view === "month") {
    params.set("view", "month");
    if (monthKey) {
      params.set("month", monthKey);
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
  const monthParam = searchParams.get("month") ?? initialMonth;
  const { year, month } = parseMonthParam(monthParam);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const [horizonDays, setHorizonDays] = useState<HorizonDays>(14);

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
    () => expandAllOccurrences(payments, horizonRange.start, horizonRange.end),
    [payments, horizonRange.start, horizonRange.end],
  );

  const monthOccurrences = useMemo(
    () => expandAllOccurrences(payments, start, end),
    [payments, start, end],
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
        buildDashboardUrl(nextView, nextView === "month" ? monthKey : undefined),
      );
    });
  }

  function navigateMonth(delta: number) {
    const next = shiftMonth(year, month, delta);
    const key = `${next.year}-${String(next.month).padStart(2, "0")}`;
    startTransition(() => {
      router.replace(buildDashboardUrl("month", key));
    });
  }

  return (
    <PageTransition className="flex h-full min-h-0 flex-col overflow-hidden md:h-auto md:space-y-6 md:overflow-visible">
      <div className="shrink-0 space-y-4 md:space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
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

      <div className="relative min-h-0 flex-1 md:static">
        <div className="no-scrollbar h-full min-h-0 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] md:h-auto md:overflow-visible">
          <div className="space-y-6 pt-4 pb-8 md:pt-0 md:pb-0">
            {view === "upcoming" ? (
              <DashboardUpcomingList
                occurrences={horizonOccurrences}
                horizonDays={horizonDays}
                defaultCurrency={defaultCurrency}
                intlLocale={intlLocale}
              />
            ) : (
              <DashboardMonthList
                visibleOccurrences={visibleMonthList}
                collapsedOccurrences={collapsedMonthList}
                viewingPastMonth={viewingPastMonth}
                hasPayments={payments.length > 0}
                defaultCurrency={defaultCurrency}
                intlLocale={intlLocale}
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
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden md:h-auto md:space-y-6 md:overflow-visible">
      <div className="shrink-0 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pt-4 md:flex-none md:overflow-visible md:pt-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
