import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  isAfter,
  isBefore,
  isWithinInterval,
  setDate,
  startOfDay,
  startOfMonth,
  endOfMonth as endOfMonthFn,
} from "date-fns";

import type { CategoryView, PaymentOccurrence, PaymentView } from "@/lib/types";

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolveDayOfMonth(
  base: Date,
  dayOfMonth: number | null,
  useLastDay: boolean,
): Date {
  if (useLastDay) {
    return endOfMonth(base);
  }
  const day = dayOfMonth ?? base.getDate();
  const lastDay = endOfMonthFn(base).getDate();
  return setDate(base, Math.min(day, lastDay));
}

function addByFrequency(date: Date, frequency: PaymentView["frequency"]): Date {
  switch (frequency) {
    case "weekly":
      return addWeeks(date, 1);
    case "monthly":
      return addMonths(date, 1);
    case "yearly":
      return addYears(date, 1);
    default:
      return addMonths(date, 1);
  }
}

function expandRecurring(
  payment: PaymentView,
  rangeStart: Date,
  rangeEnd: Date,
): PaymentOccurrence[] {
  const startDate = parseDate(payment.start_date);
  if (!startDate) return [];

  let cursor = resolveDayOfMonth(
    startDate,
    payment.day_of_month,
    payment.use_last_day_of_month,
  );

  if (isBefore(cursor, startDate)) {
    cursor = addByFrequency(cursor, payment.frequency ?? "monthly");
  }

  const endDate = parseDate(payment.end_date);
  const occurrences: PaymentOccurrence[] = [];
  const safetyLimit = 500;
  let iterations = 0;

  while (iterations < safetyLimit) {
    iterations += 1;

    if (endDate && isAfter(cursor, endDate)) break;
    if (isAfter(cursor, rangeEnd)) break;

    if (
      !isBefore(cursor, rangeStart) &&
      isWithinInterval(cursor, { start: rangeStart, end: rangeEnd })
    ) {
      occurrences.push(buildOccurrence(payment, cursor));
    }

    cursor = addByFrequency(cursor, payment.frequency ?? "monthly");

    if (payment.frequency === "monthly" || !payment.frequency) {
      cursor = resolveDayOfMonth(
        cursor,
        payment.day_of_month,
        payment.use_last_day_of_month,
      );
    }
  }

  return occurrences;
}

function expandInstallment(
  payment: PaymentView,
  rangeStart: Date,
  rangeEnd: Date,
): PaymentOccurrence[] {
  const total = payment.total_installments ?? 0;
  const paid = payment.paid_installments ?? 0;
  const remaining = total - paid;
  if (remaining <= 0) return [];

  let cursor = parseDate(payment.next_due_date);
  if (!cursor) return [];

  const occurrences: PaymentOccurrence[] = [];
  const frequency = payment.frequency ?? "monthly";

  for (let i = 0; i < remaining; i += 1) {
    if (isAfter(cursor, rangeEnd)) break;

    if (
      !isBefore(cursor, rangeStart) &&
      isWithinInterval(cursor, { start: rangeStart, end: rangeEnd })
    ) {
      const occurrence = buildOccurrence(payment, cursor);
      applyInstallmentSummary(occurrence, payment, i);
      occurrences.push(occurrence);
    }

    cursor = addByFrequency(cursor, frequency);
    if (frequency === "monthly") {
      cursor = resolveDayOfMonth(
        cursor,
        payment.day_of_month,
        payment.use_last_day_of_month,
      );
    }
  }

  return occurrences;
}

function expandOneOff(
  payment: PaymentView,
  rangeStart: Date,
  rangeEnd: Date,
): PaymentOccurrence[] {
  const due = parseDate(payment.due_date);
  if (!due) return [];

  if (
    isBefore(due, rangeStart) ||
    isAfter(due, rangeEnd)
  ) {
    return [];
  }

  return [buildOccurrence(payment, due)];
}

function buildOccurrence(payment: PaymentView, dueDate: Date): PaymentOccurrence {
  return {
    paymentId: payment.id,
    name: payment.name,
    amount: Number(payment.amount),
    currency: payment.currency,
    dueDate: startOfDay(dueDate),
    category: payment.category ?? null,
    type: payment.type,
    ledger: payment.ledger,
  };
}

/** Installments still due after the occurrence at `installmentIndexFromNext` (0 = next due). */
function applyInstallmentSummary(
  occurrence: PaymentOccurrence,
  payment: PaymentView,
  installmentIndexFromNext: number,
): void {
  const total = payment.total_installments ?? 0;
  const paid = payment.paid_installments ?? 0;
  const remainingOnLoan = total - paid;
  const remainingAfterThis = remainingOnLoan - installmentIndexFromNext - 1;

  if (remainingAfterThis > 0) {
    occurrence.installmentRemainingCount = remainingAfterThis;
    occurrence.installmentPendingAmount = remainingAfterThis * Number(payment.amount);
  }
}

