"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

import { AheadWordmark } from "@/components/brand/ahead-wordmark";
import type { BootOverlayMode } from "@/components/lifecycle/app-lifecycle-provider";
import { useBodyPortal } from "@/hooks/use-body-portal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

interface AppBootOverlayProps {
  mode: BootOverlayMode;
}

export function AppBootOverlay({ mode }: AppBootOverlayProps) {
  const t = useTranslations("boot");
  const reducedMotion = usePrefersReducedMotion();
  const portalTarget = useBodyPortal();

  if (!mode || !portalTarget) {
    return null;
  }

  const message = mode === "resuming" ? t("refreshing") : t("loading");

  const overlay = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background px-6"
    >
      <AheadWordmark size="lg" />
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {!reducedMotion && (
          <Loader2 className={cn("size-4 shrink-0 animate-spin text-primary")} />
        )}
        <span>{message}</span>
      </div>
    </div>
  );

  return createPortal(overlay, portalTarget);
}
