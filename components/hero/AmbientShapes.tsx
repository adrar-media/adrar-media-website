"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, easing } from "@/lib/motion";

/**
 * Formes d'ambiance du Hero.
 *
 * Rectangles arrondis diffus, teintés du vert de la marque, posés en arrière
 * du titre. Ils installent la profondeur et la douceur du registre sans aucune
 * image : tout est peint par le navigateur, donc zéro octet téléchargé et
 * aucun décalage de mise en page au chargement.
 *
 * Purement décoratifs, donc masqués aux technologies d'assistance. Le
 * flottement s'arrête sous prefers-reduced-motion.
 */
const shapes = [
  { className: "start-[6%] top-[22%] h-40 w-64", delay: 0 },
  { className: "end-[12%] top-[14%] h-52 w-72", delay: 0.15 },
  { className: "start-[38%] bottom-[12%] h-44 w-60", delay: 0.3 },
];

export function AmbientShapes() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{
            duration: duration.slow,
            ease: easing,
            delay: shape.delay,
          }}
          className={`absolute rounded-xl ${shape.className}`}
        >
          <div className="ambient h-full w-full rounded-xl bg-light/25" />
          <div className="absolute inset-0 rounded-xl border border-white/60 bg-white/40" />
        </motion.div>
      ))}
    </div>
  );
}
