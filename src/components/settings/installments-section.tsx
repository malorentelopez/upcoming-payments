"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useAppData } from "@/components/data/app-data-provider";
import { Button } from "@/components/ui/button";
import { syncInstallmentProgress } from "@/lib/actions/payments";
import { getInstallmentCatchUpUpdate } from "@/lib/payments/installments";

export function InstallmentsSection() {
  const t = useTranslations("settings");
  const { payments, refresh: refreshAppData } = useAppData();
  const [isPending, startTransition] = useTransition();
  const hasInstallments = payments.some(
    (payment) => payment.type === "installment",
  );

  if (!hasInstallments) {
    return null;
  }

  function handleSync() {
    const drifted = payments.filter(
      (payment) => getInstallmentCatchUpUpdate(payment) !== null,
    ).length;

    startTransition(async () => {
      const result = await syncInstallmentProgress();
      if (result.error) {
        toast.error(result.error);
        return;
      }

      await refreshAppData();
      toast.success(
        drifted > 0
          ? t("installmentsUpdated", { count: drifted })
          : t("installmentsUpToDate"),
      );
    });
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-2 font-medium">{t("installments")}</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("installmentsDesc")}
      </p>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-xl"
        disabled={isPending}
        onClick={handleSync}
      >
        {t("updateInstallments")}
      </Button>
    </section>
  );
}
