"use client";

import { VercelInsights } from "@/components/analytics/vercel-insights";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";

export function ConsentShell({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      {children}
      <VercelInsights />
      <CookieBanner />
    </ConsentProvider>
  );
}
