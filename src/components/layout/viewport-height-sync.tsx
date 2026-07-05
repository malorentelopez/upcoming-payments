"use client";

import { useEffect } from "react";

import { bindViewportHeightSync } from "@/lib/viewport-height";

export function ViewportHeightSync() {
  useEffect(() => bindViewportHeightSync(), []);

  return null;
}
