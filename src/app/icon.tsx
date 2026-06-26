import { ImageResponse } from "next/og";

import { DM_SANS_FONT, loadDmSansSemibold } from "@/lib/brand/dm-sans-font";
import { aheadLetterMarkup } from "@/lib/brand/pwa-icon-markup";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default async function Icon() {
  const fontData = await loadDmSansSemibold();

  return new ImageResponse(aheadLetterMarkup(512), {
    ...size,
    fonts: [{ ...DM_SANS_FONT, data: fontData }],
  });
}
