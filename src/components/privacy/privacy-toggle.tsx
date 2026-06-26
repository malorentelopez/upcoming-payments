"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { useFormatCurrency } from "@/hooks/use-format-currency";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrivacyToggleProps {
  className?: string;
  compact?: boolean;
}

export function PrivacyToggle({ className, compact = false }: PrivacyToggleProps) {
  const t = useTranslations("privacy");
  const { privacyEnabled, togglePrivacy } = useFormatCurrency();

  return (
    <button
      type="button"
      onClick={togglePrivacy}
      aria-label={privacyEnabled ? t("showAmounts") : t("hideAmounts")}
      aria-pressed={privacyEnabled}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "size-9 rounded-xl px-0",
        privacyEnabled && "text-primary",
        className,
      )}
    >
      {privacyEnabled ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      {!compact && <span className="sr-only">{t("toggleLabel")}</span>}
    </button>
  );
}
