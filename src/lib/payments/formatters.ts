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

/** Replaces digits in a formatted currency string with bullets for privacy mode. */
export function maskCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return formatCurrency(amount, currency, locale).replace(/\d/g, "•");
}

export function formatDisplayCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
  privacyEnabled = false,
): string {
  if (privacyEnabled) {
    return maskCurrency(amount, currency, locale);
  }

  return formatCurrency(amount, currency, locale);
}

export function formatDisplayCurrencyAxis(
  amount: number,
  currency = "USD",
  locale = "en-US",
  privacyEnabled = false,
): string {
  const formatted = formatCurrencyAxis(amount, currency, locale);

  if (privacyEnabled) {
    return formatted.replace(/\d/g, "•");
  }

  return formatted;
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
