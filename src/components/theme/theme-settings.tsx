"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import {
  isThemeOption,
  THEME_OPTIONS,
} from "@/components/theme/theme-options";
import { cn } from "@/lib/utils";

export function ThemeSettings() {
  const t = useTranslations("appearance");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted && theme && isThemeOption(theme) ? theme : "system";

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-2 font-medium">{t("title")}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{t("description")}</p>

      <div className="grid grid-cols-3 gap-2">
        {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
          const selected = activeTheme === value;
          return (
            <button
              key={value}
              type="button"
              disabled={!mounted}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs transition-colors",
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 bg-background text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {mounted && (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("currentlyUsing", {
            mode: resolvedTheme === "dark" ? t("dark") : t("light"),
            systemNote: activeTheme === "system" ? t("fromSystem") : "",
          })}
        </p>
      )}
    </section>
  );
}
