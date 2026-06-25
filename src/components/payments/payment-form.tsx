import { createPayment, updatePayment } from "@/lib/actions/payments";
import type { Category, Payment } from "@/lib/types";

import { PaymentFormFields } from "./payment-form-fields";

interface PaymentFormProps {
  categories: Category[];
  payment?: Payment;
  defaultCurrency?: string;
}

export function PaymentForm({
  categories,
  payment,
  defaultCurrency = "USD",
}: PaymentFormProps) {
  const action = payment
    ? updatePayment.bind(null, payment.id)
    : createPayment;

  return (
    <form action={action} className="space-y-6">
      <PaymentFormFields
        categories={categories}
        payment={payment}
        defaultCurrency={defaultCurrency}
      />
    </form>
  );
}
