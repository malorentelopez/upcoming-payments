export type PaymentType = "recurring" | "installment" | "one_off";
export type PaymentFrequency = "weekly" | "monthly" | "yearly";

export interface Profile {
  id: string;
  display_name: string | null;
  default_currency: string;
  timezone: string;
  locale: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface PaymentOccurrence {
  paymentId: string;
  name: string;
  amount: number;
  currency: string;
  dueDate: Date;
  category: Pick<Category, "id" | "name" | "color" | "icon"> | null;
  type: PaymentType;
  installmentRemainingCount?: number;
  installmentPendingAmount?: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Profile, "id">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Category, "id" | "user_id">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at" | "updated_at" | "category"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Payment, "id" | "user_id" | "category">>;
      };
    };
    Enums: {
      payment_type: PaymentType;
      payment_frequency: PaymentFrequency;
    };
  };
}
