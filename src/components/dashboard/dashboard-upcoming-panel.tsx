"use client";

import { useTranslations } from "next-intl";

import { PaymentCard } from "@/components/payments/payment-card";
import { StaggerItem, StaggerList } from "@/components/motion/page-transition";
import { formatCurrency } from "@/lib/payments/formatters";
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

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{t("comingUp")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("nextDays", { days: horizonDays })}</p>
        </div>
        <HorizonToggle days={horizonDays} onChange={onHorizonDaysChange} />
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight">
        {formatCurrency(total, defaultCurrency, intlLocale)}
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
