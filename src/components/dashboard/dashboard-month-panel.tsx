"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { CollapsiblePaymentSection } from "@/components/dashboard/collapsible-payment-section";
import { PaymentCard } from "@/components/payments/payment-card";
import { StaggerItem, StaggerList } from "@/components/motion/page-transition";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import { formatMonthYear } from "@/lib/payments/formatters";
import type { PaymentOccurrence } from "@/lib/types";

interface DashboardMonthHeroProps {
  year: number;
  month: number;
  viewingCurrentMonth: boolean;
  monthPending: number;
  monthTotal: number;
  defaultCurrency: string;
  intlLocale: string;
  onNavigateMonth: (delta: number) => void;
}

export function DashboardMonthHero({
  year,
  month,
  viewingCurrentMonth,
  monthPending,
  monthTotal,
  defaultCurrency,
  intlLocale,
  onNavigateMonth,
}: DashboardMonthHeroProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const { formatAmount } = useFormatCurrency();

  return (
    <section className="relative z-10 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-card p-5 max-md:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.18)] dark:max-md:shadow-[0_14px_28px_-8px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigateMonth(-1)}
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
                {formatAmount(monthPending, defaultCurrency, intlLocale)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {t("totalThisMonth", {
                  amount: formatAmount(monthTotal, defaultCurrency, intlLocale),
                })}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{t("dueThisMonth")}</p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {formatAmount(monthTotal, defaultCurrency, intlLocale)}
              </p>
            </>
          )}
          <p className="mt-1 text-sm font-medium">
            {formatMonthYear(year, month, intlLocale)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateMonth(1)}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={tCommon("nextMonth")}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}

interface DashboardMonthListProps {
  visibleOccurrences: PaymentOccurrence[];
  collapsedOccurrences: PaymentOccurrence[];
  viewingPastMonth: boolean;
  hasPayments: boolean;
  defaultCurrency: string;
  intlLocale: string;
  showLedgerBadge?: boolean;
}

export function DashboardMonthList({
  visibleOccurrences,
  collapsedOccurrences,
  viewingPastMonth,
  hasPayments,
  defaultCurrency,
  intlLocale,
  showLedgerBadge = false,
}: DashboardMonthListProps) {
  const t = useTranslations("dashboard");

  if (visibleOccurrences.length === 0 && collapsedOccurrences.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center">
        <p className="font-medium">
          {hasPayments ? t("emptyNoneDue") : t("emptyNoPayments")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasPayments ? t("emptyTryAnotherMonth") : t("emptyGetStarted")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleOccurrences.length > 0 ? (
        <StaggerList className="space-y-3">
          {visibleOccurrences.map((occurrence) => (
            <StaggerItem key={`${occurrence.paymentId}-${occurrence.dueDate.toISOString()}`}>
              <PaymentCard
                occurrence={occurrence}
                currency={defaultCurrency}
                intlLocale={intlLocale}
                showLedgerBadge={showLedgerBadge}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      ) : null}

      <CollapsiblePaymentSection
        title={
          viewingPastMonth
            ? t("pastMonth", { count: collapsedOccurrences.length })
            : t("pastDue", { count: collapsedOccurrences.length })
        }
        showLabel={viewingPastMonth ? t("showPastMonth") : t("showPastDue")}
        hideLabel={viewingPastMonth ? t("hidePastMonth") : t("hidePastDue")}
        occurrences={collapsedOccurrences}
        currency={defaultCurrency}
        intlLocale={intlLocale}
        showLedgerBadge={showLedgerBadge}
      />
    </div>
  );
}
