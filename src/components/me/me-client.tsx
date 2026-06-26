"use client";

import { useTranslations } from "next-intl";

import { PageTransition } from "@/components/motion/page-transition";
import { LanguageSettings } from "@/components/settings/language-settings";
import { ProfileForm } from "@/components/settings/profile-form";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/payments";
import type { Profile } from "@/lib/types";

interface MeClientProps {
  profile: Profile;
}

export function MeClient({ profile }: MeClientProps) {
  const t = useTranslations("profile");

  return (
    <PageTransition className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </header>

      <ProfileForm profile={profile} />

      <LanguageSettings />

      <form action={signOut}>
        <Button type="submit" variant="destructive" className="h-11 w-full rounded-xl">
          {t("signOut")}
        </Button>
      </form>
    </PageTransition>
  );
}
