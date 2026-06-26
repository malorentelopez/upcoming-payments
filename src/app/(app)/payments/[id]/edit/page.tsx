import { PaymentEditGate } from "@/components/payments/payment-edit-gate";

interface EditPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { id } = await params;
  return <PaymentEditGate paymentId={id} />;
}
