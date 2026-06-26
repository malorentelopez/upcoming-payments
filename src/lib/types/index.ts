export * from "./database";

import type { PaymentFrequency, PaymentLedger, PaymentType } from "./database";

export type CategoryView = {
  id: string;
  name: string;
  color: string;
  icon: string | null;
};

export type ProfileView = {
  id: string;
  display_name: string | null;
  default_currency: string;
  timezone: string;
  locale: string;
  default_ledger: PaymentLedger;
};

export type PaymentView = {
  id: string;
  category_id: string | null;
  name: string;
  amount: number;
  currency: string;
  type: PaymentType;
  frequency: PaymentFrequency | null;
  day_of_month: number | null;
  use_last_day_of_month: boolean;
  start_date: string | null;
  end_date: string | null;
  due_date: string | null;
  next_due_date: string | null;
  total_installments: number | null;
  paid_installments: number;
  notes: string | null;
  is_active: boolean;
  ledger: PaymentLedger;
  category?: CategoryView | null;
};
