"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { sanitizeHexColor } from "@/lib/security/colors";
import { formatCurrency, formatShortDate } from "@/lib/payments/formatters";
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
  const displayCurrency = currency ?? occurrence.currency;
  const isPastDue = variant === "pastDue";

  return (
    <Link
      href={`/payments/${occurrence.paymentId}`}
      className={
        isPastDue
          ? "group flex items-center gap-4 rounded-2xl border border-border/30 bg-card/50 p-4 opacity-50 transition-colors hover:border-border/50 hover:bg-card/60"
          : "group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card/80"
      }
    >
      <div
        className="size-2.5 shrink-0 rounded-full"
        style={{
          backgroundColor: sanitizeHexColor(occurrence.category?.color, "#64748b"),
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={isPastDue ? "truncate font-medium text-muted-foreground" : "truncate font-medium"}>
            {occurrence.name}
          </p>
          <Badge variant="secondary" className="hidden shrink-0 text-[10px] sm:inline-flex">
            {t(occurrence.type as PaymentType)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatShortDate(occurrence.dueDate, intlLocale)}
          {occurrence.category ? ` · ${occurrence.category.name}` : ""}
        </p>
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
