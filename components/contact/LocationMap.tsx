"use client";

import { useState } from "react";

interface LocationMapProps {
  /** Requête envoyée à la carte : nom d'établissement ou adresse postale. */
  query: string;
  /** Libellé affiché du lieu. */
  label: string;
  /** Intitulés traduits. */
  labels: {
    /** Bouton d'affichage — porte l'avertissement tiers. */
    load: string;
    /** Mention sous le cadre en attente. */
    notice: string;
    /** Titre du cadre, pour les technologies d'assistance. */
    frameTitle: string;
    /** Lien vers la carte en pleine page. */
    openExternal: string;
  };
}

/**
 * Carte de localisation.
 *
 * ELLE NE SE CHARGE QU'APRÈS UN CLIC, ET C'EST LA SEULE CHOSE QUI COMPTE ICI.
 *
 * Un cadre Google Maps posé directement dans la page contacte les serveurs de
 * Google au premier rendu, pour TOUS les visiteurs : cookies déposés, adresse
 * IP transmise, empreinte de navigateur relevée — avant que quiconque ait
 * demandé à voir une carte, et sans qu'aucun consentement ne puisse être
 * recueilli, puisque la requête part avant l'affichage de la bannière. Sur un
 * site qui ne charge aucun script tiers sans accord explicite (voir
 * `lib/security/policy.ts` et la bannière de consentement), une carte chargée
 * d'office serait la seule fuite de la page, et elle serait invisible.
 *
 * Le cadre en attente porte donc l'avertissement, et le clic vaut accord pour
 * cette carte-là, sur cette page-là. Rien n'est mémorisé : revenir sur la page
 * redemande.
 *
 * LE LIEN DE SECOURS EXISTE POUR CEUX QUI NE CLIQUERONT PAS. Quelqu'un qui
 * refuse le cadre a toujours besoin de l'adresse : le lien ouvre la carte chez
 * Google, dans un onglet à lui, où c'est sa décision et non la nôtre.
 *
 * L'autorisation `frame-src` correspondante est déjà dans la politique de
 * sécurité — sans elle, le clic ne produirait qu'un cadre vide.
 */
export function LocationMap({ query, label, labels }: LocationMapProps) {
  const [shown, setShown] = useState(false);

  /*
   * `output=embed` est le seul point d'entrée de Google Maps qui accepte d'être
   * mis en cadre sans clé d'API. La requête est encodée : une adresse contient
   * des espaces et des virgules, qui casseraient l'URL telle quelle.
   */
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    query,
  )}&output=embed`;

  const externalHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;

  return (
    <figure className="m-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-canvas-gray">
        {shown ? (
          <iframe
            src={embedSrc}
            title={labels.frameTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
            {/*
              Écho de la ligne d'horizon du logo, comme les cadres d'image en
              attente : le bloc garde une présence graphique plutôt que de se
              lire comme une carte cassée.
            */}
            <svg
              aria-hidden
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
              className="absolute inset-x-0 bottom-0 h-1/2 w-full"
            >
              <path
                d="M0 150 C 110 128, 290 128, 400 150"
                fill="none"
                stroke="#1F7A63"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            </svg>

            <button
              type="button"
              onClick={() => setShown(true)}
              className="relative rounded-pill bg-atlas px-6 py-3.5 text-button text-canvas transition duration-base ease-brand hover:bg-atlas-dark hover:shadow-lifted active:scale-[0.97] active:duration-fast"
            >
              {labels.load}
            </button>

            <p className="relative max-w-xs text-caption text-anthracite/70">
              {labels.notice}
            </p>
          </div>
        )}
      </div>

      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="text-small text-anthracite/70">{label}</span>
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-small text-atlas transition-colors duration-fast hover:text-atlas-dark"
        >
          {labels.openExternal}
        </a>
      </figcaption>
    </figure>
  );
}
