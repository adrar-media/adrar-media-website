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
    transition: { duration: 0.6, ease: easing },
  },
};

/**
 * Zone de déclenchement au scroll.
 *
 * Le déclenchement se fait dès que le haut de l'élément entre dans l'écran,
 * et non une fois qu'il y est enfoncé de 10 % : testé au navigateur, un
 * visiteur qui fait défiler vite arrivait sinon devant des blocs encore vides.
 * L'animation doit accompagner la lecture, jamais la faire attendre.
 */
export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * Dévoilement par masque : le contenu est découvert par un volet qui se
 * rétracte, plutôt que par un simple fondu. Plus lent, réservé aux moments
 * forts — ouverture de section, visuel de projet.
 */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: duration.slow, ease: easing },
  },
};

/** Léger zoom sortant, à associer à un masque. */
export const scaleOut: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: { duration: 1.1, ease: easing },
  },
};

/** Colonne qui monte légèrement plus vite que le scroll — profondeur discrète. */
export const parallaxRange = [-24, 24] as const;
