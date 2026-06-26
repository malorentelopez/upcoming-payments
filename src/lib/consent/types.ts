export const CONSENT_VERSION = "1.0";

export type ConsentCategories = {
  /** Required for login and security — always enabled. */
  essential: true;
  /** Stores preferences such as cookie consent itself. */
  functional: boolean;
  /** Analytics and performance measurement (none loaded today). */
  analytics: boolean;
};

export type ConsentRecord = {
  version: string;
  decidedAt: string;
  categories: ConsentCategories;
};

export const DEFAULT_REJECTED: ConsentCategories = {
  essential: true,
  functional: false,
  analytics: false,
};

export const DEFAULT_ACCEPTED: ConsentCategories = {
  essential: true,
  functional: true,
  analytics: true,
};

export function categoriesEqual(
  a: ConsentCategories,
  b: ConsentCategories,
): boolean {
  return a.functional === b.functional && a.analytics === b.analytics;
}
