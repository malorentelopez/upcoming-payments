export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyAxis(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortDate(date: Date, locale = "en-US"): string {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

export function formatDueDateParts(date: Date, locale = "en-US") {
  const month = date
    .toLocaleDateString(locale, { month: "short" })
    .replace(/\.$/u, "")
    .toUpperCase();
  const day = String(date.getDate());

  return { month, day };
}

export function formatMonthYear(year: number, month: number, locale = "en-US"): string {
  return new Date(year, month - 1, 1).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}

export function paymentTypeLabel(type: string): string {
  switch (type) {
    case "recurring":
      return "Recurring";
    case "installment":
      return "Installment";
    case "one_off":
      return "One-off";
    default:
      return type;
  }
}
