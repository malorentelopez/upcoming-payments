"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useAppData } from "@/components/data/app-data-provider";
import { PageTransition } from "@/components/motion/page-transition";
import { PaymentDetailClient } from "@/components/payments/payment-detail-client";
import { PaymentDetailSkeleton } from "@/components/payments/payment-detail-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { fetchPayment } from "@/lib/actions/app-data";
import type { PaymentView } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentDetailGateProps {
  paymentId: string;
}

export function PaymentDetailGate({ paymentId }: PaymentDetailGateProps) {
  const t = useTranslations("payments");
  const { getPaymentById, hasCache } = useAppData();
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

  if (!payment) {
    return <PaymentDetailSkeleton />;
  }

  return (
    <PageTransition entrance={false}>
      <PaymentDetailClient payment={payment} />
    </PageTransition>
  );
}
