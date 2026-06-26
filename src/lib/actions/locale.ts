"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { toUserErrorMessage } from "@/lib/errors";
import {
  isSupportedLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale";
import { appCookieOptions } from "@/lib/security/cookies";
import { createClient } from "@/lib/supabase/server";

export async function updateLocale(locale: string): Promise<void> {
  const normalized = normalizeLocale(locale);

  if (!isSupportedLocale(normalized)) {
    throw new Error("Unsupported locale");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase
      .from("profiles")
      .update({ locale: normalized })
      .eq("id", user.id);

    if (error) {
      throw new Error(toUserErrorMessage(error, "Could not update language."));
    }
  }

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", normalized as SupportedLocale, appCookieOptions());

  revalidatePath("/", "layout");
}
