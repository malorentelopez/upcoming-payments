export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "MXN"] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];
