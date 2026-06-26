import { notFound } from "next/navigation";

import { PaymentDetailClient } from "@/components/payments/payment-detail-client";
import { PageTransition } from "@/components/motion/page-transition";
import { getPayment } from "@/lib/data/queries";

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { id } = await params;
  const payment = await getPayment(id);
  if (!payment) notFound();

  return (
    <PageTransition entrance={false}>
      <PaymentDetailClient payment={payment} />
    </PageTransition>
  );
}
