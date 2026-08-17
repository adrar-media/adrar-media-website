"use client";

import { motion } from "framer-motion";
import { lineReveal, stagger, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  /** Une entrée par ligne : la découpe reste un choix éditorial, pas automatique. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

/**
 * Révélation ligne à ligne des grands titres.
 * Le texte complet reste dans le DOM en une seule balise sémantique : les
 * lecteurs d'écran et les moteurs lisent le titre normalement, quel que soit
 * l'état de l'animation.
 */
export function TextReveal({
  lines,
  className,
  as: Tag = "h2",
}: TextRevealProps) {
  return (
    <Tag className={cn(className)}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger(0, 0.09)}
        className="block"
      >
        {lines.map((line, i) => (
          <span key={i} className="line-mask">
            <motion.span variants={lineReveal} className="block">
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
