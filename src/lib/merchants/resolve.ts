import { MERCHANT_CATALOG } from "./catalog";
import { getMerchantIcon } from "./icons";
import type { MerchantCatalogEntry, ResolvedMerchant } from "./types";

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

type ResolverCandidate = {
  entry: MerchantCatalogEntry;
  normalized: string;
  score: number;
};

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

function aliasMatches(normalizedPaymentName: string, normalizedAlias: string): boolean {
  if (!normalizedAlias) {
    return false;
  }

  if (normalizedPaymentName === normalizedAlias) {
    return true;
  }

  const pattern = new RegExp(
    `(^|\\s)${escapeRegExp(normalizedAlias)}(\\s|$)`,
  );
  return pattern.test(normalizedPaymentName);
}

const RESOLVER_CANDIDATES: ResolverCandidate[] = MERCHANT_CATALOG.flatMap(
  (entry) => {
    const seen = new Set<string>();

    return [entry.name, ...entry.aliases].flatMap((alias) => {
      const normalized = normalizePaymentName(alias);
      if (!normalized || seen.has(normalized)) {
        return [];
      }
      seen.add(normalized);
      return [{ entry, normalized, score: normalized.length }];
    });
  },
).sort((left, right) => right.score - left.score);

export function resolveMerchant(paymentName: string): ResolvedMerchant | null {
  const normalized = normalizePaymentName(paymentName);
  if (!normalized) {
    return null;
  }

  for (const candidate of RESOLVER_CANDIDATES) {
    if (!aliasMatches(normalized, candidate.normalized)) {
      continue;
    }

    const icon = getMerchantIcon(candidate.entry.iconSlug);
    if (!icon) {
      continue;
    }

    return {
      slug: candidate.entry.slug,
      name: candidate.entry.name,
      color: icon.hex,
      path: icon.path,
    };
  }

  return null;
}

export function getPaymentAccentColor(
  paymentName: string,
  categoryColor: string,
): string {
  return resolveMerchant(paymentName)?.color ?? categoryColor;
}
