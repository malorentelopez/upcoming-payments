const ONE_YEAR = 60 * 60 * 24 * 365;

export function appCookieOptions(maxAge = ONE_YEAR) {
  return {
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
