"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { PaymentCard } from "@/components/payments/payment-card";
import { StaggerItem, StaggerList } from "@/components/motion/page-transition";
import type { PaymentOccurrence } from "@/lib/types";

interface CollapsiblePaymentSectionProps {
  title: string;
  showLabel: string;
  hideLabel: string;
  occurrences: PaymentOccurrence[];
  currency: string;
  intlLocale: string;
  defaultExpanded?: boolean;
}

export function CollapsiblePaymentSection({
  title,
  showLabel,
  hideLabel,
  occurrences,
  currency,
  intlLocale,
  defaultExpanded = false,
}: CollapsiblePaymentSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (occurrences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-label={expanded ? hideLabel : showLabel}
        className="flex w-full items-center gap-2 rounded-xl px-1 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
        />
        {title}
      </button>
      {expanded ? (
        <StaggerList className="space-y-3">
          {occurrences.map((occurrence) => (
            <StaggerItem key={`${occurrence.paymentId}-${occurrence.dueDate.toISOString()}`}>
              <PaymentCard
                occurrence={occurrence}
                currency={currency}
                intlLocale={intlLocale}
                variant="pastDue"
              />
            </StaggerItem>
          ))}
        </StaggerList>
      ) : null}
    </div>
  );
}
