"use client";

import { PrivacyModeProvider } from "@/components/privacy/privacy-mode-provider";
import { AppDataProvider } from "@/components/data/app-data-provider";
import { AppLifecycleProvider } from "@/components/lifecycle/app-lifecycle-provider";
import { ViewportHeightSync } from "@/components/layout/viewport-height-sync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivacyModeProvider>
      <AppDataProvider>
        <AppLifecycleProvider>
          <ViewportHeightSync />
          {children}
        </AppLifecycleProvider>
      </AppDataProvider>
    </PrivacyModeProvider>
  );
}
