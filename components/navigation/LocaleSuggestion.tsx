"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  isLocale,
  localeCookie,
  localeNames,
  type Locale,
} from "@/config/i18n";
import { localizePathname } from "@/lib/i18n/routing";
import { Button } from "@/components/buttons/Button";

const HINT_COOKIE = "adrar_locale_hint";

const readCookie = (name: string): string | null => {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const clearHint = () => {
  document.cookie = `${HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
};

interface LocaleSuggestionProps {
  current: Locale;
  /** Libellés déjà traduits dans la langue suggérée, pas dans la langue courante. */
  labels: Record<Locale, { detected: string; accept: string; dismiss: string }>;
}

/**
 * Suggestion de langue, discrète et non bloquante.
 *
 * N'apparaît qu'au premier accès, quand aucun choix n'a jamais été fait et que
 * le pays détecté recommanderait une autre langue. Ne masque aucun contenu, ne
 * s'impose jamais, et disparaît définitivement dès que l'utilisateur tranche —
 * dans un sens comme dans l'autre.
 */
export function LocaleSuggestion({ current, labels }: LocaleSuggestionProps) {
  const [suggested, setSuggested] = useState<Locale | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const hint = readCookie(HINT_COOKIE);
    if (hint && isLocale(hint) && hint !== current) setSuggested(hint);
  }, [current]);

  if (!suggested) return null;

  const copy = labels[suggested];

  const accept = () => {
    document.cookie = `${localeCookie.name}=${suggested}; path=/; max-age=${localeCookie.maxAgeSeconds}; samesite=lax`;
    clearHint();
    setSuggested(null);
    router.push(localizePathname(pathname, suggested));
  };

  const dismiss = () => {
    // Rester dans la langue courante est aussi un choix : on le mémorise.
    document.cookie = `${localeCookie.name}=${current}; path=/; max-age=${localeCookie.maxAgeSeconds}; samesite=lax`;
    clearHint();
    setSuggested(null);
  };

  return (
    <div
      role="region"
      aria-label={copy.detected}
      lang={suggested}
      dir={suggested === "ar" ? "rtl" : "ltr"}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-anthracite/10 bg-canvas-raised/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-container flex-wrap items-center gap-x-4 gap-y-3 px-gutter py-4">
        <p className="text-small text-anthracite/80">{copy.detected}</p>
        <div className="flex items-center gap-2">
          <Button variant="link" onClick={accept} className="text-small">
            {copy.accept}
          </Button>
          <span aria-hidden className="text-anthracite/30">
            ·
          </span>
          <button
            type="button"
            onClick={dismiss}
            className="text-small text-anthracite/70 underline underline-offset-4 transition-colors duration-fast hover:text-anthracite"
          >
            {copy.dismiss.replace("{language}", localeNames[current])}
          </button>
        </div>
      </div>
    </div>
  );
}
