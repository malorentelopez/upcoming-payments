import { z } from "zod";

import { CURRENCIES } from "@/lib/payments/constants";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

const currencySchema = z.enum(CURRENCIES);

export const paymentTypeSchema = z.enum(["recurring", "installment", "one_off"]);
export const frequencySchema = z.enum(["weekly", "monthly", "yearly"]);

const basePaymentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: currencySchema.default("USD"),
  categoryId: z.string().uuid().nullable().optional(),
  notes: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const recurringPaymentSchema = basePaymentSchema.extend({
  type: z.literal("recurring"),
  frequency: frequencySchema.default("monthly"),
  dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
  useLastDayOfMonth: z.boolean().default(false),
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional().nullable(),
});

export const installmentPaymentSchema = basePaymentSchema
  .extend({
    type: z.literal("installment"),
    frequency: frequencySchema.default("monthly"),
    dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
    useLastDayOfMonth: z.boolean().default(false),
    totalInstallments: z.coerce.number().int().positive(),
    paidInstallments: z.coerce.number().int().min(0).default(0),
    nextDueDate: isoDateSchema,
  })
  .refine((data) => data.paidInstallments <= data.totalInstallments, {
    message: "Paid installments cannot exceed total installments",
    path: ["paidInstallments"],
  });

export const oneOffPaymentSchema = basePaymentSchema.extend({
  type: z.literal("one_off"),
  dueDate: isoDateSchema,
});

export const paymentFormSchema = z.discriminatedUnion("type", [
  recurringPaymentSchema,
  installmentPaymentSchema,
  oneOffPaymentSchema,
]);

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  icon: z.string().max(32).optional().nullable(),
});

function isValidTimezone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const profileSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  defaultCurrency: currencySchema,
  timezone: z
    .string()
    .min(1)
    .refine(isValidTimezone, "Invalid timezone"),
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const signupSchema = loginSchema.extend({
  displayName: z.string().min(1).max(100).optional(),
});

export const uuidSchema = z.string().uuid();
