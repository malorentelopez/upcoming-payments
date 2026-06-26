import { cn } from "@/lib/utils";

interface AheadIconProps {
  className?: string;
  size?: number;
  variant?: "auto" | "light" | "dark";
}

/** Lowercase "a" monogram — used for favicon-style marks and compact branding. */
export function AheadIcon({
  className,
  size = 32,
  variant = "auto",
}: AheadIconProps) {
  const fill =
    variant === "dark"
      ? "oklch(0.72 0.14 185)"
      : variant === "light"
        ? "oklch(0.55 0.12 185)"
        : "var(--primary)";

  const bg =
    variant === "dark"
      ? "oklch(0.205 0 0)"
      : variant === "light"
        ? "oklch(0.99 0.004 95)"
        : "var(--background)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill={bg} />
      <path
        d="M16 23.5c-3.8 0-6.8-2.6-6.8-6.2S12.2 11.2 16 11.2c1.9 0 3.5.8 4.6 2V11h2.9v12.5h-2.7v-1.8c-1 1.2-2.6 1.8-4.8 1.8zm.2-2.6c2.2 0 3.9-1.7 3.9-3.9S18.4 13 16.2 13s-3.9 1.7-3.9 3.9 1.7 3.9 3.9 3.9z"
        fill={fill}
      />
    </svg>
  );
}
