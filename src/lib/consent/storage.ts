import {
  CONSENT_VERSION,
  type ConsentCategories,
  type ConsentRecord,
  DEFAULT_ACCEPTED,
  DEFAULT_REJECTED,
} from "./types";

const STORAGE_KEY = "ahead-cookie-consent";

export function getStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    categories: { ...categories, essential: true },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent("ahead:consent-change", { detail: record }));

  return record;
}

export function acceptAllConsent(): ConsentRecord {
  return saveConsent(DEFAULT_ACCEPTED);
}

export function rejectNonEssentialConsent(): ConsentRecord {
  return saveConsent(DEFAULT_REJECTED);
}

export function hasConsentDecision(): boolean {
  return getStoredConsent() !== null;
}

export function isAnalyticsAllowed(): boolean {
  return getStoredConsent()?.categories.analytics ?? false;
}

export function isFunctionalAllowed(): boolean {
  return getStoredConsent()?.categories.functional ?? false;
}
