"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  isSupportedLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale";
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

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ locale: normalized })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", normalized, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
}
