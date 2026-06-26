"use client";

import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import {
  isThemeOption,
  THEME_OPTIONS,
  type ThemeOption,
} from "@/components/theme/theme-options";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function ThemeSwitcher({ className, compact = false }: ThemeSwitcherProps) {
  const t = useTranslations("appearance");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme =
    mounted && theme && isThemeOption(theme) ? theme : "system";

  const triggerOption =
    THEME_OPTIONS.find((option) => option.value === activeTheme) ??
    THEME_OPTIONS[0];
  const TriggerIcon = triggerOption.icon;

  function handleSelect(value: ThemeOption) {
    if (value === activeTheme) return;
    setTheme(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={!mounted}
        aria-label={t("changeTheme")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 gap-1.5 rounded-xl",
          compact ? "size-9 px-0 sm:size-auto sm:px-2.5" : "px-2.5",
          className,
        )}
      >
        <TriggerIcon className="size-4" />
        <span className={cn("text-sm", compact && "hidden sm:inline")}>
          {t(triggerOption.labelKey)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
          const selected = value === activeTheme;

          return (
            <DropdownMenuItem
              key={value}
              onClick={() => handleSelect(value)}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <span className="font-medium">{t(labelKey)}</span>
              </span>
              {selected && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        {mounted && activeTheme === "system" && resolvedTheme && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            {t("currentlyUsing", {
              mode: resolvedTheme === "dark" ? t("dark") : t("light"),
              systemNote: t("fromSystem"),
            })}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
