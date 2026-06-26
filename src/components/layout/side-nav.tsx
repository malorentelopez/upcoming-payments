"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutGrid, Plus, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppLogo } from "@/components/brand/app-logo";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const links = [
    { href: "/dashboard", label: t("overview"), icon: LayoutGrid },
    { href: "/insights", label: t("insights"), icon: BarChart3 },
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/me", label: t("me"), icon: User },
  ];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/60 md:block">
      <div className="sticky top-0 flex h-screen flex-col px-4 py-8">
        <AppLogo href="/dashboard" className="mb-8 px-2" />
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/payments/new"
          className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          {tCommon("addPayment")}
        </Link>
      </div>
    </aside>
  );
}
