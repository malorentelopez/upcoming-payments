"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { CookiePreferencesTrigger } from "@/components/consent/cookie-preferences-dialog";
import { PageTransition } from "@/components/motion/page-transition";
import { CategoriesSection } from "@/components/settings/categories-section";
import { ThemeSettings } from "@/components/theme/theme-settings";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface SettingsClientProps {
  categories: Category[];
}

export function SettingsClient({ categories }: SettingsClientProps) {
  const t = useTranslations("settings");
  const tFooter = useTranslations("footer");

  return (
    <PageTransition className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">{t("app")}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </header>

      <ThemeSettings />

      <CategoriesSection categories={categories} />

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-2 font-medium">{t("privacyCookies")}</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {t("privacyCookiesDesc")}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/privacy"
            className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl")}
          >
            {tFooter("privacy")}
          </Link>
          <Link
            href="/cookies"
            className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl")}
          >
            {tFooter("cookies")}
          </Link>
          <CookiePreferencesTrigger className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium hover:bg-muted">
            {t("cookieSettings")}
          </CookiePreferencesTrigger>
        </div>
      </section>
    </PageTransition>
  );
}
