"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  deletePayment,
  togglePaymentActive,
} from "@/lib/actions/payments";
import { sanitizeHexColor } from "@/lib/security/colors";
import { formatCurrency } from "@/lib/payments/formatters";
import { localeToIntl } from "@/lib/i18n/locale";
import type { PaymentFrequency, PaymentType, PaymentView } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentDetailClientProps {
  payment: PaymentView;
}

export function PaymentDetailClient({ payment }: PaymentDetailClientProps) {
  const router = useRouter();
  const t = useTranslations("payments");
  const tCommon = useTranslations("common");
  const tLedger = useTranslations("ledger");
  const locale = useLocale();
  const intlLocale = localeToIntl(locale as "en" | "fr" | "es" | "de");

  async function handleToggle() {
    const result = await togglePaymentActive(payment.id, !payment.is_active);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(payment.is_active ? t("paymentPaused") : t("paymentActivated"));
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    await deletePayment(payment.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{t("payment")}</p>
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {payment.name}
          </h1>
        </div>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tabular-nums">
              {formatCurrency(payment.amount, payment.currency, intlLocale)}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{t(`types.${payment.type}` as `types.${PaymentType}`)}</Badge>
              <Badge variant="outline">{tLedger(payment.ledger)}</Badge>
              {payment.category && (
                <Badge
                  style={{
                    backgroundColor: sanitizeHexColor(payment.category.color),
                    color: "white",
                  }}
                >
                  {payment.category.name}
                </Badge>
              )}
              {!payment.is_active && (
                <Badge variant="outline">{t("paused")}</Badge>
              )}
            </div>
          </div>
        </div>

        {payment.notes && (
          <p className="mt-4 text-sm text-muted-foreground">{payment.notes}</p>
        )}

        <dl className="mt-6 space-y-3 text-sm">
          <DetailRow label={t("type")} value={t(`types.${payment.type}` as `types.${PaymentType}`)} />
          {payment.type === "recurring" && (
            <>
              <DetailRow
                label={t("frequency")}
                value={t(`frequencies.${payment.frequency ?? "monthly"}` as `frequencies.${PaymentFrequency}`)}
              />
              <DetailRow label={t("startDate")} value={payment.start_date ?? "—"} />
              {payment.end_date && (
                <DetailRow label={t("endDateOptional")} value={payment.end_date} />
              )}
            </>
          )}
          {payment.type === "installment" && (
            <>
              <DetailRow
                label={t("progress")}
                value={t("progressValue", {
                  paid: payment.paid_installments,
                  total: payment.total_installments ?? 0,
                })}
              />
              <DetailRow label={t("nextDue")} value={payment.next_due_date ?? "—"} />
            </>
          )}
          {payment.type === "one_off" && (
            <DetailRow label={t("dueDate")} value={payment.due_date ?? "—"} />
          )}
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/payments/${payment.id}/edit`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 w-full gap-1.5 rounded-xl sm:flex-1",
          )}
        >
          <Pencil className="size-4" />
          {tCommon("edit")}
        </Link>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full gap-1.5 rounded-xl sm:flex-1"
          onClick={handleToggle}
        >
          {payment.is_active ? (
            <>
              <Pause className="size-4" />
              {t("pause")}
            </>
          ) : (
            <>
              <Play className="size-4" />
              {t("activate")}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="h-11 w-full gap-1.5 rounded-xl sm:flex-1"
          onClick={handleDelete}
        >
          <Trash2 className="size-4" />
          {tCommon("delete")}
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
