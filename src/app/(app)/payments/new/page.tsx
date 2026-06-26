import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PaymentForm } from "@/components/payments/payment-form";
import { PageTransition } from "@/components/motion/page-transition";
import { getCategories, getProfile } from "@/lib/data/queries";

export default async function NewPaymentPage() {
  const [categories, profile] = await Promise.all([
    getCategories(),
    getProfile(),
  ]);
  const t = await getTranslations("payments");

  return (
    <PageTransition entrance={false} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">{t("new")}</p>
          <h1 className="text-xl font-semibold tracking-tight">{t("addPayment")}</h1>
        </div>
      </div>
      <PaymentForm
        categories={categories}
        defaultCurrency={profile?.default_currency ?? "USD"}
        defaultLedger={profile?.default_ledger ?? "personal"}
      />
    </PageTransition>
  );
}
