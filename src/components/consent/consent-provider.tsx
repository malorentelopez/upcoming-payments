"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  acceptAllConsent,
  getStoredConsent,
  rejectNonEssentialConsent,
  saveConsent,
} from "@/lib/consent/storage";
import type { ConsentCategories, ConsentRecord } from "@/lib/consent/types";

interface ConsentContextValue {
  consent: ConsentRecord | null;
  hasDecided: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (categories: ConsentCategories) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  preferencesOpen: boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
    setHydrated(true);

    function onConsentChange(event: Event) {
      setConsent((event as CustomEvent<ConsentRecord>).detail);
    }

    window.addEventListener("ahead:consent-change", onConsentChange);
    return () => window.removeEventListener("ahead:consent-change", onConsentChange);
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(acceptAllConsent());
    setPreferencesOpen(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    setConsent(rejectNonEssentialConsent());
    setPreferencesOpen(false);
  }, []);

  const savePreferences = useCallback((categories: ConsentCategories) => {
    setConsent(saveConsent(categories));
    setPreferencesOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent: hydrated ? consent : null,
      hasDecided: hydrated ? consent !== null : false,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      preferencesOpen,
    }),
    [
      acceptAll,
      consent,
      hydrated,
      preferencesOpen,
      rejectNonEssential,
      savePreferences,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
