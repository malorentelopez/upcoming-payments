"use client";

import { useTranslations } from "next-intl";

import { PaymentCard } from "@/components/payments/payment-card";
import { StaggerItem, StaggerList } from "@/components/motion/page-transition";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import type { PaymentOccurrence } from "@/lib/types";

export type HorizonDays = 7 | 14;

interface DashboardUpcomingHeroProps {
  horizonDays: HorizonDays;
  onHorizonDaysChange: (days: HorizonDays) => void;
  total: number;
  defaultCurrency: string;
  intlLocale: string;
}

export function DashboardUpcomingHero({
  horizonDays,
  onHorizonDaysChange,
  total,
  defaultCurrency,
  intlLocale,
}: DashboardUpcomingHeroProps) {
  const t = useTranslations("dashboard");
  const { formatAmount } = useFormatCurrency();

  return (
    <section className="relative z-10 overflow-hidden rounded-2xl border border-primary/20 bg-card bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 max-md:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.18)] before:pointer-events-none before:absolute before:-right-8 before:-top-8 before:size-32 before:rounded-full before:bg-primary/10 dark:max-md:shadow-[0_14px_28px_-8px_rgba(0,0,0,0.45)]">
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">{t("comingUp")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("nextDays", { days: horizonDays })}</p>
        </div>
        <HorizonToggle days={horizonDays} onChange={onHorizonDaysChange} />
      </div>
      <p className="relative mt-4 text-3xl font-semibold tabular-nums tracking-tight text-primary">
        {formatAmount(total, defaultCurrency, intlLocale)}
      </p>
    </section>
  );
}

interface DashboardUpcomingListProps {
  occurrences: PaymentOccurrence[];
  horizonDays: HorizonDays;
  defaultCurrency: string;
  intlLocale: string;
  showLedgerBadge?: boolean;
}

export function DashboardUpcomingList({
  occurrences,
  horizonDays,
  defaultCurrency,
  intlLocale,
  showLedgerBadge = false,
}: DashboardUpcomingListProps) {
  const t = useTranslations("dashboard");

  if (occurrences.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
        {t("emptyHorizon", { days: horizonDays })}
      </p>
    );
  }

  return (
    <StaggerList className="space-y-3">
      {occurrences.map((occurrence) => (
        <StaggerItem key={`horizon-${occurrence.paymentId}-${occurrence.dueDate.toISOString()}`}>
          <PaymentCard
            occurrence={occurrence}
            currency={defaultCurrency}
            intlLocale={intlLocale}
            showLedgerBadge={showLedgerBadge}
          />
        </StaggerItem>
      ))}
    </StaggerList>
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
