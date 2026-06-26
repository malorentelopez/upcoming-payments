"use client";

import { PrivacyModeProvider } from "@/components/privacy/privacy-mode-provider";
import { AppDataProvider } from "@/components/data/app-data-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivacyModeProvider>
      <AppDataProvider>{children}</AppDataProvider>
    </PrivacyModeProvider>
  );
}
