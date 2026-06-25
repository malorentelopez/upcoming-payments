import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatShortDate,
  paymentTypeLabel,
} from "@/lib/payments/formatters";
import type { PaymentOccurrence } from "@/lib/types";

interface PaymentCardProps {
  occurrence: PaymentOccurrence;
  currency?: string;
}

export function PaymentCard({ occurrence, currency }: PaymentCardProps) {
  const displayCurrency = currency ?? occurrence.currency;

  return (
    <Link
      href={`/payments/${occurrence.paymentId}`}
      className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card/80"
    >
      <div
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: occurrence.category?.color ?? "#64748b" }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{occurrence.name}</p>
          <Badge variant="secondary" className="hidden shrink-0 text-[10px] sm:inline-flex">
            {paymentTypeLabel(occurrence.type)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatShortDate(occurrence.dueDate)}
          {occurrence.category ? ` · ${occurrence.category.name}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold tabular-nums">
          {formatCurrency(occurrence.amount, displayCurrency)}
        </span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
