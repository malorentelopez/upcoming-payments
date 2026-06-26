import { PaymentDetailGate } from "@/components/payments/payment-detail-gate";

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { id } = await params;
  return <PaymentDetailGate paymentId={id} />;
}
