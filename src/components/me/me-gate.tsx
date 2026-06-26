"use client";

import { useTranslations } from "next-intl";

import { MeClient } from "@/components/me/me-client";
import { useAppData } from "@/components/data/app-data-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function MeGate() {
  const { profile, userEmail, hasCache } = useAppData();
  const t = useTranslations("profile");

  if (!hasCache || !profile || !userEmail) {
    return (
      <div className="space-y-8" aria-busy="true">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <span className="sr-only">{t("title")}</span>
      </div>
    );
  }

  return <MeClient profile={profile} email={userEmail} />;
}
