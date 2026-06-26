"use client";

import { PrivacyModeProvider } from "@/components/privacy/privacy-mode-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <PrivacyModeProvider>{children}</PrivacyModeProvider>;
}
