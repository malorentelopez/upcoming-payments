"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDueDateParts } from "@/lib/payments/formatters";
import { sanitizeHexColor } from "@/lib/security/colors";
import type { PaymentOccurrence, PaymentType } from "@/lib/types";

interface PaymentCardProps {
  occurrence: PaymentOccurrence;
  currency?: string;
  intlLocale?: string;
  variant?: "default" | "pastDue";
}

export function PaymentCard({
  occurrence,
  currency,
  intlLocale = "en-US",
  variant = "default",
}: PaymentCardProps) {
  const t = useTranslations("payments.types");
  const tPayments = useTranslations("payments");
  const displayCurrency = currency ?? occurrence.currency;
  const isPastDue = variant === "pastDue";
  const { month, day } = formatDueDateParts(occurrence.dueDate, intlLocale);
  const categoryColor = sanitizeHexColor(occurrence.category?.color, "#64748b");
  const showInstallmentSummary =
    occurrence.type === "installment" &&
    occurrence.installmentRemainingCount !== undefined &&
    occurrence.installmentRemainingCount > 0 &&
    occurrence.installmentPendingAmount !== undefined;

  return (
    <Link
      href={`/payments/${occurrence.paymentId}`}
      className={
        isPastDue
          ? "group flex items-center gap-3 rounded-2xl border border-border/30 bg-card/50 p-4 opacity-50 transition-colors hover:border-border/50 hover:bg-card/60"
          : "group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card/80"
      }
    >
      <PaymentDueDate month={month} day={day} color={categoryColor} muted={isPastDue} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={isPastDue ? "truncate font-medium text-muted-foreground" : "truncate font-medium"}>
            {occurrence.name}
          </p>
          <Badge variant="secondary" className="hidden shrink-0 text-[10px] sm:inline-flex">
            {t(occurrence.type as PaymentType)}
          </Badge>
        </div>
        {occurrence.category ? (
          <p className="text-sm text-muted-foreground">{occurrence.category.name}</p>
        ) : null}
        {showInstallmentSummary ? (
          <p className="text-xs text-muted-foreground/80">
            {tPayments("installmentPending", {
              amount: formatCurrency(
                occurrence.installmentPendingAmount!,
                displayCurrency,
                intlLocale,
              ),
              count: occurrence.installmentRemainingCount!,
            })}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={
            isPastDue
              ? "font-semibold tabular-nums text-muted-foreground"
              : "font-semibold tabular-nums"
          }
        >
          {formatCurrency(occurrence.amount, displayCurrency, intlLocale)}
        </span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function PaymentDueDate({
  month,
  day,
  color,
  muted = false,
}: {
  month: string;
  day: string;
  color: string;
  muted?: boolean;
}) {
  const opacity = muted ? 0.45 : 1;

  return (
    <div
      className="flex w-12 shrink-0 flex-col items-center self-stretch justify-center border-r pr-3"
      style={{ borderColor: `color-mix(in srgb, ${color} 25%, transparent)` }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color, opacity: opacity * 0.85 }}
      >
        {month}
      </span>
      <span
        className="text-2xl font-bold tabular-nums leading-none tracking-tight"
        style={{ color, opacity }}
      >
        {day}
      </span>
    </div>
  );
}
