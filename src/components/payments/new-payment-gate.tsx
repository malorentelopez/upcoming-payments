"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAppData } from "@/components/data/app-data-provider";
import { PageTransition } from "@/components/motion/page-transition";
import { PaymentForm } from "@/components/payments/payment-form";
import { PaymentFormPageSkeleton } from "@/components/payments/payment-form-page-skeleton";

export function NewPaymentGate() {
  const { categories, profile, defaultCurrency, hasCache } = useAppData();
  const t = useTranslations("payments");

  if (!hasCache) {
    return <PaymentFormPageSkeleton />;
  }

  return (
    <PageTransition entrance={false} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">{t("new")}</p>
          <h1 className="text-xl font-semibold tracking-tight">{t("addPayment")}</h1>
        </div>
      </div>
      <PaymentForm
        categories={categories}
        defaultCurrency={defaultCurrency}
        defaultLedger={profile?.default_ledger ?? "personal"}
      />
    </PageTransition>
  );
}
