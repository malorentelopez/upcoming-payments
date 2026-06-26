import { cache } from "react";

import { getAuthUser } from "@/lib/data/auth";
import { sanitizeHexColor } from "@/lib/security/colors";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  CategoryView,
  Payment,
  PaymentView,
  Profile,
  ProfileView,
} from "@/lib/types";
import type { LedgerFilter } from "@/lib/payments/ledger";
import { uuidSchema } from "@/lib/payments/schemas";

const PROFILE_COLUMNS =
  "id, display_name, default_currency, timezone, locale, default_ledger, created_at";

const CATEGORY_COLUMNS = "id, user_id, name, color, icon, created_at";

const PAYMENT_COLUMNS =
  "id, user_id, category_id, name, amount, currency, type, frequency, day_of_month, use_last_day_of_month, start_date, end_date, due_date, next_due_date, total_installments, paid_installments, notes, is_active, ledger, updated_at";

const NESTED_CATEGORY_COLUMNS = "id, name, color, icon";

function toCategoryView(category: NestedCategoryRow): CategoryView {
  return {
    id: category.id,
    name: category.name,
    color: sanitizeHexColor(category.color),
    icon: category.icon,
  };
}

function toProfileView(profile: Profile): ProfileView {
  return {
    id: profile.id,
    display_name: profile.display_name,
    default_currency: profile.default_currency,
    timezone: profile.timezone,
    locale: profile.locale,
    default_ledger: profile.default_ledger ?? "personal",
  };
}

type NestedCategoryRow = Pick<Category, "id" | "name" | "color" | "icon">;

type PaymentRow = {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  amount: number | string;
  currency: string;
  type: Payment["type"];
  frequency: Payment["frequency"];
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
  ledger: Payment["ledger"];
  category?: NestedCategoryRow | NestedCategoryRow[] | null;
};

function toPaymentView(row: PaymentRow): PaymentView {
  const category = Array.isArray(row.category)
    ? row.category[0] ?? null
    : row.category ?? null;

  return {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    amount: Number(row.amount),
    currency: row.currency,
    type: row.type,
    frequency: row.frequency,
    day_of_month: row.day_of_month,
    use_last_day_of_month: row.use_last_day_of_month,
    start_date: row.start_date,
    end_date: row.end_date,
    due_date: row.due_date,
    next_due_date: row.next_due_date,
    total_installments: row.total_installments,
    paid_installments: row.paid_installments,
    notes: row.notes,
    is_active: row.is_active,
    ledger: row.ledger ?? "personal",
    category: category ? toCategoryView(category) : null,
  };
}

export async function getCurrentUser() {
  return getAuthUser();
}

export const getProfile = cache(async (): Promise<ProfileView | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", user.id)
    .single();

  return data ? toProfileView(data) : null;
});

export const getCategories = cache(async (): Promise<CategoryView[]> => {
  const user = await getAuthUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("user_id", user.id)
    .order("name");

  return (data ?? []).map(toCategoryView);
});

export const getPayments = cache(async function getPayments(
  ledgerFilter: LedgerFilter = "all",
): Promise<PaymentView[]> {
  const user = await getAuthUser();
  if (!user) return [];

  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select(`${PAYMENT_COLUMNS}, category:categories(${NESTED_CATEGORY_COLUMNS})`)
    .eq("user_id", user.id);

  if (ledgerFilter !== "all") {
    query = query.eq("ledger", ledgerFilter);
  }

  const { data } = await query.order("name");

  return (data ?? []).map((row) => toPaymentView(row as PaymentRow));
});

export async function getPayment(id: string): Promise<PaymentView | null> {
  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return null;

  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select(`${PAYMENT_COLUMNS}, category:categories(${NESTED_CATEGORY_COLUMNS})`)
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .single();

  return data ? toPaymentView(data as PaymentRow) : null;
}

export interface AppShellData {
  payments: PaymentView[];
  profile: ProfileView | null;
  categories: CategoryView[];
  userEmail: string | null;
}

/** @deprecated Use AppShellData */
export type DashboardData = AppShellData;

/** Parallel fetch of all data needed by main app tabs. */
export const getAppShellData = cache(async (): Promise<AppShellData> => {
  const [payments, profile, categories, user] = await Promise.all([
    getPayments(),
    getProfile(),
    getCategories(),
    getCurrentUser(),
  ]);

  return {
    payments,
    profile,
    categories,
    userEmail: user?.email ?? null,
  };
});

/** @deprecated Use getAppShellData */
export const getDashboardData = getAppShellData;
