"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CategoryView,
  PaymentFrequency,
  PaymentType,
  PaymentView,
} from "@/lib/types";

interface PaymentFormFieldsProps {
  categories: CategoryView[];
  payment?: PaymentView;
  defaultCurrency?: string;
}

export function PaymentFormFields({
  categories,
  payment,
  defaultCurrency = "USD",
}: PaymentFormFieldsProps) {
  const t = useTranslations("payments");
  const tCommon = useTranslations("common");
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
            {t("types.recurring")}
          </TabsTrigger>
          <TabsTrigger value="installment" className="rounded-lg">
            {t("types.installment")}
          </TabsTrigger>
          <TabsTrigger value="one_off" className="rounded-lg">
            {t("types.one_off")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <input type="hidden" name="type" value={type} />

      <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={payment?.name}
            placeholder={t("namePlaceholder")}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")}</Label>
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
            <Label htmlFor="currency">{t("currency")}</Label>
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
          <Label htmlFor="categoryId">{t("category")}</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={payment?.category_id ?? ""}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">{tCommon("none")}</option>
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
          <Label htmlFor="notes">{t("notesOptional")}</Label>
          <Input
            id="notes"
            name="notes"
            defaultValue={payment?.notes ?? ""}
            placeholder={t("notesPlaceholder")}
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
          {t("activeForecast")}
        </label>
      </div>

      <Button type="submit" className="h-11 w-full rounded-xl">
        {isEditing ? t("saveChanges") : t("addPayment")}
      </Button>
    </>
  );
}

function FrequencySelect({
  id,
  name,
  defaultValue,
}: {
  id: string;
  name: string;
  defaultValue?: PaymentFrequency | null;
}) {
  const t = useTranslations("payments.frequencies");
  const frequencies: PaymentFrequency[] = ["weekly", "monthly", "yearly"];

  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue ?? "monthly"}
      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
    >
      {frequencies.map((frequency) => (
        <option key={frequency} value={frequency}>
          {t(frequency)}
        </option>
      ))}
    </select>
  );
}

function RecurringFields({ payment }: { payment?: PaymentView }) {
  const t = useTranslations("payments");

  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="space-y-2">
        <Label htmlFor="frequency">{t("frequency")}</Label>
        <FrequencySelect
          id="frequency"
          name="frequency"
          defaultValue={payment?.frequency}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">{t("startDate")}</Label>
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
          <Label htmlFor="endDate">{t("endDateOptional")}</Label>
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
        <Label htmlFor="dayOfMonth">{t("dayOfMonth")}</Label>
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
        {t("useLastDayOfMonth")}
      </label>
    </div>
  );
}

function InstallmentFields({ payment }: { payment?: PaymentView }) {
  const t = useTranslations("payments");

  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="totalInstallments">{t("totalInstallments")}</Label>
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
          <Label htmlFor="paidInstallments">{t("alreadyPaid")}</Label>
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
        <Label htmlFor="nextDueDate">{t("nextDueDate")}</Label>
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
        <Label htmlFor="installmentFrequency">{t("frequency")}</Label>
        <FrequencySelect
          id="installmentFrequency"
          name="frequency"
          defaultValue={payment?.frequency}
        />
      </div>
    </div>
  );
}

function OneOffFields({ payment }: { payment?: PaymentView }) {
  const t = useTranslations("payments");

  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="space-y-2">
        <Label htmlFor="dueDate">{t("dueDate")}</Label>
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
