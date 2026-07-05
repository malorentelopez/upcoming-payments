/** CSS variable written to documentElement for reliable mobile viewport height. */
export const APP_HEIGHT_CSS_VAR = "--app-height";

function readViewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function syncViewportHeight(): void {
  document.documentElement.style.setProperty(
    APP_HEIGHT_CSS_VAR,
    `${readViewportHeight()}px`,
  );
}

/** iOS often reports the wrong height for a frame or two after wake/resume. */
export function syncViewportHeightWithRetries(): void {
  syncViewportHeight();
  requestAnimationFrame(() => {
    syncViewportHeight();
    requestAnimationFrame(syncViewportHeight);
  });
}

export function bindViewportHeightSync(): () => void {
  const viewport = window.visualViewport;

  const onChange = () => {
    syncViewportHeightWithRetries();
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      onChange();
    }
  };

  window.addEventListener("resize", onChange);
  window.addEventListener("orientationchange", onChange);
  window.addEventListener("pageshow", onChange);
  document.addEventListener("visibilitychange", onVisibilityChange);
  viewport?.addEventListener("resize", onChange);
  viewport?.addEventListener("scroll", onChange);

  syncViewportHeightWithRetries();

  return () => {
    window.removeEventListener("resize", onChange);
    window.removeEventListener("orientationchange", onChange);
    window.removeEventListener("pageshow", onChange);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    viewport?.removeEventListener("resize", onChange);
    viewport?.removeEventListener("scroll", onChange);
  };
}
