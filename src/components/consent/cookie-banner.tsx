"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CookiePreferencesDialog } from "@/components/consent/cookie-preferences-dialog";
import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const t = useTranslations("consent");
  const tFooter = useTranslations("footer");
  const { hasDecided, acceptAll, rejectNonEssential, openPreferences } =
    useConsent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasDecided) {
      const timer = window.setTimeout(() => setVisible(true), 400);
      return () => window.clearTimeout(timer);
    }
    setVisible(false);
  }, [hasDecided]);

  if (!visible) {
    return <CookiePreferencesDialog />;
  }

  return (
    <>
      <div
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[100] border-t border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur-lg",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          "animate-in slide-in-from-bottom-4 duration-300 md:p-6",
        )}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2 md:max-w-xl">
            <p id="cookie-banner-title" className="font-medium">
              {t("title")}
            </p>
            <p
              id="cookie-banner-description"
              className="text-sm text-muted-foreground"
            >
              {t.rich("description", {
                privacyLink: (chunks) => (
                  <Link
                    href="/privacy"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
                cookieLink: (chunks) => (
                  <Link
                    href="/cookies"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={openPreferences}
            >
              {t("managePreferences")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={rejectNonEssential}
            >
              {t("rejectNonEssential")}
            </Button>
            <Button
              type="button"
              className="h-10 rounded-xl"
              onClick={acceptAll}
            >
              {t("acceptAll")}
            </Button>
          </div>
        </div>
      </div>
      <CookiePreferencesDialog />
    </>
  );
}
