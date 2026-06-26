import { cn } from "@/lib/utils";

interface ScrollFadeOverlayProps {
  className?: string;
  /** Shorter, softer fade for the dashboard's inset scroll panel. */
  variant?: "viewport" | "inset";
}

const GRADIENTS: Record<NonNullable<ScrollFadeOverlayProps["variant"]>, string> = {
  viewport: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
  inset:
    "linear-gradient(to top, var(--background) 0%, color-mix(in oklch, var(--background) 50%, transparent) 45%, transparent 100%)",
};

/** Gradient that fades scrollable content into the page background. */
export function ScrollFadeOverlay({
  className,
  variant = "viewport",
}: ScrollFadeOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{ background: GRADIENTS[variant] }}
    />
  );
}
