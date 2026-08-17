"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { revealUp, stagger, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ServiceRow {
  index: string;
  kicker: string;
  name: string;
  description: string;
  href: string;
}

/**
 * Les services en rangées pleine largeur, pas en grille de cartes.
 *
 * Chaque service est une ligne typographique qui s'ouvre au survol : le nom
 * glisse, la description apparaît, le fond s'assombrit. Le regard descend une
 * liste au lieu de balayer une grille — c'est ce qui donne le registre
 * éditorial plutôt que l'effet catalogue.
 *
 * Au clavier, le focus produit exactement le même état que le survol : la
 * description n'est jamais réservée à la souris.
 */
export function ServiceRows({ rows }: { rows: ServiceRow[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger(0, 0.06)}
      className="border-t border-anthracite/15"
    >
      {rows.map((row) => {
        const isActive = active === row.index;
        return (
          <motion.li
            key={row.index}
            variants={revealUp}
            className="border-b border-anthracite/15"
          >
            <Link
              href={row.href}
              onMouseEnter={() => setActive(row.index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(row.index)}
              onBlur={() => setActive(null)}
              className={cn(
                "group grid grid-cols-12 items-baseline gap-4 py-7 transition-colors duration-fast ease-brand md:py-9",
                isActive && "bg-canvas-off",
              )}
            >
              <span className="col-span-2 text-caption uppercase text-anthracite/40 md:col-span-1">
                {row.index}
              </span>

              <span className="col-span-10 md:col-span-4">
                <span
                  className={cn(
                    "block text-h3 text-deep transition-transform duration-base ease-brand",
                    isActive && "md:translate-x-2 md:rtl:-translate-x-2",
                  )}
                >
                  {row.name}
                </span>
                <span className="mt-1 block text-caption uppercase text-atlas">
                  {row.kicker}
                </span>
              </span>

              <span
                className={cn(
                  "col-span-12 text-small text-anthracite/60 transition-opacity duration-base ease-brand md:col-span-6 md:opacity-0",
                  isActive && "md:opacity-100",
                )}
              >
                {row.description}
              </span>

              <span
                aria-hidden
                className={cn(
                  "col-span-12 hidden text-h3 text-atlas transition-all duration-base ease-brand md:col-span-1 md:block md:text-end md:opacity-0",
                  isActive && "md:opacity-100",
                )}
              >
                →
              </span>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
