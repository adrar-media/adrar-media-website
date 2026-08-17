import type { Transition, Variants } from "framer-motion";

/**
 * Tokens de mouvement.
 * Une seule courbe d'accélération pour tout le site : c'est ce qui donne une
 * sensation cohérente. Les durées restent courtes — le mouvement souligne la
 * composition, il ne la met pas en scène.
 */
export const easing = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
} as const;

export const transition: Transition = {
  duration: duration.base,
  ease: easing,
};

/** Apparition au scroll : léger décalage vertical, jamais d'échelle ni de rotation. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

/** Conteneur pour cascader l'apparition d'une liste d'enfants. */
export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

/** Révélation de titre : chaque ligne monte depuis un masque overflow-hidden. */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: duration.slow, ease: easing },
  },
};

/** Réglage unique de la zone de déclenchement au scroll. */
export const viewport = { once: true, margin: "-10% 0px -10% 0px" } as const;
