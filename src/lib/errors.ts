export function toUserErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    console.error(error.message);
  }
  return fallback;
}
