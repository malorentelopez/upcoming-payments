"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateLocale } from "@/lib/actions/locale";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

export function LanguageSettings() {
  const t = useTranslations("language");
  const tAuth = useTranslations("auth");
  const currentLocale = useLocale() as SupportedLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(locale: SupportedLocale) {
    if (locale === currentLocale) return;

    startTransition(async () => {
      try {
        await updateLocale(locale);
        router.refresh();
      } catch {
        toast.error(tAuth("somethingWrong"));
      }
    });
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-2 font-medium">{t("title")}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{t("description")}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SUPPORTED_LOCALES.map((locale) => {
          const selected = currentLocale === locale;
          const { native, english } = LOCALE_LABELS[locale];

          return (
            <button
              key={locale}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(locale)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-xl border px-3 py-3 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 bg-background text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <span className="text-sm font-medium">{native}</span>
              <span className="text-xs opacity-80">{english}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
