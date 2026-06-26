import { cn } from "@/lib/utils";

interface AheadWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Auto follows theme via CSS variables. Use explicit variants for fixed contexts (e.g. exports). */
  variant?: "auto" | "light" | "dark";
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
} as const;

export function AheadWordmark({
  className,
  size = "md",
  variant = "auto",
}: AheadWordmarkProps) {
  const headColor =
    variant === "light"
      ? "text-[oklch(0.18_0.01_260)]"
      : variant === "dark"
        ? "text-[oklch(0.985_0_0)]"
        : "text-foreground";

  const accentColor =
    variant === "dark"
      ? "text-[oklch(0.72_0.14_185)]"
      : "text-primary";

  return (
    <span
      className={cn(
        "inline-flex items-baseline font-semibold lowercase tracking-tight",
        sizeClasses[size],
        className,
      )}
      aria-label="ahead"
    >
      <span className={accentColor}>a</span>
      <span className={headColor}>head</span>
    </span>
  );
}
