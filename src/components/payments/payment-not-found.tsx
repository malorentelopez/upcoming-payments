"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaymentNotFound() {
  const t = useTranslations("payments");

  return (
    <div className="space-y-4 py-8 text-center">
      <p className="text-muted-foreground">{t("notFound")}</p>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
      >
        {t("backToOverview")}
      </Link>
    </div>
  );
}
