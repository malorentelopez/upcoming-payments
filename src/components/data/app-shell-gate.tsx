"use client";

import type { ReactNode } from "react";

import { useAppData } from "@/components/data/app-data-provider";

interface AppShellGateProps {
  skeleton: ReactNode;
  ready?: (ctx: ReturnType<typeof useAppData>) => boolean;
  children: ReactNode;
}

export function AppShellGate({ skeleton, ready, children }: AppShellGateProps) {
  const ctx = useAppData();
  const isReady = ready ? ready(ctx) : ctx.hasCache;

  if (!isReady) {
    return skeleton;
  }

  return children;
}
