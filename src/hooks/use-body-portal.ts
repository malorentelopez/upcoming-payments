"use client";

import { useLayoutEffect, useState } from "react";

/** Mount target for viewport-fixed UI portaled to document.body. */
export function useBodyPortal(): HTMLElement | null {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalTarget(document.body);
  }, []);

  return portalTarget;
}
