"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { toUserErrorMessage } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  categorySchema,
  paymentFormSchema,
  profileSchema,
  uuidSchema,
} from "@/lib/payments/schemas";
import type { PaymentFormValues } from "@/lib/payments/schemas";
import type { Database } from "@/lib/types/database";

type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];

function formValuesToRow(values: PaymentFormValues, userId: string): PaymentInsert {
  const base = {
    user_id: userId,
    name: values.name,
    amount: values.amount,
    currency: values.currency,
    category_id: values.categoryId ?? null,
    notes: values.notes ?? null,
    is_active: values.isActive,
    type: values.type,
  };

  switch (values.type) {
    case "recurring":
      return {
        ...base,
        frequency: values.frequency,
        day_of_month: values.useLastDayOfMonth ? null : (values.dayOfMonth ?? null),
        use_last_day_of_month: values.useLastDayOfMonth,
        start_date: values.startDate,
        end_date: values.endDate ?? null,
        due_date: null,
        next_due_date: null,
        total_installments: null,
        paid_installments: 0,
      };
    case "installment":
      return {
        ...base,
        frequency: values.frequency,
        day_of_month: values.useLastDayOfMonth ? null : (values.dayOfMonth ?? null),
        use_last_day_of_month: values.useLastDayOfMonth,
        start_date: null,
        end_date: null,
        due_date: null,
        next_due_date: values.nextDueDate,
        total_installments: values.totalInstallments,
        paid_installments: values.paidInstallments,
      };
    case "one_off":
      return {
        ...base,
        frequency: null,
        day_of_month: null,
        use_last_day_of_month: false,
        start_date: null,
        end_date: null,
        due_date: values.dueDate,
        next_due_date: null,
        total_installments: null,
        paid_installments: 0,
      };
    default: {
      const _exhaustive: never = values;
      return _exhaustive;
    }
  }
}

async function assertCategoryOwned(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  categoryId: string | null | undefined,
): Promise<void> {
  if (!categoryId) return;

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Please select a valid category.");
  }
}

function parsePaymentFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return paymentFormSchema.safeParse({
    ...raw,
    amount: Number(raw.amount),
    isActive: raw.isActive === "true" || raw.isActive === "on",
    useLastDayOfMonth: raw.useLastDayOfMonth === "true" || raw.useLastDayOfMonth === "on",
    dayOfMonth: raw.dayOfMonth ? Number(raw.dayOfMonth) : undefined,
    totalInstallments: raw.totalInstallments ? Number(raw.totalInstallments) : undefined,
    paidInstallments: raw.paidInstallments ? Number(raw.paidInstallments) : 0,
    categoryId: raw.categoryId === "" ? null : raw.categoryId,
  });
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createPayment(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const parsed = parsePaymentFormData(formData);

  if (!parsed.success) {
    throw new Error("Please check the form and try again.");
  }

  await assertCategoryOwned(supabase, user.id, parsed.data.categoryId);

  const { error } = await supabase
    .from("payments")
    .insert(formValuesToRow(parsed.data, user.id));

  if (error) {
    throw new Error(toUserErrorMessage(error, "Could not create payment."));
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");
  redirect("/dashboard");
}

export async function updatePayment(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const paymentId = uuidSchema.safeParse(id);
  if (!paymentId.success) {
    throw new Error("Invalid payment.");
  }

  const parsed = parsePaymentFormData(formData);

  if (!parsed.success) {
    throw new Error("Please check the form and try again.");
  }

  await assertCategoryOwned(supabase, user.id, parsed.data.categoryId);

  const { error } = await supabase
    .from("payments")
    .update(formValuesToRow(parsed.data, user.id))
    .eq("id", paymentId.data)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(toUserErrorMessage(error, "Could not update payment."));
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");
  revalidatePath(`/payments/${paymentId.data}`);
  redirect(`/payments/${paymentId.data}`);
}

export async function deletePayment(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const paymentId = uuidSchema.safeParse(id);
  if (!paymentId.success) {
    throw new Error("Invalid payment.");
  }

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId.data)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(toUserErrorMessage(error, "Could not delete payment."));
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");
  redirect("/dashboard");
}

export async function togglePaymentActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const paymentId = uuidSchema.safeParse(id);
  if (!paymentId.success) {
    return { error: "Invalid payment." };
  }

  const { error } = await supabase
    .from("payments")
    .update({ is_active: isActive })
    .eq("id", paymentId.data)
    .eq("user_id", user.id);

  if (error) {
    return { error: toUserErrorMessage(error, "Could not update payment.") };
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");
  revalidatePath(`/payments/${paymentId.data}`);
  return { success: true };
}

export async function createCategory(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
    icon: formData.get("icon") || null,
  });

  if (!parsed.success) {
    throw new Error("Please check the form and try again.");
  }

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    throw new Error(toUserErrorMessage(error, "Could not create category."));
  }

  revalidatePath("/settings");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const categoryId = uuidSchema.safeParse(id);
  if (!categoryId.success) {
    return { error: "Invalid category." };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId.data)
    .eq("user_id", user.id);

  if (error) {
    return { error: toUserErrorMessage(error, "Could not delete category.") };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName") || null,
    defaultCurrency: formData.get("defaultCurrency"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    throw new Error("Please check the form and try again.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName ?? null,
      default_currency: parsed.data.defaultCurrency,
      timezone: parsed.data.timezone,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(toUserErrorMessage(error, "Could not update profile."));
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/me");
}
