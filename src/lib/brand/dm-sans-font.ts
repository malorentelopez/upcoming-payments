const DM_SANS_SEMIBOLD_URL =
  "https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAfJthTg.ttf";

let fontCache: ArrayBuffer | null = null;

export async function loadDmSansSemibold(): Promise<ArrayBuffer> {
  if (fontCache) {
    return fontCache;
  }

  const response = await fetch(DM_SANS_SEMIBOLD_URL, {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!response.ok) {
    throw new Error("Failed to load DM Sans SemiBold");
  }

  fontCache = await response.arrayBuffer();
  return fontCache;
}

export const DM_SANS_FONT = {
  name: "DM Sans",
  style: "normal" as const,
  weight: 600 as const,
};
