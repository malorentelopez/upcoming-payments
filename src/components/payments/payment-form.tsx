import { createPayment, updatePayment } from "@/lib/actions/payments";
import type { CategoryView, PaymentView } from "@/lib/types";

import { PaymentFormFields } from "./payment-form-fields";
import { PaymentFormWizard } from "./payment-form-wizard";

interface PaymentFormProps {
  categories: CategoryView[];
  payment?: PaymentView;
  defaultCurrency?: string;
  defaultLedger?: PaymentView["ledger"];
}

export function PaymentForm({
  categories,
  payment,
  defaultCurrency = "USD",
  defaultLedger = "personal",
}: PaymentFormProps) {
  if (!payment) {
    return (
      <PaymentFormWizard
        categories={categories}
        defaultCurrency={defaultCurrency}
        defaultLedger={defaultLedger}
      />
    );
  }

  const action = updatePayment.bind(null, payment.id);

  return (
    <form action={action} className="space-y-6">
      <PaymentFormFields
        categories={categories}
        payment={payment}
        defaultCurrency={defaultCurrency}
        defaultLedger={defaultLedger}
      />
    </form>
  );
}
