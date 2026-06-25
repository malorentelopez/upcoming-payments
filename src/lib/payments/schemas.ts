import { z } from "zod";

export const paymentTypeSchema = z.enum(["recurring", "installment", "one_off"]);
export const frequencySchema = z.enum(["weekly", "monthly", "yearly"]);

const basePaymentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z.string().min(3).max(3).default("USD"),
  categoryId: z.string().uuid().nullable().optional(),
  notes: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const recurringPaymentSchema = basePaymentSchema.extend({
  type: z.literal("recurring"),
  frequency: frequencySchema.default("monthly"),
  dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
  useLastDayOfMonth: z.boolean().default(false),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
});

export const installmentPaymentSchema = basePaymentSchema.extend({
  type: z.literal("installment"),
  frequency: frequencySchema.default("monthly"),
  dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
  useLastDayOfMonth: z.boolean().default(false),
  totalInstallments: z.coerce.number().int().positive(),
  paidInstallments: z.coerce.number().int().min(0).default(0),
  nextDueDate: z.string().min(1, "Next due date is required"),
});

export const oneOffPaymentSchema = basePaymentSchema.extend({
  type: z.literal("one_off"),
  dueDate: z.string().min(1, "Due date is required"),
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
  icon: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  defaultCurrency: z.string().length(3),
  timezone: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = loginSchema.extend({
  displayName: z.string().min(1).max(100).optional(),
});
