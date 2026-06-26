import { Monitor, Moon, Sun } from "lucide-react";

export const THEME_OPTIONS = [
  { value: "system", labelKey: "system", icon: Monitor },
  { value: "light", labelKey: "light", icon: Sun },
  { value: "dark", labelKey: "dark", icon: Moon },
] as const;

export type ThemeOption = (typeof THEME_OPTIONS)[number]["value"];

export function isThemeOption(value: string): value is ThemeOption {
  return THEME_OPTIONS.some((option) => option.value === value);
}
