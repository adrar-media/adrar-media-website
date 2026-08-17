"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, easing } from "@/lib/motion";

/**
 * Signature graphique du Hero.
 *
 * Reprend la géométrie du logo — l'arc au-dessus du massif et la ligne
 * d'horizon — réduite à deux traits. C'est un élément propriétaire : il ne
 * ressemble à aucune texture d'agence générique, et il ne coûte rien puisqu'il
 * est tracé en SVG plutôt que chargé en image.
 *
 * Purement décoratif, donc masqué aux technologies d'assistance.
 */
export function HeroMark() {
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Arc — écho de l'arche du logo. */}
      <motion.circle
        cx="400"
        cy="330"
        r="230"
        fill="none"
        stroke="#1F7A63"
        strokeWidth="1"
        strokeOpacity="0.18"
        initial={reduced ? false : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.6, ease: easing, delay: 0.2 }}
      />
      {/* Ligne d'horizon. */}
      <motion.path
        d="M0 448 C 220 424, 580 424, 800 448"
        fill="none"
        stroke="#1F7A63"
        strokeWidth="1"
        strokeOpacity="0.25"
        initial={reduced ? false : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={{ duration: duration.slow, ease: easing, delay: 0.5 }}
      />
    </svg>
  );
}
