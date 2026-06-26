export function isSentryEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN) && process.env.NODE_ENV === "production";
}

export function getSentryInitOptions() {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: isSentryEnabled(),
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
  };
}
