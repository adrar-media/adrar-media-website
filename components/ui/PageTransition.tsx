"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { duration, easing } from "@/lib/motion";

/**
 * Transition entre pages.
 *
 * Court fondu ascendant au montage de chaque route. Suffisant pour supprimer
 * la coupure sèche entre deux pages sans faire attendre l'utilisateur : la
 * navigation reste instantanée, seule la dernière fraction de seconde est
 * adoucie. Neutralisé sous prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.fast, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
