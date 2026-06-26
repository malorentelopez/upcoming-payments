"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useAppData } from "@/components/data/app-data-provider";
import { PageTransition } from "@/components/motion/page-transition";
import { PaymentForm } from "@/components/payments/payment-form";
import { PaymentFormPageSkeleton } from "@/components/payments/payment-form-page-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { fetchPayment } from "@/lib/actions/app-data";
import type { PaymentView } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentEditGateProps {
  paymentId: string;
}

export function PaymentEditGate({ paymentId }: PaymentEditGateProps) {
  const t = useTranslations("payments");
  const { categories, profile, defaultCurrency, getPaymentById, hasCache } =
    useAppData();
  const cachedPayment = getPaymentById(paymentId);
  const [fetchedPayment, setFetchedPayment] = useState<PaymentView | null>(null);
  const [missing, setMissing] = useState(false);

  const payment = cachedPayment ?? fetchedPayment;

  useEffect(() => {
    if (cachedPayment || fetchedPayment || missing || !hasCache) {
      return;
    }

    let cancelled = false;
    void fetchPayment(paymentId).then((next) => {
      if (cancelled) {
        return;
      }
      if (!next) {
        setMissing(true);
      } else {
        setFetchedPayment(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cachedPayment, fetchedPayment, missing, hasCache, paymentId]);

  if (missing) {
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

  if (!hasCache || !payment) {
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
