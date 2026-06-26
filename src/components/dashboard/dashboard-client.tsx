"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";

import { CollapsiblePaymentSection } from "@/components/dashboard/collapsible-payment-section";
import { PaymentCard } from "@/components/payments/payment-card";
import { PageTransition, StaggerItem, StaggerList } from "@/components/motion/page-transition";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatCurrency, formatMonthYear } from "@/lib/payments/formatters";
import { localeToIntl } from "@/lib/i18n/locale";
import { sanitizeHexColor } from "@/lib/security/colors";
import type { CategoryView, PaymentOccurrence, PaymentType, PaymentView } from "@/lib/types";

interface DashboardClientProps {
  payments: PaymentView[];
  categories: CategoryView[];
  defaultCurrency: string;
  initialMonth: string;
}

type HorizonDays = 7 | 14;

function applyFilters(
  items: PaymentOccurrence[],
  search: string,
  categoryFilter: string | null,
  typeFilter: PaymentType | null,
): PaymentOccurrence[] {
  let filtered = items;

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((o) => o.name.toLowerCase().includes(q));
  }
  if (categoryFilter) {
    filtered = filtered.filter((o) => o.category?.id === categoryFilter);
  }
  if (typeFilter) {
    filtered = filtered.filter((o) => o.type === typeFilter);
  }

  return filtered;
}

