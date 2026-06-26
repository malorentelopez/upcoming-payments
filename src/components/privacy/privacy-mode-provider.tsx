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
  getStoredPrivacyMode,
  setStoredPrivacyMode,
} from "@/lib/privacy/storage";

interface PrivacyModeContextValue {
  privacyEnabled: boolean;
  setPrivacyEnabled: (enabled: boolean) => void;
  togglePrivacy: () => void;
}

const PrivacyModeContext = createContext<PrivacyModeContextValue | null>(null);

export function PrivacyModeProvider({ children }: { children: ReactNode }) {
  const [privacyEnabled, setPrivacyEnabledState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrivacyEnabledState(getStoredPrivacyMode());
    setHydrated(true);

    function onPrivacyChange(event: Event) {
      setPrivacyEnabledState((event as CustomEvent<boolean>).detail);
    }

    window.addEventListener("ahead:privacy-change", onPrivacyChange);
    return () => window.removeEventListener("ahead:privacy-change", onPrivacyChange);
  }, []);

  const setPrivacyEnabled = useCallback((enabled: boolean) => {
    setPrivacyEnabledState(enabled);
    setStoredPrivacyMode(enabled);
  }, []);

  const togglePrivacy = useCallback(() => {
    setPrivacyEnabled(!privacyEnabled);
  }, [privacyEnabled, setPrivacyEnabled]);

  const value = useMemo(
    () => ({
      privacyEnabled: hydrated ? privacyEnabled : false,
      setPrivacyEnabled,
      togglePrivacy,
    }),
    [hydrated, privacyEnabled, setPrivacyEnabled, togglePrivacy],
  );

  return (
    <PrivacyModeContext.Provider value={value}>{children}</PrivacyModeContext.Provider>
  );
}

export function usePrivacyMode() {
  const context = useContext(PrivacyModeContext);
  if (!context) {
    throw new Error("usePrivacyMode must be used within PrivacyModeProvider");
  }
  return context;
}
