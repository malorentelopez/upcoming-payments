import { redirect } from "next/navigation";

import { SettingsClient } from "@/components/settings/settings-client";
import { getCategories, getProfile } from "@/lib/data/queries";

export default async function SettingsPage() {
  const [categories, profile] = await Promise.all([
    getCategories(),
    getProfile(),
  ]);

  if (!profile) redirect("/login");

  return <SettingsClient categories={categories} />;
}
