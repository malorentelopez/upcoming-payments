"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ActiveToggle,
  AmountCurrencyField,
  CategoryChipPicker,
  CompactNumberField,
  DateField,
  FrequencyPicker,
  PaymentLedgerPicker,
  PaymentTypePicker,
  todayIsoDate,
} from "@/components/payments/payment-form-shared";
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
  defaultLedger?: PaymentView["ledger"];
}

export function PaymentFormFields({
  categories,
  payment,
  defaultCurrency = "USD",
  defaultLedger = "personal",
}: PaymentFormFieldsProps) {
  const t = useTranslations("payments");
  const today = todayIsoDate();

  const [type, setType] = useState<PaymentType>(payment?.type ?? "recurring");
  const [ledger, setLedger] = useState<PaymentView["ledger"]>(
    payment?.ledger ?? defaultLedger,
  );
  const [amount, setAmount] = useState(payment?.amount?.toString() ?? "");
  const [currency, setCurrency] = useState(payment?.currency ?? defaultCurrency);
  const [categoryId, setCategoryId] = useState(payment?.category_id ?? "");
  const [frequency, setFrequency] = useState<PaymentFrequency>(
    payment?.frequency ?? "monthly",
  );
  const [startDate, setStartDate] = useState(payment?.start_date ?? today);
  const [endDate, setEndDate] = useState(payment?.end_date ?? "");
  const [dayOfMonth, setDayOfMonth] = useState(
    payment?.day_of_month?.toString() ?? "1",
  );
  const [useLastDayOfMonth, setUseLastDayOfMonth] = useState(
    payment?.use_last_day_of_month ?? false,
  );
  const [totalInstallments, setTotalInstallments] = useState(
    payment?.total_installments?.toString() ?? "",
  );
  const [paidInstallments, setPaidInstallments] = useState(
    payment?.paid_installments?.toString() ?? "0",
  );
  const [nextDueDate, setNextDueDate] = useState(payment?.next_due_date ?? today);
  const [dueDate, setDueDate] = useState(payment?.due_date ?? today);
  const [notes, setNotes] = useState(payment?.notes ?? "");
  const [isActive, setIsActive] = useState(payment?.is_active ?? true);

  return (
    <>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="ledger" value={ledger} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="frequency" value={frequency} />
      <input type="hidden" name="startDate" value={startDate} />
      <input type="hidden" name="endDate" value={endDate} />
      <input type="hidden" name="dayOfMonth" value={dayOfMonth} />
      {useLastDayOfMonth ? (
        <input type="hidden" name="useLastDayOfMonth" value="true" />
      ) : null}
      <input type="hidden" name="totalInstallments" value={totalInstallments} />
      <input type="hidden" name="paidInstallments" value={paidInstallments} />
      <input type="hidden" name="nextDueDate" value={nextDueDate} />
      <input type="hidden" name="dueDate" value={dueDate} />
      <input type="hidden" name="notes" value={notes} />
      {isActive ? <input type="hidden" name="isActive" value="true" /> : null}

      <section className="space-y-5 rounded-2xl border border-border/60 bg-card p-5">
        <PaymentTypePicker value={type} onChange={setType} />
        <PaymentLedgerPicker value={ledger} onChange={setLedger} />

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

        <AmountCurrencyField
          amount={amount}
          currency={currency}
          onAmountChange={setAmount}
          onCurrencyChange={setCurrency}
        />

        <CategoryChipPicker
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
        />

        {type === "recurring" ? (
          <div className="space-y-4 border-t border-border/60 pt-4">
            <FrequencyPicker value={frequency} onChange={setFrequency} />
            <div className="grid grid-cols-2 gap-3">
              <DateField
                id="startDate"
                label={t("startDate")}
                value={startDate}
                onChange={setStartDate}
                required
              />
              <DateField
                id="endDate"
                label={t("endDateOptional")}
                value={endDate}
                onChange={setEndDate}
              />
            </div>
            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <CompactNumberField
                id="dayOfMonth"
                label={t("dayOfMonth")}
                value={dayOfMonth}
                onChange={setDayOfMonth}
                min={1}
                max={31}
                className={useLastDayOfMonth ? "opacity-50" : undefined}
              />
              <button
                type="button"
                onClick={() => setUseLastDayOfMonth((value) => !value)}
                className={
                  useLastDayOfMonth
                    ? "mb-0.5 inline-flex h-11 items-center rounded-xl border border-primary/40 bg-primary/10 px-3 text-xs font-medium text-primary"
                    : "mb-0.5 inline-flex h-11 items-center rounded-xl border border-border/60 px-3 text-xs font-medium text-muted-foreground"
                }
              >
                {t("lastDayShort")}
              </button>
            </div>
          </div>
        ) : null}

        {type === "installment" ? (
          <div className="space-y-4 border-t border-border/60 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <CompactNumberField
                id="totalInstallments"
                label={t("totalInstallments")}
                value={totalInstallments}
                onChange={setTotalInstallments}
                min={1}
                required
              />
              <CompactNumberField
                id="paidInstallments"
                label={t("alreadyPaid")}
                value={paidInstallments}
                onChange={setPaidInstallments}
                min={0}
              />
            </div>
            <DateField
              id="nextDueDate"
              label={t("nextDueDate")}
              value={nextDueDate}
              onChange={setNextDueDate}
              required
            />
            <FrequencyPicker value={frequency} onChange={setFrequency} />
          </div>
        ) : null}

        {type === "one_off" ? (
          <div className="border-t border-border/60 pt-4">
            <DateField
              id="dueDate"
              label={t("dueDate")}
              value={dueDate}
              onChange={setDueDate}
              required
            />
          </div>
        ) : null}

        <div className="space-y-2 border-t border-border/60 pt-4">
          <Label htmlFor="notes">{t("notesOptional")}</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("notesPlaceholder")}
            className="h-11 rounded-xl"
          />
        </div>

        <ActiveToggle checked={isActive} onChange={setIsActive} />
      </section>

      <Button type="submit" className="h-11 w-full rounded-xl">
        {payment ? t("saveChanges") : t("addPayment")}
      </Button>
    </>
  );
}
