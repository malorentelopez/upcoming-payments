"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { useAppData } from "@/components/data/app-data-provider";
import { AppBootOverlay } from "@/components/lifecycle/app-boot-overlay";
import { ensureSession } from "@/lib/supabase/browser";

const RESUME_THRESHOLD_MS = 30_000;
const RESUME_TIMEOUT_MS = 8_000;

export type BootOverlayMode = "loading" | "resuming" | null;

interface AppLifecycleContextValue {
  overlayMode: BootOverlayMode;
  isBootstrapping: boolean;
}

const AppLifecycleContext = createContext<AppLifecycleContextValue | null>(null);

export function AppLifecycleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hasCache, isLoading, refresh } = useAppData();
  const [sessionReady, setSessionReady] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const lastHiddenAt = useRef<number | null>(null);
  const resumeInFlight = useRef(false);

  const runSilentRefresh = useCallback(async () => {
    if (resumeInFlight.current) {
      return;
    }

    resumeInFlight.current = true;

    try {
      await Promise.all([ensureSession(), refresh()]);
      router.refresh();
    } finally {
      resumeInFlight.current = false;
    }
  }, [refresh, router]);

  const runResume = useCallback(async () => {
    if (resumeInFlight.current) {
      return;
    }

    resumeInFlight.current = true;
    setIsResuming(true);

    const timeoutId = window.setTimeout(() => {
      setIsResuming(false);
      resumeInFlight.current = false;
    }, RESUME_TIMEOUT_MS);

    try {
      await Promise.all([ensureSession(), refresh()]);
      router.refresh();
    } finally {
      window.clearTimeout(timeoutId);
      setIsResuming(false);
      resumeInFlight.current = false;
    }
  }, [refresh, router]);

  useEffect(() => {
    let cancelled = false;

    void ensureSession().finally(() => {
      if (!cancelled) {
        setSessionReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        lastHiddenAt.current = Date.now();
        return;
      }

      if (document.visibilityState !== "visible") {
        return;
      }

      const hiddenAt = lastHiddenAt.current;
      if (hiddenAt === null) {
        return;
      }

      const hiddenMs = Date.now() - hiddenAt;
      if (hiddenMs >= RESUME_THRESHOLD_MS) {
        void runResume();
      }
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        void runResume();
      }
    }

    function onOnline() {
      if (document.visibilityState === "visible") {
        void runSilentRefresh();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("online", onOnline);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("online", onOnline);
    };
  }, [runResume, runSilentRefresh]);

  const isColdLoading = !sessionReady || (isLoading && !hasCache);
  const overlayMode: BootOverlayMode = isResuming
    ? "resuming"
    : isColdLoading
      ? "loading"
      : null;

  const value: AppLifecycleContextValue = {
    overlayMode,
    isBootstrapping: overlayMode !== null,
  };

  return (
    <AppLifecycleContext.Provider value={value}>
      {children}
      <AppBootOverlay mode={overlayMode} />
    </AppLifecycleContext.Provider>
  );
}

export function useAppLifecycle() {
  const context = useContext(AppLifecycleContext);
  if (!context) {
    throw new Error("useAppLifecycle must be used within AppLifecycleProvider");
  }
  return context;
}
