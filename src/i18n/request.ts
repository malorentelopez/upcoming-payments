import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  detectLocaleFromAcceptLanguage,
  isSupportedLocale,
} from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";

export default getRequestConfig(async () => {
  let locale: string | undefined;

  if (!locale) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && isSupportedLocale(cookieLocale)) {
      locale = cookieLocale;
    }
  }

  if (!locale) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("locale")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.locale && isSupportedLocale(profile.locale)) {
          locale = profile.locale;
        }
      }
    } catch {
      // Fall back to Accept-Language when profile lookup fails.
    }
  }

  if (!locale) {
    const acceptLanguage = (await headers()).get("accept-language");
    locale = detectLocaleFromAcceptLanguage(acceptLanguage);
  }

  if (!isSupportedLocale(locale)) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
