export const SUPPORTED_LOCALES = ["en", "fr", "es", "de"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function normalizeLocale(
  input: string | null | undefined,
): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  const base = input.toLowerCase().split("-")[0];

  switch (base) {
    case "fr":
      return "fr";
    case "es":
      return "es";
    case "de":
      return "de";
    case "en":
      return "en";
    default:
      return DEFAULT_LOCALE;
  }
}

export function detectLocaleFromAcceptLanguage(
  header: string | null,
): SupportedLocale {
  if (!header) return DEFAULT_LOCALE;

  for (const part of header.split(",")) {
    const tag = part.trim().split(";")[0];
    const locale = normalizeLocale(tag);
    if (locale !== DEFAULT_LOCALE || tag.toLowerCase().startsWith("en")) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function detectClientLocale(): SupportedLocale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  return normalizeLocale(navigator.language);
}

export function localeToIntl(locale: SupportedLocale): string {
  switch (locale) {
    case "fr":
      return "fr-FR";
    case "es":
      return "es-ES";
    case "de":
      return "de-DE";
    default:
      return "en-US";
  }
}

export const LOCALE_LABELS: Record<
  SupportedLocale,
  { native: string; english: string }
> = {
  en: { native: "English", english: "English" },
  fr: { native: "Français", english: "French" },
  es: { native: "Español", english: "Spanish" },
  de: { native: "Deutsch", english: "German" },
};
