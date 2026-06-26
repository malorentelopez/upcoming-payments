"use client";

import { useTranslations } from "next-intl";

import { TimezoneSelect } from "@/components/settings/timezone-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/payments";
import { CURRENCIES } from "@/lib/payments/constants";
import type { ProfileView } from "@/lib/types";

interface ProfileFormProps {
  profile: ProfileView;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations("profile");

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-4 font-medium">{t("title")}</h2>
      <form action={updateProfile} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">{t("displayName")}</Label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile.display_name ?? ""}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultCurrency">{t("defaultCurrency")}</Label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            defaultValue={profile.default_currency}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <TimezoneSelect defaultValue={profile.timezone} />
        <Button type="submit" className="h-11 rounded-xl">
          {t("saveProfile")}
        </Button>
      </form>
    </section>
  );
}
