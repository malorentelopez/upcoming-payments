"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAppData } from "@/components/data/app-data-provider";
import { PageTransition } from "@/components/motion/page-transition";
import { PaymentForm } from "@/components/payments/payment-form";
import { PaymentFormPageSkeleton } from "@/components/payments/payment-form-page-skeleton";
import { PaymentNotFound } from "@/components/payments/payment-not-found";
import { usePayment } from "@/hooks/use-payment";

interface PaymentEditGateProps {
  paymentId: string;
}

export function PaymentEditGate({ paymentId }: PaymentEditGateProps) {
  const t = useTranslations("payments");
  const { categories, profile, defaultCurrency } = useAppData();
  const { payment, status } = usePayment(paymentId);

  if (status === "missing") {
    return <PaymentNotFound />;
  }

  if (!payment) {
    return <PaymentFormPageSkeleton />;
  }

  return (
    <PageTransition entrance={false} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/payments/${paymentId}`}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">{t("edit")}</p>
          <h1 className="text-xl font-semibold tracking-tight">{payment.name}</h1>
        </div>
      </div>
      <PaymentForm
        categories={categories}
        payment={payment}
        defaultCurrency={defaultCurrency}
        defaultLedger={profile?.default_ledger ?? "personal"}
      />
    </PageTransition>
  );
}
