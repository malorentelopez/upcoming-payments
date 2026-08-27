import { describe, expect, it } from "vitest";

import { getInstallmentProgress, recordInstallmentPayment } from "./installments";
import type { PaymentView } from "@/lib/types";

function makeInstallment(overrides: Partial<PaymentView> = {}) {
  return {
    amount: 200,
    frequency: "monthly" as const,
    day_of_month: 15,
    use_last_day_of_month: false,
    next_due_date: "2026-03-15",
    total_installments: 6,
    paid_installments: 2,
    ...overrides,
  };
}

describe("getInstallmentProgress", () => {
  it("computes remaining count and amount", () => {
    expect(getInstallmentProgress(makeInstallment())).toEqual({
      total: 6,
      paid: 2,
      remainingCount: 4,
      remainingAmount: 800,
      completed: false,
    });
  });

  it("marks the loan completed when every installment is paid", () => {
    expect(
      getInstallmentProgress(
        makeInstallment({ paid_installments: 6, total_installments: 6 }),
      ),
    ).toMatchObject({ remainingCount: 0, remainingAmount: 0, completed: true });
  });
});

describe("recordInstallmentPayment", () => {
  it("increments paid installments and advances the next due date", () => {
    expect(recordInstallmentPayment(makeInstallment())).toEqual({
      paid_installments: 3,
      next_due_date: "2026-04-15",
      day_of_month: 15,
      is_active: true,
      completed: false,
    });
  });

  it("keeps the due day when stored day_of_month is the form default", () => {
    expect(
      recordInstallmentPayment(
        makeInstallment({ day_of_month: 1, next_due_date: "2026-03-15" }),
      ),
    ).toMatchObject({
      next_due_date: "2026-04-15",
      day_of_month: 15,
    });
  });

  it("restores a 31st after a short month", () => {
    expect(
      recordInstallmentPayment(
        makeInstallment({
          day_of_month: 31,
          next_due_date: "2026-02-28",
        }),
      ),
    ).toMatchObject({
      next_due_date: "2026-03-31",
      day_of_month: 31,
    });
  });

  it("completes the loan on the last installment", () => {
    expect(
      recordInstallmentPayment(
        makeInstallment({ paid_installments: 5, total_installments: 6 }),
      ),
    ).toEqual({
      paid_installments: 6,
      next_due_date: "2026-03-15",
      day_of_month: 15,
      is_active: false,
      completed: true,
    });
  });

  it("rejects a fully paid loan", () => {
    expect(
      recordInstallmentPayment(
        makeInstallment({ paid_installments: 6, total_installments: 6 }),
      ),
    ).toEqual({ error: "already_completed" });
  });

  it("rejects a missing due date", () => {
    expect(
      recordInstallmentPayment(makeInstallment({ next_due_date: null })),
    ).toEqual({ error: "missing_due_date" });
  });
});
