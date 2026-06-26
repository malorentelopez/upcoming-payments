import { AHEAD_ACCENT_COLOR } from "@/lib/brand/ahead-mark";

/**
 * Renders the wordmark "a" — DM Sans 600, -0.02em tracking, primary teal.
 * Matches `AheadWordmark` / ahead-wordmark-light.svg.
 */
export function aheadLetterMarkup(size: number) {
  const fontSize = Math.round(size * 0.68);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          fontFamily: "DM Sans",
          fontSize,
          fontWeight: 600,
          color: AHEAD_ACCENT_COLOR,
          letterSpacing: `${-0.02 * fontSize}px`,
          lineHeight: 1,
          textTransform: "lowercase",
          marginTop: Math.round(size * 0.03),
        }}
      >
        a
      </div>
    </div>
  );
}
