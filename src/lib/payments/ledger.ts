export type PaymentLedger = "personal" | "business";

export type LedgerFilter = PaymentLedger | "all";

export function parseLedgerFilter(value: string | null): LedgerFilter {
  if (value === "personal" || value === "business") {
    return value;
  }
  return "all";
}

export function appendLedgerParam(
  params: URLSearchParams,
  ledger: LedgerFilter,
): void {
  if (ledger !== "all") {
    params.set("ledger", ledger);
  }
}

export function filterPaymentsByLedger<T extends { ledger: PaymentLedger }>(
  payments: T[],
  filter: LedgerFilter,
): T[] {
  if (filter === "all") {
    return payments;
  }
  return payments.filter((payment) => payment.ledger === filter);
}
