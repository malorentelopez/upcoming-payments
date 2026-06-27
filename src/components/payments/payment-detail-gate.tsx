"use client";

import { PageTransition } from "@/components/motion/page-transition";
import { PaymentDetailClient } from "@/components/payments/payment-detail-client";
import { PaymentDetailSkeleton } from "@/components/payments/payment-detail-skeleton";
import { PaymentNotFound } from "@/components/payments/payment-not-found";
import { usePayment } from "@/hooks/use-payment";

interface PaymentDetailGateProps {
  paymentId: string;
}

export function PaymentDetailGate({ paymentId }: PaymentDetailGateProps) {
  const { payment, status } = usePayment(paymentId);

  if (status === "missing") {
    return <PaymentNotFound />;
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
