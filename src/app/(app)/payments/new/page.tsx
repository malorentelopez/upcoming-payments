import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PaymentForm } from "@/components/payments/payment-form";
import { PageTransition } from "@/components/motion/page-transition";
import { getCategories, getProfile } from "@/lib/data/queries";

export default async function NewPaymentPage() {
  const [categories, profile] = await Promise.all([
    getCategories(),
    getProfile(),
  ]);

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">New</p>
          <h1 className="text-xl font-semibold tracking-tight">Add payment</h1>
        </div>
      </div>
      <PaymentForm
        categories={categories}
        defaultCurrency={profile?.default_currency ?? "USD"}
      />
    </PageTransition>
  );
}
