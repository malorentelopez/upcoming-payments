import { describe, expect, it } from "vitest";

import { getInstallmentCatchUpUpdate, getInstallmentProgress } from "./installments";
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
    is_active: true,
    ...overrides,
  };
}

describe("getInstallmentProgress", () => {
  it("keeps stored progress when the next due date is today or later", () => {
    expect(
      getInstallmentProgress(makeInstallment(), new Date(2026, 2, 15)),
    ).toEqual({
      total: 6,
      paid: 2,
      remainingCount: 4,
      remainingAmount: 800,
      completed: false,
      nextDueDate: "2026-03-15",
    });
  });

  it("counts passed due dates as paid", () => {
    expect(
      getInstallmentProgress(makeInstallment(), new Date(2026, 5, 16)),
    ).toEqual({
      total: 6,
      paid: 6,
      remainingCount: 0,
      remainingAmount: 0,
      completed: true,
      nextDueDate: null,
    });
  });

  it("stops on the next unpaid due date", () => {
    expect(
      getInstallmentProgress(makeInstallment(), new Date(2026, 4, 1)),
    ).toMatchObject({
      paid: 4,
      remainingCount: 2,
      remainingAmount: 400,
      nextDueDate: "2026-05-15",
      completed: false,
    });
  });

  it("does not catch up a paused payment", () => {
    expect(
      getInstallmentProgress(
        makeInstallment({ is_active: false }),
        new Date(2026, 5, 16),
      ),
    ).toMatchObject({
      paid: 2,
      remainingCount: 4,
      completed: false,
      nextDueDate: "2026-03-15",
    });
  });
});

describe("getInstallmentCatchUpUpdate", () => {
  it("returns a patch when due dates have passed", () => {
    expect(
      getInstallmentCatchUpUpdate(
        {
          ...makeInstallment(),
          type: "installment",
        },
        new Date(2026, 4, 1),
      ),
    ).toEqual({
      paid_installments: 4,
      next_due_date: "2026-05-15",
    });
  });

  it("returns null when progress already matches stored values", () => {
    expect(
      getInstallmentCatchUpUpdate(
        {
          ...makeInstallment(),
          type: "installment",
        },
        new Date(2026, 2, 15),
      ),
    ).toBeNull();
  });
});
