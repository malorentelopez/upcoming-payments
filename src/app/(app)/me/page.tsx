import { redirect } from "next/navigation";

import { MeClient } from "@/components/me/me-client";
import { getProfile } from "@/lib/data/queries";

export default async function MePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return <MeClient profile={profile} />;
}
