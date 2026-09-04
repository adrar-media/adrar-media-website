"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

/** Charge le voile uniquement après confirmation d'un viewport desktop. */
export function DesktopPreloader() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const Preloader = useMemo(
    () =>
      isDesktop === true
        ? dynamic(
            () =>
              import("./Preloader").then(
                ({ Preloader: Component }) => Component,
              ),
            { ssr: false, loading: () => null },
          )
        : null,
    [isDesktop],
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isDesktop === false) {
      void import("./preloader-state").then(({ markPreloaderDone }) => {
        markPreloaderDone();
      });
    }
  }, [isDesktop]);

  if (isDesktop !== true || !Preloader) return null;
  return <Preloader />;
}
