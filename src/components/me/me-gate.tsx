"use client";

import { useTranslations } from "next-intl";

import { AppShellGate } from "@/components/data/app-shell-gate";
import { MeClient } from "@/components/me/me-client";
import { useAppData } from "@/components/data/app-data-provider";
import { Skeleton } from "@/components/ui/skeleton";

function MeSkeleton() {
  const t = useTranslations("profile");

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

export function MeGate() {
  const { profile, userEmail } = useAppData();

  return (
    <AppShellGate
      skeleton={<MeSkeleton />}
      ready={(ctx) =>
        ctx.hasCache && ctx.profile !== null && ctx.userEmail !== null
      }
    >
      {profile && userEmail ? (
        <MeClient profile={profile} email={userEmail} />
      ) : null}
    </AppShellGate>
  );
}
