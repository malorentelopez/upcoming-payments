import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PaymentForm } from "@/components/payments/payment-form";
import { PageTransition } from "@/components/motion/page-transition";
import { getCategories, getPayment, getProfile } from "@/lib/data/queries";

interface EditPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { id } = await params;
  const [payment, categories, profile] = await Promise.all([
    getPayment(id),
    getCategories(),
    getProfile(),
  ]);

  if (!payment) notFound();

  const t = await getTranslations("payments");

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/payments/${id}`}
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
        defaultCurrency={profile?.default_currency ?? "USD"}
        defaultLedger={profile?.default_ledger ?? "personal"}
      />
    </PageTransition>
  );
}
