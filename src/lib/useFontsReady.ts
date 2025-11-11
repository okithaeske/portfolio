"use client";

import { useEffect, useState } from "react";

/**
 * Waits until the browser reports that web fonts are fully loaded.
 * SplitText from GSAP measures glyph sizes on mount and throws warnings
 * when it runs before fonts finish loading, so we gate rendering on this flag.
 */
export function useFontsReady() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let active = true;
    const markReady = () => {
      if (active) setFontsReady(true);
    };

    const fontSet = document.fonts;

    if (!fontSet || fontSet.status === "loaded") {
      requestAnimationFrame(markReady);
      return () => {
        active = false;
      };
    }

    fontSet.ready.then(markReady).catch(markReady);
    fontSet.addEventListener?.("loadingdone", markReady);

    return () => {
      active = false;
      fontSet.removeEventListener?.("loadingdone", markReady);
    };
  }, []);

  return fontsReady;
}
