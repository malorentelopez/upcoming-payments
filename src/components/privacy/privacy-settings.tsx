"use client";

import { useTranslations } from "next-intl";

import { useFormatCurrency } from "@/hooks/use-format-currency";
import { cn } from "@/lib/utils";

export function PrivacySettings() {
  const t = useTranslations("privacy");
  const { privacyEnabled, setPrivacyEnabled } = useFormatCurrency();

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-2 font-medium">{t("title")}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{t("description")}</p>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-background px-4 py-3">
        <span className="text-sm font-medium">{t("toggleLabel")}</span>
        <button
          type="button"
          role="switch"
          aria-checked={privacyEnabled}
          onClick={() => setPrivacyEnabled(!privacyEnabled)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors",
            privacyEnabled ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "pointer-events-none block size-5 translate-y-0.5 rounded-full bg-white shadow transition-transform",
              privacyEnabled ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      </label>
    </section>
  );
}
