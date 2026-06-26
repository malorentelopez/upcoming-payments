import {
  categoriesMatchEnglishDefaults,
  DEFAULT_CATEGORIES_BY_LOCALE,
} from "@/lib/i18n/default-categories";
import {
  isSupportedLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";

export async function applySignupLocale(
  userId: string,
  localeInput: string,
): Promise<SupportedLocale> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const locale = isSupportedLocale(localeInput)
    ? localeInput
    : normalizeLocale(localeInput);

  await supabase.from("profiles").update({ locale }).eq("id", userId);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon")
    .eq("user_id", userId);

  if (!categories || !categoriesMatchEnglishDefaults(categories)) {
    return locale;
  }

  const localized = DEFAULT_CATEGORIES_BY_LOCALE[locale];

  await Promise.all(
    categories.map((category) => {
      const seed = localized.find((item) => item.icon === category.icon);
      if (!seed || seed.name === category.name) return Promise.resolve();

      return supabase
        .from("categories")
        .update({ name: seed.name })
        .eq("id", category.id);
    }),
  );

  return locale;
}
