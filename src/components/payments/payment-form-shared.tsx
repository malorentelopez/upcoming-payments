"use client";

import {
  Briefcase,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Circle,
  Home,
  Landmark,
  ListOrdered,
  RefreshCw,
  Repeat,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCIES } from "@/lib/payments/constants";
import { sanitizeHexColor } from "@/lib/security/colors";
import type {
  CategoryView,
  PaymentFrequency,
  PaymentLedger,
  PaymentType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  home: Home,
  repeat: Repeat,
  landmark: Landmark,
  zap: Zap,
  circle: Circle,
};

const PAYMENT_TYPE_ICONS: Record<PaymentType, LucideIcon> = {
  recurring: RefreshCw,
  installment: ListOrdered,
  one_off: CalendarDays,
};

const FREQUENCY_ICONS: Record<PaymentFrequency, LucideIcon> = {
  weekly: CalendarRange,
  monthly: Calendar,
  yearly: CalendarClock,
};

export function CategoryIcon({
  icon,
  className,
  style,
}: {
  icon: string | null;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = CATEGORY_ICONS[icon ?? ""] ?? Circle;
  return <Icon className={className} style={style} />;
}

export function FormStepIndicator({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={labels[index] ?? index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              index < step ? "bg-primary" : "bg-muted",
            )}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        {labels[step - 1]}
      </p>
    </div>
  );
}

export function PaymentTypePicker({
  value,
  onChange,
}: {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
}) {
  const t = useTranslations("payments.types");
  const types: PaymentType[] = ["recurring", "installment", "one_off"];
  const tPayments = useTranslations("payments");

  return (
    <div
      role="group"
      aria-label={tPayments("type")}
      className="grid grid-cols-3 gap-2"
    >
      {types.map((type) => {
        const Icon = PAYMENT_TYPE_ICONS[type];
        const active = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
              active
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/60 bg-card text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            <Icon className="size-5" />
            <span className="text-xs font-medium leading-tight">{t(type)}</span>
          </button>
        );
      })}
    </div>
  );
}

const PERSONAL_LEDGER_COLOR = "#0d9488";
const BUSINESS_LEDGER_COLOR = "#d97706";

export function PaymentLedgerPicker({
  value,
  onChange,
}: {
  value: PaymentLedger;
  onChange: (value: PaymentLedger) => void;
}) {
  const t = useTranslations("ledger");
  const tPayments = useTranslations("payments");
  const options: {
    value: PaymentLedger;
    icon: LucideIcon;
    label: string;
    color: string;
  }[] = [
    { value: "personal", icon: UserRound, label: t("personal"), color: PERSONAL_LEDGER_COLOR },
    { value: "business", icon: Briefcase, label: t("business"), color: BUSINESS_LEDGER_COLOR },
  ];

  return (
    <div
      role="group"
      aria-label={tPayments("ledger")}
      className="grid grid-cols-2 gap-2"
    >
      {options.map(({ value: optionValue, icon: Icon, label, color }) => {
        const active = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(optionValue)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
            style={
              active
                ? {
                    borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                  }
                : undefined
            }
          >
            <Icon
              className="size-4 shrink-0"
              style={active ? { color } : undefined}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function AmountCurrencyField({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
}: {
  amount: string;
  currency: string;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
}) {
  const t = useTranslations("payments");

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">{t("amount")}</Label>
      <div className="flex overflow-hidden rounded-xl border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Input
          id="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          placeholder="0.00"
          className="h-12 flex-1 rounded-none border-0 bg-transparent text-2xl font-semibold tabular-nums shadow-none focus-visible:ring-0"
        />
        <select
          id="currency"
          value={currency}
          onChange={(event) => onCurrencyChange(event.target.value)}
          className="w-[5.25rem] shrink-0 border-l border-input bg-muted/30 px-2 text-sm font-semibold uppercase text-muted-foreground focus:outline-none"
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function CategoryChipPicker({
  categories,
  value,
  onChange,
}: {
  categories: CategoryView[];
  value: string;
  onChange: (value: string) => void;
}) {
  const tCommon = useTranslations("common");
  const tPayments = useTranslations("payments");

  return (
    <div
      role="group"
      aria-label={tPayments("category")}
      className="flex flex-wrap gap-2"
    >
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            value === ""
              ? "border-foreground/30 bg-foreground/5 text-foreground"
              : "border-border/60 text-muted-foreground hover:text-foreground",
          )}
        >
          <Circle className="size-3.5" />
          {tCommon("none")}
        </button>
        {categories.map((category) => {
          const active = value === category.id;
          const color = sanitizeHexColor(category.color);

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(category.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              style={{
                borderColor: `color-mix(in srgb, ${color} ${active ? 50 : 28}%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${color} ${active ? 18 : 10}%, transparent)`,
              }}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <CategoryIcon
                icon={category.icon}
                className="size-3.5"
                style={{ color }}
              />
              {category.name}
            </button>
          );
        })}
    </div>
  );
}

export function FrequencyPicker({
  value,
  onChange,
}: {
  value: PaymentFrequency;
  onChange: (value: PaymentFrequency) => void;
}) {
  const t = useTranslations("payments.frequencies");
  const tPayments = useTranslations("payments");
  const frequencies: PaymentFrequency[] = ["weekly", "monthly", "yearly"];

  return (
    <div role="group" aria-label={tPayments("frequency")} className="flex flex-wrap gap-2">
      {frequencies.map((frequency) => {
        const Icon = FREQUENCY_ICONS[frequency];
        const active = value === frequency;

        return (
          <button
            key={frequency}
            type="button"
            onClick={() => onChange(frequency)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
              active
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {t(frequency)}
          </button>
        );
      })}
    </div>
  );
}

export function DateField({
  id,
  label,
  value,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl"
      />
    </div>
  );
}

export function CompactNumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl"
      />
    </div>
  );
}

export function ActiveToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const t = useTranslations("payments");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
        checked
          ? "border-primary/30 bg-primary/5"
          : "border-border/60 bg-card",
      )}
    >
      <span className="text-sm font-medium">{t("activeForecast")}</span>
      <span
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function todayIsoDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
