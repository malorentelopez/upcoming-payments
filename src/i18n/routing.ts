import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/locale";

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "never",
});
