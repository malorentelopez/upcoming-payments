"use client";

import { useCallback } from "react";

import { usePrivacyMode } from "@/components/privacy/privacy-mode-provider";
import {
  formatDisplayCurrency,
  formatDisplayCurrencyAxis,
} from "@/lib/payments/formatters";

export function useFormatCurrency() {
  const { privacyEnabled, setPrivacyEnabled, togglePrivacy } = usePrivacyMode();

  const formatAmount = useCallback(
    (amount: number, currency = "USD", locale = "en-US") =>
      formatDisplayCurrency(amount, currency, locale, privacyEnabled),
    [privacyEnabled],
  );

  const formatAxisAmount = useCallback(
    (amount: number, currency = "USD", locale = "en-US") =>
      formatDisplayCurrencyAxis(amount, currency, locale, privacyEnabled),
    [privacyEnabled],
  );

  return {
    formatAmount,
    formatAxisAmount,
    privacyEnabled,
    setPrivacyEnabled,
    togglePrivacy,
  };
}
