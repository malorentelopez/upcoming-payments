"use client";

import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

import { ScrollFadeOverlay } from "@/components/layout/scroll-fade-overlay";
import { useBodyPortal } from "@/hooks/use-body-portal";

/**
 * Viewport-fixed fade above the mobile bottom nav (page-level scroll).
 * Hidden on the dashboard, which uses an in-panel fade on its own scroll area.
 */
export function ScrollBottomFade() {
  const pathname = usePathname();
  const portalTarget = useBodyPortal();

  if (pathname === "/dashboard" || !portalTarget) {
    return null;
  }

  return createPortal(
    <ScrollFadeOverlay className="scroll-bottom-fade fixed inset-x-0 bottom-0 z-40 h-mobile-nav-fade md:hidden" />,
    portalTarget,
  );
}
