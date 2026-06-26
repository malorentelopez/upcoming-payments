"use client";

import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMotionEntrance } from "@/components/motion/motion-entrance";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  /** Override context; when false, content is visible immediately (better LCP). */
  entrance?: boolean;
}

export function PageTransition({
  children,
  className,
  entrance,
}: PageTransitionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const contextEntrance = useMotionEntrance();
  const shouldAnimate = (entrance ?? contextEntrance) && !reduceMotion;

  return (
    <div
      className={cn(
        className,
        shouldAnimate &&
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:ease-out",
      )}
    >
      {children}
    </div>
  );
}

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  entrance?: boolean;
}

export function StaggerList({ children, className }: StaggerListProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  entrance?: boolean;
}) {
  return <div className={className}>{children}</div>;
}
