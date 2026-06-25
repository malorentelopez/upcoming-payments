import { createClient } from "@/lib/supabase/server";
import type { Category, Payment, Profile } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  return data ?? [];
}

export async function getPayments(): Promise<Payment[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("payments")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .order("name");

  return (data ?? []).map((row) => {
    const category = Array.isArray(row.category)
      ? row.category[0] ?? null
      : row.category ?? null;

    return {
      ...row,
      amount: Number(row.amount),
      category,
    };
  });
}

export async function getPayment(id: string): Promise<Payment | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("payments")
    .select("*, category:categories(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!data) return null;

  const category = Array.isArray(data.category)
    ? data.category[0] ?? null
    : data.category ?? null;

  return {
    ...data,
    amount: Number(data.amount),
    category,
  };
}