export function expandPaymentOccurrences(
  payment: PaymentView,
  rangeStart: Date,
  rangeEnd: Date,
): PaymentOccurrence[] {
  if (!payment.is_active) return [];

  const start = startOfDay(rangeStart);
  const end = endOfDay(rangeEnd);

  switch (payment.type) {
    case "recurring":
      return expandRecurring(payment, start, end);
    case "installment":
      return expandInstallment(payment, start, end);
    case "one_off":
      return expandOneOff(payment, start, end);
    default: {
      const _exhaustive: never = payment.type;
      return _exhaustive;
    }
  }
}

export function expandAllOccurrences(
  payments: PaymentView[],
  rangeStart: Date,
  rangeEnd: Date,
): PaymentOccurrence[] {
  return payments
    .flatMap((payment) => expandPaymentOccurrences(payment, rangeStart, rangeEnd))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function getMonthRange(year: number, month: number) {
  const start = startOfMonth(new Date(year, month - 1, 1));
  const end = endOfMonthFn(start);
  return { start, end };
}

export function sumOccurrences(
  occurrences: PaymentOccurrence[],
  currency?: string,
): number {
  return occurrences
    .filter((o) => !currency || o.currency === currency)
    .reduce((sum, o) => sum + o.amount, 0);
}

export function startOfToday(): Date {
  return startOfDay(new Date());
}

export function isOccurrenceUpcoming(dueDate: Date, today: Date): boolean {
  return startOfDay(dueDate).getTime() >= startOfDay(today).getTime();
}

export function isOccurrenceDueToday(dueDate: Date, today: Date): boolean {
  return startOfDay(dueDate).getTime() === startOfDay(today).getTime();
}

export function splitOccurrencesByDueDate(
  occurrences: PaymentOccurrence[],
  today: Date,
): { upcoming: PaymentOccurrence[]; pastDue: PaymentOccurrence[] } {
  const upcoming: PaymentOccurrence[] = [];
  const pastDue: PaymentOccurrence[] = [];

  for (const occurrence of occurrences) {
    if (isOccurrenceUpcoming(occurrence.dueDate, today)) {
      upcoming.push(occurrence);
    } else {
      pastDue.push(occurrence);
    }
  }

  return { upcoming, pastDue };
}

export function getHorizonRange(days: number, today = startOfToday()) {
  const start = startOfDay(today);
  const end = endOfDay(addDays(start, days));
  return { start, end };
}

export function filterOccurrencesInRange(
  occurrences: PaymentOccurrence[],
  rangeStart: Date,
  rangeEnd: Date,
): PaymentOccurrence[] {
  return occurrences.filter((occurrence) =>
    isWithinInterval(occurrence.dueDate, { start: rangeStart, end: rangeEnd }),
  );
}

export function isCurrentMonth(year: number, month: number, today = new Date()): boolean {
  return today.getFullYear() === year && today.getMonth() + 1 === month;
}

export function isPastMonth(year: number, month: number, today = new Date()): boolean {
  const anchor = new Date(year, month - 1, 1);
  const current = startOfMonth(today);
  return anchor.getTime() < current.getTime();
}

export function isFutureMonth(year: number, month: number, today = new Date()): boolean {
  const anchor = new Date(year, month - 1, 1);
  const current = startOfMonth(today);
  return anchor.getTime() > current.getTime();
}

export function groupByCategory(
  occurrences: PaymentOccurrence[],
): Map<string, { category: CategoryView | null; total: number }> {
  const map = new Map<string, { category: CategoryView | null; total: number }>();

  for (const occurrence of occurrences) {
    const key = occurrence.category?.id ?? "uncategorized";
    const existing = map.get(key);
    if (existing) {
      existing.total += occurrence.amount;
    } else {
      map.set(key, {
        category: occurrence.category,
        total: occurrence.amount,
      });
    }
  }

  return map;
}

export function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function parseMonthParam(value: string | null | undefined): {
  year: number;
  month: number;
} {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    if (month >= 1 && month <= 12) {
      return { year, month };
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function shiftMonth(year: number, month: number, delta: number) {
  const date = addMonths(new Date(year, month - 1, 1), delta);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function getMonthsWindow(
  anchorYear: number,
  anchorMonth: number,
  count: number,
  locale = "en-US",
): Array<{ year: number; month: number; key: string; label: string }> {
  const months: Array<{ year: number; month: number; key: string; label: string }> = [];
  const startOffset = -(count - 1);

  for (let i = startOffset; i <= 0; i += 1) {
    const { year, month } = shiftMonth(anchorYear, anchorMonth, i);
    const date = new Date(year, month - 1, 1);
    months.push({
      year,
      month,
      key: getMonthKey(date),
      label: date.toLocaleDateString(locale, { month: "short", year: "numeric" }),
    });
  }

  return months;
}
