"use client";

import { motion } from "framer-motion";
import { clipReveal, scaleOut, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ProjectVisualProps {
  client: string;
  /** Étiquette affichée tant qu'aucun visuel validé n'est disponible. */
  pendingLabel: string;
  ratio: string;
  className?: string;
}

/**
 * Cadre visuel d'un projet.
 *
 * IMAGE_REQUIRED — aucun visuel client n'est disponible ni autorisé à ce jour.
 * Plutôt qu'une image d'illustration achetée ou inventée, le cadre affiche une
 * composition typographique construite à partir du nom du client. Le résultat
 * est assumé et cohérent avec la direction éditoriale : il ne ressemble pas à
 * une image manquante.
 *
 * Le remplacement par une vraie image ne touchera que ce composant.
 */
export function ProjectVisual({
  client,
  pendingLabel,
  ratio,
  className,
}: ProjectVisualProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={clipReveal}
      className={cn("relative overflow-hidden bg-deep", className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        variants={scaleOut}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          aria-hidden
          className="select-none px-6 text-center text-h1 uppercase leading-none text-white/10"
        >
          {client}
        </span>
      </motion.div>

      <span className="absolute bottom-4 start-4 text-caption uppercase text-white/40">
        {pendingLabel}
      </span>

      {/* Écho de la ligne d'horizon du logo, en filigrane. */}
      <svg
        aria-hidden
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-1/3 w-full"
      >
        <path
          d="M0 150 C 110 128, 290 128, 400 150"
          fill="none"
          stroke="#3ED598"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
      </svg>
    </motion.div>
  );
}
