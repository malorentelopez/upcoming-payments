"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";

import { PaymentCard } from "@/components/payments/payment-card";
import { PageTransition, StaggerItem, StaggerList } from "@/components/motion/page-transition";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  expandAllOccurrences,
  getMonthRange,
  parseMonthParam,
  shiftMonth,
  sumOccurrences,
} from "@/lib/payments/occurrences";
import { formatCurrency, formatMonthYear } from "@/lib/payments/formatters";
import { localeToIntl } from "@/lib/i18n/locale";
import { sanitizeHexColor } from "@/lib/security/colors";
import type { CategoryView, PaymentType, PaymentView } from "@/lib/types";

interface DashboardClientProps {
  payments: PaymentView[];
  categories: CategoryView[];
  defaultCurrency: string;
  initialMonth: string;
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

  const { start, end } = getMonthRange(year, month);

  const occurrences = useMemo(() => {
    let items = expandAllOccurrences(payments, start, end);

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((o) => o.name.toLowerCase().includes(q));
    }
    if (categoryFilter) {
      items = items.filter((o) => o.category?.id === categoryFilter);
    }
    if (typeFilter) {
      items = items.filter((o) => o.type === typeFilter);
    }

    return items;
  }, [payments, start, end, search, categoryFilter, typeFilter]);

  const total = sumOccurrences(occurrences, defaultCurrency);

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
            <p className="text-sm text-muted-foreground">{t("dueThisMonth")}</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              {formatCurrency(total, defaultCurrency, intlLocale)}
            </p>
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

      {occurrences.length === 0 ? (
        <EmptyState hasPayments={payments.length > 0} t={t} />
      ) : (
        <StaggerList className="space-y-3">
          {occurrences.map((occurrence) => (
            <StaggerItem key={`${occurrence.paymentId}-${occurrence.dueDate.toISOString()}`}>
              <PaymentCard
                occurrence={occurrence}
                currency={defaultCurrency}
                intlLocale={intlLocale}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {t("paymentCount", { count: occurrences.length })}
      </p>
    </PageTransition>
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
