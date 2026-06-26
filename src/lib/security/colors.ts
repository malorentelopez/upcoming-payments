const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function sanitizeHexColor(
  color: string | null | undefined,
  fallback = "#64748b",
): string {
  if (color && HEX_COLOR.test(color)) {
    return color;
  }
  return fallback;
}
