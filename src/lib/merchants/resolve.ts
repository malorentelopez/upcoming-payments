import { MERCHANT_CATALOG } from "./catalog";
import { getMerchantIcon } from "./icons";
import type { ResolvedMerchant } from "./types";

const NOISE_WORDS = new Set([
  "subscription",
  "subscriptions",
  "suscripcion",
  "suscripciones",
  "abonnement",
  "abonnements",
  "monatlich",
  "monthly",
  "mensual",
  "mensuel",
  "annual",
  "annually",
  "yearly",
  "anual",
  "annuel",
  "jahrlich",
  "premium",
  "family",
  "familia",
  "famille",
  "familie",
  "plan",
  "payment",
  "payments",
  "pago",
  "pagos",
  "billing",
  "factura",
  "receipt",
  "membership",
  "member",
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizePaymentName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !NOISE_WORDS.has(word))
    .join(" ")
    .trim();
}

function aliasMatches(normalizedPaymentName: string, alias: string): boolean {
  const normalizedAlias = normalizePaymentName(alias);
  if (!normalizedAlias) return false;

  if (normalizedPaymentName === normalizedAlias) return true;
  if (normalizedPaymentName.startsWith(`${normalizedAlias} `)) return true;
  if (normalizedPaymentName.endsWith(` ${normalizedAlias}`)) return true;
  if (normalizedPaymentName.includes(` ${normalizedAlias} `)) return true;

  if (normalizedAlias.length >= 4) {
    const pattern = new RegExp(
      `(^|\\s)${escapeRegExp(normalizedAlias)}(\\s|$)`,
    );
    return pattern.test(normalizedPaymentName);
  }

  return false;
}

export function resolveMerchant(paymentName: string): ResolvedMerchant | null {
  const normalized = normalizePaymentName(paymentName);
  if (!normalized) return null;

  let bestMatch: { entry: (typeof MERCHANT_CATALOG)[number]; score: number } | null =
    null;

  for (const entry of MERCHANT_CATALOG) {
    const candidates = [entry.name, ...entry.aliases];

    for (const candidate of candidates) {
      if (!aliasMatches(normalized, candidate)) continue;

      const score = normalizePaymentName(candidate).length;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { entry, score };
      }
    }
  }

  if (!bestMatch) return null;

  const icon = getMerchantIcon(bestMatch.entry.iconSlug);
  if (!icon) return null;

  return {
    slug: bestMatch.entry.slug,
    name: bestMatch.entry.name,
    color: icon.hex,
    path: icon.path,
  };
}

export function getPaymentAccentColor(
  paymentName: string,
  categoryColor: string,
): string {
  return resolveMerchant(paymentName)?.color ?? categoryColor;
}
