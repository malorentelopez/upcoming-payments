import { startOfDay } from "date-fns";

import type { PaymentView } from "@/lib/types";

import {
  advanceDueDate,
  parseIsoDate,
  startOfToday,
  toIsoDate,
} from "@/lib/payments/occurrences";

type InstallmentPayment = Pick<
  PaymentView,
  | "amount"
  | "frequency"
  | "day_of_month"
  | "use_last_day_of_month"
  | "next_due_date"
  | "total_installments"
  | "paid_installments"
  | "is_active"
>;

export function getInstallmentProgress(
  payment: InstallmentPayment,
  today: Date = startOfToday(),
) {
  const total = payment.total_installments ?? 0;
  let paid = payment.paid_installments ?? 0;
  let nextDue = parseIsoDate(payment.next_due_date);

  if (payment.is_active && nextDue && paid < total) {
    const scheduledDay = Math.max(payment.day_of_month ?? 0, nextDue.getDate());
    const todayStart = startOfDay(today).getTime();
    let steps = 0;

    while (
      paid < total &&
      startOfDay(nextDue).getTime() < todayStart &&
      steps < 500
    ) {
      paid += 1;
      steps += 1;
      if (paid < total) {
        nextDue = advanceDueDate(
          nextDue,
          payment.frequency,
          scheduledDay,
          payment.use_last_day_of_month,
        );
      }
    }
  }

  const remainingCount = Math.max(0, total - paid);

  return {
    total,
    paid,
    remainingCount,
    remainingAmount: remainingCount * Number(payment.amount),
    completed: total > 0 && remainingCount === 0,
    nextDueDate: remainingCount > 0 && nextDue ? toIsoDate(nextDue) : null,
  };
}

export type InstallmentCatchUpUpdate = {
  paid_installments: number;
  next_due_date: string | null;
};

export function getInstallmentCatchUpUpdate(
  payment: Pick<PaymentView, "type"> & InstallmentPayment,
  today: Date = startOfToday(),
): InstallmentCatchUpUpdate | null {
  if (payment.type !== "installment") {
    return null;
  }

  const progress = getInstallmentProgress(payment, today);
  if (
    progress.paid === payment.paid_installments &&
    progress.nextDueDate === payment.next_due_date
  ) {
    return null;
  }

  return {
    paid_installments: progress.paid,
    next_due_date: progress.nextDueDate,
  };
}

export function applyInstallmentCatchUp<T extends PaymentView>(
  payment: T,
  today: Date = startOfToday(),
): T {
  const update = getInstallmentCatchUpUpdate(payment, today);
  return update ? { ...payment, ...update } : payment;
}
