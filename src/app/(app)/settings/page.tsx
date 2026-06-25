import { redirect } from "next/navigation";

import { SettingsClient } from "@/components/settings/settings-client";
import { getCategories, getProfile } from "@/lib/data/queries";

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const categories = await getCategories();

  return <SettingsClient profile={profile} categories={categories} />;
}
