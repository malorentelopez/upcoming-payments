"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "system", labelKey: "system", icon: Monitor },
  { value: "light", labelKey: "light", icon: Sun },
  { value: "dark", labelKey: "dark", icon: Moon },
] as const;

type ThemeOption = (typeof THEME_OPTIONS)[number]["value"];

function isThemeOption(value: string): value is ThemeOption {
  return THEME_OPTIONS.some((option) => option.value === value);
}

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
