"use client";

import { Briefcase, Layers2, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import type { LedgerFilter } from "@/lib/payments/ledger";
import { cn } from "@/lib/utils";

interface LedgerFilterSwitcherProps {
  value: LedgerFilter;
  onChange: (value: LedgerFilter) => void;
  className?: string;
}

const LEDGER_OPTIONS: {
  value: LedgerFilter;
  icon: typeof UserRound;
  labelKey: "personal" | "business" | "combined";
}[] = [
  { value: "personal", icon: UserRound, labelKey: "personal" },
  { value: "business", icon: Briefcase, labelKey: "business" },
  { value: "all", icon: Layers2, labelKey: "combined" },
];

export function LedgerFilterSwitcher({
  value,
  onChange,
  className,
}: LedgerFilterSwitcherProps) {
  const t = useTranslations("ledger");

  return (
    <div
      role="group"
      aria-label={t("filterLabel")}
      className={cn(
        "inline-flex shrink-0 rounded-xl border border-border/60 bg-muted/40 p-0.5",
        className,
      )}
    >
      {LEDGER_OPTIONS.map(({ value: optionValue, icon: Icon, labelKey }) => {
        const active = value === optionValue;
        const label = t(labelKey);

        return (
          <button
            key={optionValue}
            type="button"
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => onChange(optionValue)}
            className={cn(
              "flex size-9 items-center justify-center rounded-[0.65rem] transition-colors",
              active
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={active ? 2.25 : 2} />
          </button>
        );
      })}
    </div>
  );
}
