import { ImageResponse } from "next/og";

import { DM_SANS_FONT, loadDmSansSemibold } from "@/lib/brand/dm-sans-font";
import { aheadLetterMarkup } from "@/lib/brand/pwa-icon-markup";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await loadDmSansSemibold();

  return new ImageResponse(aheadLetterMarkup(180), {
    ...size,
    fonts: [{ ...DM_SANS_FONT, data: fontData }],
  });
}
