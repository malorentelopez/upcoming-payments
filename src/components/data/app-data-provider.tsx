"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchAppData } from "@/lib/actions/app-data";
import type { DashboardData } from "@/lib/data/queries";
import type { PaymentView, ProfileView } from "@/lib/types";

interface AppDataContextValue {
  payments: PaymentView[];
  profile: ProfileView | null;
  defaultCurrency: string;
  hasCache: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  seedFromServer: (data: DashboardData) => void;
  loadIfEmpty: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const seedFromServer = useCallback((seed: DashboardData) => {
    setData(seed);
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const next = await fetchAppData();
      setData(next);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const loadIfEmpty = useCallback(async () => {
    if (data) {
      return;
    }

    setIsLoading(true);
    try {
      const next = await fetchAppData();
      setData(next);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const value = useMemo(
    () => ({
      payments: data?.payments ?? [],
      profile: data?.profile ?? null,
      defaultCurrency: data?.profile?.default_currency ?? "USD",
      hasCache: data !== null,
      isLoading,
      isRefreshing,
      seedFromServer,
      loadIfEmpty,
      refresh,
    }),
    [data, isLoading, isRefreshing, seedFromServer, loadIfEmpty, refresh],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

/** Apply a server-fetched snapshot when entering a page that loaded data on the server. */
export function AppDataSeed({
  data,
  children,
}: {
  data: DashboardData;
  children: ReactNode;
}) {
  const { seedFromServer } = useAppData();

  useLayoutEffect(() => {
    seedFromServer(data);
  }, [data, seedFromServer]);

  return children;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
