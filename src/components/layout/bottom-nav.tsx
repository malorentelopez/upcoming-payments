"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutGrid, Plus, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/payments/new", label: "Add", icon: Plus, isFab: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-lg md:hidden">
      <ul className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map(({ href, label, icon: Icon, isFab }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href.replace("/new", "")));

          if (isFab) {
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex -translate-y-3 flex-col items-center gap-1"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95">
                    <Icon className="size-6" />
                  </span>
                  <span className="sr-only">{label}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
