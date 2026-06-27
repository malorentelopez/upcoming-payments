"use client";

import { PrivacyModeProvider } from "@/components/privacy/privacy-mode-provider";
import { AppDataProvider } from "@/components/data/app-data-provider";
import { AppLifecycleProvider } from "@/components/lifecycle/app-lifecycle-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivacyModeProvider>
      <AppDataProvider>
        <AppLifecycleProvider>{children}</AppLifecycleProvider>
      </AppDataProvider>
    </PrivacyModeProvider>
  );
}
