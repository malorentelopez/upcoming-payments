"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  deletePayment,
  togglePaymentActive,
} from "@/lib/actions/payments";
import {
  formatCurrency,
  paymentTypeLabel,
} from "@/lib/payments/formatters";
import type { Payment } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentDetailClientProps {
  payment: Payment;
}

export function PaymentDetailClient({ payment }: PaymentDetailClientProps) {
  const router = useRouter();

  async function handleToggle() {
    const result = await togglePaymentActive(payment.id, !payment.is_active);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(payment.is_active ? "Payment paused" : "Payment activated");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this payment? This cannot be undone.")) return;
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
          <p className="text-sm text-muted-foreground">Payment</p>
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {payment.name}
          </h1>
        </div>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tabular-nums">
              {formatCurrency(payment.amount, payment.currency)}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{paymentTypeLabel(payment.type)}</Badge>
              {payment.category && (
                <Badge
                  style={{ backgroundColor: payment.category.color, color: "white" }}
                >
                  {payment.category.name}
                </Badge>
              )}
              {!payment.is_active && (
                <Badge variant="outline">Paused</Badge>
              )}
            </div>
          </div>
        </div>

        {payment.notes && (
          <p className="mt-4 text-sm text-muted-foreground">{payment.notes}</p>
        )}

        <dl className="mt-6 space-y-3 text-sm">
          <DetailRow label="Type" value={paymentTypeLabel(payment.type)} />
          {payment.type === "recurring" && (
            <>
              <DetailRow label="Frequency" value={payment.frequency ?? "monthly"} />
              <DetailRow label="Start date" value={payment.start_date ?? "—"} />
              {payment.end_date && (
                <DetailRow label="End date" value={payment.end_date} />
              )}
            </>
          )}
          {payment.type === "installment" && (
            <>
              <DetailRow
                label="Progress"
                value={`${payment.paid_installments} / ${payment.total_installments} paid`}
              />
              <DetailRow label="Next due" value={payment.next_due_date ?? "—"} />
            </>
          )}
          {payment.type === "one_off" && (
            <DetailRow label="Due date" value={payment.due_date ?? "—"} />
          )}
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/payments/${payment.id}/edit`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 flex-1 rounded-xl",
          )}
        >
          <Pencil className="size-4" />
          Edit
        </Link>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-xl"
          onClick={handleToggle}
        >
          {payment.is_active ? "Pause" : "Activate"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="h-11 rounded-xl"
          onClick={handleDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}
