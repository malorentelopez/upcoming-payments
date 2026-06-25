"use client";

import { PageTransition } from "@/components/motion/page-transition";
import { CategoriesSection } from "@/components/settings/categories-section";
import { ProfileForm } from "@/components/settings/profile-form";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/payments";
import type { Category, Profile } from "@/lib/types";

interface SettingsClientProps {
  profile: Profile;
  categories: Category[];
}

export function SettingsClient({ profile, categories }: SettingsClientProps) {
  return (
    <PageTransition className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </header>

      <ProfileForm profile={profile} />
      <CategoriesSection categories={categories} />

      <form action={signOut}>
        <Button type="submit" variant="outline" className="h-11 w-full rounded-xl">
          Sign out
        </Button>
      </form>
    </PageTransition>
  );
}
