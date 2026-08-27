import type { PaymentView } from "@/lib/types";

import { advanceDueDate, parseIsoDate, toIsoDate } from "@/lib/payments/occurrences";

type InstallmentPayment = Pick<
  PaymentView,
  | "amount"
  | "frequency"
  | "day_of_month"
  | "use_last_day_of_month"
  | "next_due_date"
  | "total_installments"
  | "paid_installments"
>;

export function getInstallmentProgress(
  payment: Pick<PaymentView, "amount" | "total_installments" | "paid_installments">,
) {
  const total = payment.total_installments ?? 0;
  const paid = payment.paid_installments ?? 0;
  const remainingCount = Math.max(0, total - paid);

  return {
    total,
    paid,
    remainingCount,
    remainingAmount: remainingCount * Number(payment.amount),
    completed: total > 0 && remainingCount === 0,
  };
}

type RecordedInstallment =
  | { error: "already_completed" }
  | { error: "missing_due_date" }
  | {
      paid_installments: number;
      next_due_date: string | null;
      day_of_month: number;
      is_active: boolean;
      completed: boolean;
    };

export function recordInstallmentPayment(
  payment: InstallmentPayment,
): RecordedInstallment {
  const progress = getInstallmentProgress(payment);
  if (progress.remainingCount <= 0) {
    return { error: "already_completed" };
  }

  const currentDue = parseIsoDate(payment.next_due_date);
  if (!currentDue) {
    return { error: "missing_due_date" };
  }

  const paid = payment.paid_installments + 1;
  const completed = paid >= progress.total;
  const dayOfMonth = Math.max(payment.day_of_month ?? 0, currentDue.getDate());

  if (completed) {
    return {
      paid_installments: paid,
      next_due_date: payment.next_due_date,
      day_of_month: dayOfMonth,
      is_active: false,
      completed: true,
    };
  }

  return {
    paid_installments: paid,
    next_due_date: toIsoDate(
      advanceDueDate(
        currentDue,
        payment.frequency,
        dayOfMonth,
        payment.use_last_day_of_month,
      ),
    ),
    day_of_month: dayOfMonth,
    is_active: true,
    completed: false,
  };
}
