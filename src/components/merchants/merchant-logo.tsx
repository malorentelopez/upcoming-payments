import { cn } from "@/lib/utils";
import type { ResolvedMerchant } from "@/lib/merchants";

const SIZE_CLASSES = {
  sm: "size-6 rounded-md p-1",
  md: "size-8 rounded-lg p-1.5",
  lg: "size-12 rounded-xl p-2",
} as const;

interface MerchantLogoProps {
  merchant: ResolvedMerchant;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function MerchantLogo({
  merchant,
  size = "md",
  className,
}: MerchantLogoProps) {
  return (
    <div
      className={cn("shrink-0", SIZE_CLASSES[size], className)}
      style={{
        backgroundColor: `color-mix(in srgb, ${merchant.color} 18%, transparent)`,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="size-full"
        role="img"
        aria-label={merchant.name}
      >
        <path d={merchant.path} fill={merchant.color} />
      </svg>
    </div>
  );
}
