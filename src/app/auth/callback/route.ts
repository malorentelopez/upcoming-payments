import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { applySignupLocale } from "@/lib/actions/signup-locale";
import { SIGNUP_LOCALE_COOKIE } from "@/lib/i18n/default-categories";
import { isSupportedLocale, normalizeLocale } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const cookieStore = await cookies();
        const signupLocaleCookie = cookieStore.get(SIGNUP_LOCALE_COOKIE)?.value;
        const metadataLocale = user.user_metadata?.locale as string | undefined;

        let locale =
          signupLocaleCookie && isSupportedLocale(signupLocaleCookie)
            ? signupLocaleCookie
            : normalizeLocale(metadataLocale);

        if (signupLocaleCookie || metadataLocale) {
          locale = await applySignupLocale(user.id, locale);
        } else {
          const { data: profile } = await supabase
            .from("profiles")
            .select("locale")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.locale && isSupportedLocale(profile.locale)) {
            locale = profile.locale;
          }
        }

        response.cookies.set("NEXT_LOCALE", locale, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });

        if (signupLocaleCookie) {
          response.cookies.delete(SIGNUP_LOCALE_COOKIE);
        }
      }

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
