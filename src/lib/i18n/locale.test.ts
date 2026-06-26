import { describe, expect, it } from "vitest";

import {
  detectLocaleFromAcceptLanguage,
  normalizeLocale,
} from "@/lib/i18n/locale";

describe("normalizeLocale", () => {
  it("maps language tags to supported locales", () => {
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("fr-FR")).toBe("fr");
    expect(normalizeLocale("es-ES")).toBe("es");
    expect(normalizeLocale("de-DE")).toBe("de");
    expect(normalizeLocale("it-IT")).toBe("en");
  });
});

describe("detectLocaleFromAcceptLanguage", () => {
  it("picks the first supported locale from the header", () => {
    expect(detectLocaleFromAcceptLanguage("es-ES,es;q=0.9,en;q=0.8")).toBe("es");
    expect(detectLocaleFromAcceptLanguage("de-DE,en;q=0.9")).toBe("de");
    expect(detectLocaleFromAcceptLanguage("it-IT,en;q=0.9")).toBe("en");
  });
});
