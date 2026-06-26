"use client";

import { useTranslations } from "next-intl";

import { SettingsClient } from "@/components/settings/settings-client";
import { useAppData } from "@/components/data/app-data-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsGate() {
  const { categories, hasCache } = useAppData();
  const t = useTranslations("settings");

  if (!hasCache) {
    return (
      <div className="space-y-8" aria-busy="true">
        <header className="space-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-32" />
        </header>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <span className="sr-only">{t("title")}</span>
      </div>
    );
  }

  return <SettingsClient categories={categories} />;
}