export function DashboardClient({
  payments,
  categories,
  defaultCurrency,
  initialMonth,
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const t = useTranslations("dashboard");
  const tPayments = useTranslations("payments.types");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const intlLocale = localeToIntl(locale as "en" | "fr" | "es" | "de");

  const monthParam = searchParams.get("month") ?? initialMonth;
  const { year, month } = parseMonthParam(monthParam);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<PaymentType | null>(null);
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

  const horizonOccurrences = useMemo(() => {
    const items = expandAllOccurrences(payments, horizonRange.start, horizonRange.end);
    return applyFilters(items, search, categoryFilter, typeFilter);
  }, [payments, horizonRange.start, horizonRange.end, search, categoryFilter, typeFilter]);

  const monthOccurrences = useMemo(() => {
    const items = expandAllOccurrences(payments, start, end);
    return applyFilters(items, search, categoryFilter, typeFilter);
  }, [payments, start, end, search, categoryFilter, typeFilter]);

  const { upcoming: monthUpcoming, pastDue: monthPastDue } = useMemo(
    () => splitOccurrencesByDueDate(monthOccurrences, today),
    [monthOccurrences, today],
  );

  const monthTotal = sumOccurrences(monthOccurrences, defaultCurrency);
  const monthPending = sumOccurrences(monthUpcoming, defaultCurrency);
  const horizonTotal = sumOccurrences(horizonOccurrences, defaultCurrency);

  const visibleMonthList = viewingPastMonth ? [] : viewingFutureMonth ? monthOccurrences : monthUpcoming;
  const collapsedMonthList = viewingPastMonth ? monthOccurrences : monthPastDue;

  function navigateMonth(delta: number) {
    const next = shiftMonth(year, month, delta);
    const key = `${next.year}-${String(next.month).padStart(2, "0")}`;
    startTransition(() => {
      router.push(`/dashboard?month=${key}`);
    });
  }

  const types: PaymentType[] = ["recurring", "installment", "one_off"];

  return (
    <PageTransition className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </header>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">{t("comingUp")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("nextDays", { days: horizonDays })}</p>
          </div>
          <HorizonToggle days={horizonDays} onChange={setHorizonDays} />
        </div>
        <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight">
          {formatCurrency(horizonTotal, defaultCurrency, intlLocale)}
        </p>
        {horizonOccurrences.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t("emptyHorizon", { days: horizonDays })}
          </p>
        ) : (
          <StaggerList className="mt-4 space-y-2">
            {horizonOccurrences.map((occurrence) => (
              <StaggerItem key={`horizon-${occurrence.paymentId}-${occurrence.dueDate.toISOString()}`}>
                <PaymentCard
                  occurrence={occurrence}
                  currency={defaultCurrency}
                  intlLocale={intlLocale}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </section>

      <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-card p-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={tCommon("previousMonth")}
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            {viewingCurrentMonth ? (
              <>
                <p className="text-sm text-muted-foreground">{t("stillToPay")}</p>
                <p className="text-3xl font-semibold tabular-nums tracking-tight">
                  {formatCurrency(monthPending, defaultCurrency, intlLocale)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  {t("totalThisMonth", {
                    amount: formatCurrency(monthTotal, defaultCurrency, intlLocale),
                  })}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{t("dueThisMonth")}</p>
                <p className="text-3xl font-semibold tabular-nums tracking-tight">
                  {formatCurrency(monthTotal, defaultCurrency, intlLocale)}
                </p>
              </>
            )}
            <p className="mt-1 text-sm font-medium">
              {formatMonthYear(year, month, intlLocale)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={tCommon("nextMonth")}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </section>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 rounded-xl pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label={t("allTypes")}
          active={!typeFilter}
          onClick={() => setTypeFilter(null)}
        />
        {types.map((paymentType) => (
          <FilterChip
            key={paymentType}
            label={tPayments(paymentType)}
            active={typeFilter === paymentType}
            onClick={() =>
              setTypeFilter(typeFilter === paymentType ? null : paymentType)
            }
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label={t("allCategories")}
          active={!categoryFilter}
          onClick={() => setCategoryFilter(null)}
        />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            active={categoryFilter === cat.id}
            onClick={() =>
              setCategoryFilter(categoryFilter === cat.id ? null : cat.id)
            }
            color={cat.color}
          />
        ))}
      </div>

      {visibleMonthList.length === 0 && collapsedMonthList.length === 0 ? (
        <EmptyState hasPayments={payments.length > 0} t={t} />
      ) : (
        <div className="space-y-3">
          {visibleMonthList.length > 0 ? (
            <StaggerList className="space-y-3">
              {visibleMonthList.map((occurrence) => (
                <StaggerItem key={`${occurrence.paymentId}-${occurrence.dueDate.toISOString()}`}>
                  <PaymentCard
                    occurrence={occurrence}
                    currency={defaultCurrency}
                    intlLocale={intlLocale}
                  />
                </StaggerItem>
              ))}
            </StaggerList>
          ) : null}

          <CollapsiblePaymentSection
            title={
              viewingPastMonth
                ? t("pastMonth", { count: collapsedMonthList.length })
                : t("pastDue", { count: collapsedMonthList.length })
            }
            showLabel={viewingPastMonth ? t("showPastMonth") : t("showPastDue")}
            hideLabel={viewingPastMonth ? t("hidePastMonth") : t("hidePastDue")}
            occurrences={collapsedMonthList}
            currency={defaultCurrency}
            intlLocale={intlLocale}
          />
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {viewingCurrentMonth && monthPastDue.length > 0 ? (
          <>
            {t("upcomingCount", { count: monthUpcoming.length })}
            {" · "}
            {t("pastDueCount", { count: monthPastDue.length })}
          </>
        ) : (
          t("paymentCount", { count: monthOccurrences.length })
        )}
      </p>
    </PageTransition>
  );
}

function HorizonToggle({
  days,
  onChange,
}: {
  days: HorizonDays;
  onChange: (days: HorizonDays) => void;
}) {
  const options: HorizonDays[] = [7, 14];

  return (
    <div className="flex rounded-full border border-border/60 bg-muted/40 p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            days === option
              ? "rounded-full bg-background px-3 py-1 text-xs font-medium shadow-sm"
              : "rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button type="button" onClick={onClick}>
      <Badge
        variant={active ? "default" : "secondary"}
        className="cursor-pointer rounded-full px-3 py-1 capitalize"
        style={active && color ? { backgroundColor: sanitizeHexColor(color) } : undefined}
      >
        {label}
      </Badge>
    </button>
  );
}

function EmptyState({
  hasPayments,
  t,
}: {
  hasPayments: boolean;
  t: (key: "emptyNoneDue" | "emptyNoPayments" | "emptyTryFilters" | "emptyGetStarted") => string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center">
      <p className="font-medium">
        {hasPayments ? t("emptyNoneDue") : t("emptyNoPayments")}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasPayments ? t("emptyTryFilters") : t("emptyGetStarted")}
      </p>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-44 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
