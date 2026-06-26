"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutGrid,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

function NavTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-11 min-w-[4.5rem] flex-col items-center justify-end gap-1 rounded-xl px-3 py-2 text-xs transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const leftTabs = [
    { href: "/dashboard", label: t("overview"), icon: LayoutGrid },
    { href: "/insights", label: t("insights"), icon: BarChart3 },
  ];

  const rightTabs = [
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/me", label: t("me"), icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-lg md:hidden">
      <div className="relative mx-auto max-w-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end px-2">
          <ul className="flex items-end justify-evenly">
            {leftTabs.map(({ href, label, icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <NavTab
                    href={href}
                    label={label}
                    icon={icon}
                    active={active}
                  />
                </li>
              );
            })}
          </ul>

          <div className="w-14 shrink-0" aria-hidden />

          <ul className="flex items-end justify-evenly">
            {rightTabs.map(({ href, label, icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <NavTab
                    href={href}
                    label={label}
                    icon={icon}
                    active={active}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <Link
          href="/payments/new"
          aria-label={tCommon("addPayment")}
          className="absolute left-1/2 top-2 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95">
            <Plus className="size-6" />
          </span>
        </Link>
      </div>
    </nav>
  );
}
