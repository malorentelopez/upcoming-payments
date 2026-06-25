"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, Payment, PaymentType } from "@/lib/types";

interface PaymentFormFieldsProps {
  categories: Category[];
  payment?: Payment;
  defaultCurrency?: string;
}

export function PaymentFormFields({
  categories,
  payment,
  defaultCurrency = "USD",
}: PaymentFormFieldsProps) {
  const [type, setType] = useState<PaymentType>(payment?.type ?? "recurring");
  const isEditing = Boolean(payment);

  return (
    <>
      <Tabs
        value={type}
        onValueChange={(v) => setType(v as PaymentType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="recurring" className="rounded-lg">
            Recurring
          </TabsTrigger>
          <TabsTrigger value="installment" className="rounded-lg">
            Installment
          </TabsTrigger>
          <TabsTrigger value="one_off" className="rounded-lg">
            One-off
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <input type="hidden" name="type" value={type} />

      <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={payment?.name}
            placeholder="Netflix, Rent, Car loan..."
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={payment?.amount}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              maxLength={3}
              required
              defaultValue={payment?.currency ?? defaultCurrency}
              className="h-11 rounded-xl uppercase"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={payment?.category_id ?? ""}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {type === "recurring" && <RecurringFields payment={payment} />}
        {type === "installment" && <InstallmentFields payment={payment} />}
        {type === "one_off" && <OneOffFields payment={payment} />}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input
            id="notes"
            name="notes"
            defaultValue={payment?.notes ?? ""}
            placeholder="Any extra details"
            className="h-11 rounded-xl"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={payment?.is_active ?? true}
            className="size-4 rounded border-border"
          />
          Active — include in forecasts
        </label>
      </div>

      <Button type="submit" className="h-11 w-full rounded-xl">
        {isEditing ? "Save changes" : "Add payment"}
      </Button>
    </>
  );
}

function RecurringFields({ payment }: { payment?: Payment }) {
  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <select
          id="frequency"
          name="frequency"
          defaultValue={payment?.frequency ?? "monthly"}
          className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm capitalize"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={payment?.start_date ?? ""}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End date (optional)</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={payment?.end_date ?? ""}
            className="h-11 rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dayOfMonth">Day of month</Label>
        <Input
          id="dayOfMonth"
          name="dayOfMonth"
          type="number"
          min={1}
          max={31}
          defaultValue={payment?.day_of_month ?? 1}
          className="h-11 rounded-xl"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="useLastDayOfMonth"
          value="true"
          defaultChecked={payment?.use_last_day_of_month}
          className="size-4 rounded border-border"
        />
        Use last day of month instead
      </label>
    </div>
  );
}

function InstallmentFields({ payment }: { payment?: Payment }) {
  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="totalInstallments">Total installments</Label>
          <Input
            id="totalInstallments"
            name="totalInstallments"
            type="number"
            min={1}
            required
            defaultValue={payment?.total_installments ?? ""}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paidInstallments">Already paid</Label>
          <Input
            id="paidInstallments"
            name="paidInstallments"
            type="number"
            min={0}
            defaultValue={payment?.paid_installments ?? 0}
            className="h-11 rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nextDueDate">Next due date</Label>
        <Input
          id="nextDueDate"
          name="nextDueDate"
          type="date"
          required
          defaultValue={payment?.next_due_date ?? ""}
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="installmentFrequency">Frequency</Label>
        <select
          id="installmentFrequency"
          name="frequency"
          defaultValue={payment?.frequency ?? "monthly"}
          className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm capitalize"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
    </div>
  );
}

function OneOffFields({ payment }: { payment?: Payment }) {
  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          required
          defaultValue={payment?.due_date ?? ""}
          className="h-11 rounded-xl"
        />
      </div>
    </div>
  );
}
