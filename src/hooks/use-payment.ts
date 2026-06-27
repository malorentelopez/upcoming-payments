"use client";

import { useEffect, useState } from "react";

import { useAppData } from "@/components/data/app-data-provider";
import { fetchPayment } from "@/lib/actions/app-data";
import type { PaymentView } from "@/lib/types";

export type PaymentLoadStatus = "loading" | "ready" | "missing";

export function usePayment(paymentId: string): {
  payment: PaymentView | null;
  status: PaymentLoadStatus;
} {
  const { getPaymentById, hasCache, upsertPayment } = useAppData();
  const cached = getPaymentById(paymentId);
  const [status, setStatus] = useState<PaymentLoadStatus>(() =>
    cached ? "ready" : "loading",
  );

  useEffect(() => {
    if (cached) {
      setStatus("ready");
      return;
    }

    if (!hasCache) {
      return;
    }

    let cancelled = false;
    setStatus("loading");

    void fetchPayment(paymentId).then((next) => {
      if (cancelled) {
        return;
      }
      if (!next) {
        setStatus("missing");
        return;
      }
      upsertPayment(next);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [cached, hasCache, paymentId, upsertPayment]);

  const payment = getPaymentById(paymentId);

  return {
    payment,
    status: payment ? "ready" : status,
  };
}
