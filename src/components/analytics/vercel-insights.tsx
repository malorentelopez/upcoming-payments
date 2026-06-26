"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { useConsent } from "@/components/consent/consent-provider";

export function VercelInsights() {
  const { consent, hasDecided } = useConsent();

  if (!hasDecided || !consent?.categories.analytics) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
