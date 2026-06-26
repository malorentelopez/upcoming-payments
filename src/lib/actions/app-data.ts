"use server";

import {
  getAppShellData,
  getPayment,
  type AppShellData,
} from "@/lib/data/queries";
import type { PaymentView } from "@/lib/types";

export async function fetchAppData(): Promise<AppShellData> {
  return getAppShellData();
}

export async function fetchPayment(id: string): Promise<PaymentView | null> {
  return getPayment(id);
}
