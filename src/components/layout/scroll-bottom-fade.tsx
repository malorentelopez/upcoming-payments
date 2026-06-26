"use client";

import { usePathname } from "next/navigation";

import { ScrollFadeOverlay } from "@/components/layout/scroll-fade-overlay";

/**
 * Viewport-fixed fade above the mobile bottom nav (page-level scroll).
 * Hidden on the dashboard, which uses an in-panel fade on its own scroll area.
 */
export function ScrollBottomFade() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <ScrollFadeOverlay className="fixed inset-x-0 bottom-0 z-40 h-mobile-nav-fade md:hidden" />
  );
}
