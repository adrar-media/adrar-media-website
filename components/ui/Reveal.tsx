"use client";

import { motion } from "framer-motion";
import { revealUp, stagger, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Cascade l'apparition des enfants directs au lieu du bloc entier. */
  staggerChildren?: boolean;
}

/**
 * Apparition au scroll. Ne déclenche qu'une fois : un élément qui rejoue son
 * animation à chaque passage devient fatigant à la lecture.
 * `prefers-reduced-motion` est neutralisé globalement via globals.css et
 * respecté ici par Framer Motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  staggerChildren = false,
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerChildren ? stagger(delay) : revealUp}
      transition={staggerChildren ? undefined : { delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/** Enfant d'un `Reveal staggerChildren`. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={revealUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}
