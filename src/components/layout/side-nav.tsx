"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutGrid, Plus, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/60 md:block">
      <div className="sticky top-0 flex h-screen flex-col px-4 py-8">
        <Link href="/dashboard" className="mb-8 px-2 text-lg font-semibold tracking-tight">
          Upcoming
        </Link>
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
          Add payment
        </Link>
      </div>
    </aside>
  );
}
