import { redirect } from "next/navigation";

import { BottomNav } from "@/components/layout/bottom-nav";
import { SideNav } from "@/components/layout/side-nav";
import { getCurrentUser } from "@/lib/data/queries";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-full">
      <SideNav />
      <div className="flex min-h-full flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 md:max-w-4xl md:px-8 md:pb-8">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
