import { describe, expect, it } from "vitest";

import { normalizePaymentName, resolveMerchant } from "./resolve";

describe("normalizePaymentName", () => {
  it("lowercases and strips punctuation", () => {
    expect(normalizePaymentName("NETFLIX - Premium!")).toBe("netflix");
  });

  it("removes subscription noise words", () => {
    expect(normalizePaymentName("Spotify Family Subscription")).toBe(
      "spotify",
    );
  });

  it("removes diacritics", () => {
    expect(normalizePaymentName("Suscripción Netflix")).toBe("netflix");
  });
});

describe("resolveMerchant", () => {
  it("matches exact merchant names", () => {
    expect(resolveMerchant("Netflix")?.slug).toBe("netflix");
    expect(resolveMerchant("Spotify")?.slug).toBe("spotify");
  });

  it("matches noisy payment labels", () => {
    expect(resolveMerchant("NETFLIX PREMIUM MONTHLY")?.slug).toBe("netflix");
    expect(resolveMerchant("Apple Music subscription")?.slug).toBe(
      "apple-music",
    );
    expect(resolveMerchant("YouTube Premium")?.slug).toBe("youtube");
  });

  it("prefers the longest alias match", () => {
    expect(resolveMerchant("Apple Music")?.slug).toBe("apple-music");
    expect(resolveMerchant("Apple TV+")?.slug).toBe("apple-tv");
    expect(resolveMerchant("GitHub Copilot")?.slug).toBe("github-copilot");
  });

  it("returns brand color and svg path", () => {
    const merchant = resolveMerchant("Netflix");
    expect(merchant?.color).toBe("#E50914");
    expect(merchant?.path.length).toBeGreaterThan(0);
  });

  it("returns null for unknown merchants", () => {
    expect(resolveMerchant("Landlord rent")).toBeNull();
    expect(resolveMerchant("Grocery store")).toBeNull();
  });

  it("does not match substrings inside unrelated words", () => {
    expect(resolveMerchant("Pineapple stand")).toBeNull();
  });
});
