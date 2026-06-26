import Link from "next/link";

import { AheadWordmark } from "@/components/brand/ahead-wordmark";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "auto" | "light" | "dark";
}

export function AppLogo({
  className,
  size = "md",
  href = "/",
  variant = "auto",
}: AppLogoProps) {
  const content = (
    <AheadWordmark className={className} size={size} variant={variant} />
  );

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex")}>
        {content}
      </Link>
    );
  }

  return content;
}
