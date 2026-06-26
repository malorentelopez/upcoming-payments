import { redirect } from "next/navigation";

import { MeClient } from "@/components/me/me-client";
import { getCurrentUser, getProfile } from "@/lib/data/queries";

export default async function MePage() {
  const [profile, user] = await Promise.all([getProfile(), getCurrentUser()]);
  if (!profile || !user?.email) redirect("/login");

  return <MeClient profile={profile} email={user.email} />;
}
