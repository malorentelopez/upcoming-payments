import { describe, expect, it } from "vitest";

import {
  expandAllOccurrences,
  expandPaymentOccurrences,
  getMonthRange,
  parseMonthParam,
  shiftMonth,
  sumOccurrences,
} from "./occurrences";
import type { Payment } from "@/lib/types";

function makePayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: "pay-1",
    user_id: "user-1",
    category_id: null,
    name: "Test",
    amount: 100,
    currency: "USD",
    type: "recurring",
    frequency: "monthly",
    day_of_month: 15,
    use_last_day_of_month: false,
    start_date: "2026-01-15",
    end_date: null,
    due_date: null,
    next_due_date: null,
    total_installments: null,
    paid_installments: 0,
    notes: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("parseMonthParam", () => {
  it("parses valid month strings", () => {
    expect(parseMonthParam("2026-06")).toEqual({ year: 2026, month: 6 });
  });

  it("falls back to current month for invalid input", () => {
    const now = new Date();
    expect(parseMonthParam("invalid")).toEqual({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });
  });
});

describe("shiftMonth", () => {
  it("shifts months forward and backward", () => {
    expect(shiftMonth(2026, 1, 1)).toEqual({ year: 2026, month: 2 });
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe("expandPaymentOccurrences — recurring", () => {
  it("generates monthly occurrences within range", () => {
    const payment = makePayment({
      type: "recurring",
      frequency: "monthly",
      day_of_month: 10,
      start_date: "2026-01-10",
    });
    const { start, end } = getMonthRange(2026, 3);
    const occurrences = expandPaymentOccurrences(payment, start, end);

    expect(occurrences).toHaveLength(1);
    expect(occurrences[0].dueDate.getDate()).toBe(10);
    expect(occurrences[0].amount).toBe(100);
  });

  it("respects end_date", () => {
    const payment = makePayment({
      start_date: "2026-01-01",
      end_date: "2026-02-15",
    });
    const { start, end } = getMonthRange(2026, 6);
    const occurrences = expandPaymentOccurrences(payment, start, end);

    expect(occurrences.length).toBeLessThanOrEqual(2);
  });

  it("uses last day of month when configured", () => {
    const payment = makePayment({
      day_of_month: 31,
      use_last_day_of_month: true,
      start_date: "2026-02-01",
    });
    const { start, end } = getMonthRange(2026, 2);
    const occurrences = expandPaymentOccurrences(payment, start, end);

    expect(occurrences).toHaveLength(1);
    expect(occurrences[0].dueDate.getDate()).toBe(28);
  });

  it("returns empty for inactive payments", () => {
    const payment = makePayment({ is_active: false });
    const { start, end } = getMonthRange(2026, 6);
    expect(expandPaymentOccurrences(payment, start, end)).toHaveLength(0);
  });
});

describe("expandPaymentOccurrences — installment", () => {
  it("generates remaining installments", () => {
    const payment = makePayment({
      type: "installment",
      frequency: "monthly",
      total_installments: 5,
      paid_installments: 2,
      next_due_date: "2026-03-01",
      day_of_month: 1,
    });
    const { start, end } = getMonthRange(2026, 5);
    const occurrences = expandPaymentOccurrences(payment, start, end);

    expect(occurrences.length).toBeGreaterThan(0);
    expect(occurrences.length).toBeLessThanOrEqual(3);
  });

  it("returns empty when all installments paid", () => {
    const payment = makePayment({
      type: "installment",
      total_installments: 3,
      paid_installments: 3,
      next_due_date: "2026-03-01",
    });
    const { start, end } = getMonthRange(2026, 6);
    expect(expandPaymentOccurrences(payment, start, end)).toHaveLength(0);
  });
});

describe("expandPaymentOccurrences — one_off", () => {
  it("includes one-off when due in range", () => {
    const payment = makePayment({
      type: "one_off",
      due_date: "2026-06-20",
    });
    const { start, end } = getMonthRange(2026, 6);
    const occurrences = expandPaymentOccurrences(payment, start, end);

    expect(occurrences).toHaveLength(1);
    expect(occurrences[0].dueDate.getDate()).toBe(20);
  });

  it("excludes one-off outside range", () => {
    const payment = makePayment({
      type: "one_off",
      due_date: "2026-08-01",
    });
    const { start, end } = getMonthRange(2026, 6);
    expect(expandPaymentOccurrences(payment, start, end)).toHaveLength(0);
  });
});

describe("expandAllOccurrences", () => {
  it("sorts occurrences by due date", () => {
    const payments = [
      makePayment({ id: "a", name: "Later", due_date: "2026-06-25", type: "one_off" }),
      makePayment({ id: "b", name: "Earlier", due_date: "2026-06-05", type: "one_off" }),
    ];
    const { start, end } = getMonthRange(2026, 6);
    const occurrences = expandAllOccurrences(payments, start, end);

    expect(occurrences[0].name).toBe("Earlier");
    expect(occurrences[1].name).toBe("Later");
  });
});

describe("sumOccurrences", () => {
  it("sums amounts for matching currency", () => {
    const { start, end } = getMonthRange(2026, 6);
    const payments = [
      makePayment({ amount: 50, type: "one_off", due_date: "2026-06-10" }),
      makePayment({ id: "2", amount: 75, type: "one_off", due_date: "2026-06-15" }),
    ];
    const occurrences = expandAllOccurrences(payments, start, end);
    expect(sumOccurrences(occurrences, "USD")).toBe(125);
  });
});
