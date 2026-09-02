"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Analytics } from "@/components/analytics/Analytics";
import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/analytics/consent";

export interface ConsentLabels {
  title: string;
  body: string;
  accept: string;
  refuse: string;
  learnMore: string;
}

/**
 * BANNIÈRE DE CONSENTEMENT
 *
 * Elle n'est montée que si au moins un outil de mesure est configuré : sans
 * script tiers, il n'y a rien à consentir, et une bannière posée là malgré
 * tout ne serait qu'un obstacle décoratif — le travers le plus répandu du web.
 *
 * Refuser est aussi accessible qu'accepter : même taille, même place, même
 * niveau de lecture. Un refus déguisé en lien secondaire n'est pas un choix
 * libre, et ne vaut pas consentement.
 *
 * La bannière ne recouvre pas le contenu et ne bloque pas la lecture. Tant
 * qu'aucune décision n'est prise, aucun script n'est chargé — l'absence de
 * réponse vaut refus, jamais l'inverse.
 */
export function ConsentManager({ labels, privacyHref }: {
  labels: ConsentLabels;
  privacyHref: string;
}) {
  /** `undefined` tant que le cookie n'a pas été lu : évite un affichage éclair. */
  const [consent, setConsent] = useState<ConsentValue | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (event: Event) =>
      setConsent((event as CustomEvent<ConsentValue>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const decide = (value: ConsentValue) => {
    writeConsent(value);
    setConsent(value);
  };

  return (
    <>
      {consent === "granted" && <Analytics />}

      {consent === null && (
        <div
          role="dialog"
          aria-label={labels.title}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-anthracite/10 bg-canvas-raised/[0.97] backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-container flex-col gap-5 px-gutter py-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-prose">
              <p className="text-small font-medium text-ink">{labels.title}</p>
              <p className="mt-1.5 text-small text-anthracite/70">
                {labels.body}{" "}
                <Link
                  href={privacyHref}
                  className="link-underline text-atlas transition-colors duration-fast hover:text-atlas-dark"
                >
                  {labels.learnMore}
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-pill border border-anthracite/20 px-6 py-3 text-button text-anthracite transition duration-base ease-brand hover:border-anthracite/40"
              >
                {labels.refuse}
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-pill bg-atlas px-6 py-3 text-button text-canvas transition duration-base ease-brand hover:bg-atlas-dark"
              >
                {labels.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
