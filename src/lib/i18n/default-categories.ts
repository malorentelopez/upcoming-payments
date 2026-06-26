import type { SupportedLocale } from "@/lib/i18n/locale";

export type DefaultCategorySeed = {
  name: string;
  color: string;
  icon: string;
};

export const DEFAULT_CATEGORIES_BY_LOCALE: Record<
  SupportedLocale,
  DefaultCategorySeed[]
> = {
  en: [
    { name: "Rent", color: "#0d9488", icon: "home" },
    { name: "Subscriptions", color: "#6366f1", icon: "repeat" },
    { name: "Loans", color: "#f59e0b", icon: "landmark" },
    { name: "Utilities", color: "#14b8a6", icon: "zap" },
    { name: "Other", color: "#64748b", icon: "circle" },
  ],
  fr: [
    { name: "Loyer", color: "#0d9488", icon: "home" },
    { name: "Abonnements", color: "#6366f1", icon: "repeat" },
    { name: "Prêts", color: "#f59e0b", icon: "landmark" },
    { name: "Factures", color: "#14b8a6", icon: "zap" },
    { name: "Autre", color: "#64748b", icon: "circle" },
  ],
  es: [
    { name: "Alquiler", color: "#0d9488", icon: "home" },
    { name: "Suscripciones", color: "#6366f1", icon: "repeat" },
    { name: "Préstamos", color: "#f59e0b", icon: "landmark" },
    { name: "Servicios", color: "#14b8a6", icon: "zap" },
    { name: "Otro", color: "#64748b", icon: "circle" },
  ],
  de: [
    { name: "Miete", color: "#0d9488", icon: "home" },
    { name: "Abonnements", color: "#6366f1", icon: "repeat" },
    { name: "Kredite", color: "#f59e0b", icon: "landmark" },
    { name: "Nebenkosten", color: "#14b8a6", icon: "zap" },
    { name: "Sonstiges", color: "#64748b", icon: "circle" },
  ],
};

const ENGLISH_DEFAULT_NAMES = DEFAULT_CATEGORIES_BY_LOCALE.en.map(
  (category) => category.name,
);

export function categoriesMatchEnglishDefaults(
  categories: Array<{ name: string; icon: string | null }>,
): boolean {
  if (categories.length !== ENGLISH_DEFAULT_NAMES.length) return false;

  const byIcon = new Map(
    categories.map((category) => [category.icon ?? "", category.name]),
  );

  return DEFAULT_CATEGORIES_BY_LOCALE.en.every(
    (seed) => byIcon.get(seed.icon) === seed.name,
  );
}

export const SIGNUP_LOCALE_COOKIE = "ahead-signup-locale";
