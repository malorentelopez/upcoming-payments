"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AmountCurrencyField,
  CategoryChipPicker,
  CompactNumberField,
  DateField,
  FormStepIndicator,
  FrequencyPicker,
  PaymentLedgerPicker,
  PaymentTypePicker,
  todayIsoDate,
} from "@/components/payments/payment-form-shared";
import { createPayment } from "@/lib/actions/payments";
import type {
  CategoryView,
  PaymentFrequency,
  PaymentLedger,
  PaymentType,
} from "@/lib/types";

interface PaymentFormWizardProps {
  categories: CategoryView[];
  defaultCurrency: string;
  defaultLedger: PaymentLedger;
}

export function PaymentFormWizard({
  categories,
  defaultCurrency,
  defaultLedger,
}: PaymentFormWizardProps) {
  const t = useTranslations("payments");
  const tWizard = useTranslations("payments.wizard");
  const today = todayIsoDate();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(1);
  const [type, setType] = useState<PaymentType>("recurring");
  const [ledger, setLedger] = useState<PaymentLedger>(defaultLedger);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(defaultCurrency);
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState<PaymentFrequency>("monthly");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [useLastDayOfMonth, setUseLastDayOfMonth] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState("");
  const [paidInstallments, setPaidInstallments] = useState("0");
  const [nextDueDate, setNextDueDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [notes, setNotes] = useState("");

  const stepLabels = [tWizard("stepBasics"), tWizard("stepSchedule")];

  function validateStep1(): boolean {
    return name.trim().length > 0 && Number(amount) > 0;
  }

  function validateStep2(): boolean {
    switch (type) {
      case "recurring":
        return startDate.length > 0;
      case "installment":
        return Number(totalInstallments) > 0 && nextDueDate.length > 0;
      case "one_off":
        return dueDate.length > 0;
      default: {
        const _exhaustive: never = type;
        return _exhaustive;
      }
    }
  }

  function goNext() {
    if (!validateStep1()) return;
    setStep(2);
  }

  function goBack() {
    setStep(1);
  }

  function handleCreate() {
    if (step !== 2 || !validateStep2() || !formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    startTransition(async () => {
      try {
        await createPayment(formData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Please check the form and try again.",
        );
      }
    });
  }

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <FormStepIndicator step={step} total={2} labels={stepLabels} />

      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="ledger" value={ledger} />
      <input type="hidden" name="name" value={name} />
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
      <input type="hidden" name="isActive" value="true" />

      {step === 1 ? (
        <section className="space-y-5 rounded-2xl border border-border/60 bg-card p-5">
          <PaymentTypePicker value={type} onChange={setType} />
          <PaymentLedgerPicker value={ledger} onChange={setLedger} />

          <div className="space-y-2">
            <Label htmlFor="payment-name">{t("name")}</Label>
            <Input
              id="payment-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("namePlaceholder")}
              className="h-11 rounded-xl"
              required
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
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-5 rounded-2xl border border-border/60 bg-card p-5">
          {type === "recurring" ? (
            <>
              <FrequencyPicker value={frequency} onChange={setFrequency} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </>
          ) : null}

          {type === "installment" ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </>
          ) : null}

          {type === "one_off" ? (
            <DateField
              id="dueDate"
              label={t("dueDate")}
              value={dueDate}
              onChange={setDueDate}
              required
            />
          ) : null}

          <Input
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("notesPlaceholder")}
            className="h-11 rounded-xl"
          />
        </section>
      ) : null}

      <div className="flex gap-3">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="h-11 flex-1 rounded-xl"
          >
            {tWizard("back")}
          </Button>
        ) : null}
        {step === 1 ? (
          <Button
            type="button"
            onClick={goNext}
            className="h-11 flex-1 rounded-xl"
          >
            {tWizard("next")}
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!validateStep2() || isPending}
            onClick={handleCreate}
            className="h-11 flex-1 rounded-xl"
          >
            {t("addPayment")}
          </Button>
        )}
      </div>
    </form>
  );
}
