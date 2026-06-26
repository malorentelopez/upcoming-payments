const DEFAULT_PATH = "/dashboard";

/**
 * Allow only same-origin relative paths for post-auth redirects.
 */
export function safeRedirectPath(next: string | null | undefined): string {
  if (!next) return DEFAULT_PATH;

  if (
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\") ||
    next.includes("@") ||
    next.includes(":")
  ) {
    return DEFAULT_PATH;
  }

  return next;
}
