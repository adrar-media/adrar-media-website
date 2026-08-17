"use client";

import { useRef } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Décalage vertical proportionnel au scroll, pour donner de la profondeur à
 * une colonne ou un visuel. L'amplitude reste faible : au-delà, le parallaxe
 * devient un effet, et l'effet se voit avant le contenu.
 *
 * Neutralisé sous prefers-reduced-motion — la valeur reste alors figée à 0.
 */
export function useParallax(distance = 40) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smooth = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  const y: MotionValue<number> | number = reduced ? 0 : smooth;

  return { ref, y };
}
