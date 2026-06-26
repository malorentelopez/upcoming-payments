const PRIVACY_STORAGE_KEY = "ahead-privacy-mode";

export function getStoredPrivacyMode(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(PRIVACY_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setStoredPrivacyMode(enabled: boolean): void {
  try {
    window.localStorage.setItem(PRIVACY_STORAGE_KEY, enabled ? "1" : "0");
    window.dispatchEvent(
      new CustomEvent("ahead:privacy-change", { detail: enabled }),
    );
  } catch {
    // Ignore storage failures (private browsing, etc.)
  }
}
