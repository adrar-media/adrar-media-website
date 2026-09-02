"use client";

import Link from "next/link";
import { useState } from "react";
import { Stagger } from "@/components/motion/Stagger";
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
 * Chaque rangée est une ligne éditoriale : un titre large en casse normale,
 * une description sur deux lignes, et une flèche allongée à l'opposé. Le
 * regard descend une liste au lieu de balayer une grille — c'est ce qui
 * distingue le registre éditorial de l'effet catalogue.
 *
 * Au survol comme au focus clavier, la flèche s'étire et le titre avance :
 * l'état actif n'est jamais réservé à la souris.
 */
export function ServiceRows({ rows }: { rows: ServiceRow[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Stagger as="ul" className="border-t border-anthracite/[0.12]">
      {rows.map((row) => {
        const isActive = active === row.index;
        return (
          <li
            key={row.index}
            className="border-b border-anthracite/[0.12]"
          >
            <Link
              href={row.href}
              onMouseEnter={() => setActive(row.index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(row.index)}
              onBlur={() => setActive(null)}
              className="group flex flex-col gap-4 py-7 md:flex-row md:items-center md:gap-12 md:py-9"
            >
              <div className="flex-1">
                <h3 className="flex items-center gap-3 text-h3 text-ink">
                  <span
                    className={cn(
                      "transition-transform duration-base ease-brand",
                      isActive && "md:translate-x-2 md:rtl:-translate-x-2",
                    )}
                  >
                    {row.name}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "block h-2.5 w-2.5 shrink-0 animate-dot-pulse rounded-pill transition-colors duration-base ease-brand",
                      isActive ? "bg-atlas" : "bg-light",
                    )}
                  />
                </h3>
                <p className="mt-3 max-w-xl text-body-lg text-anthracite/70">
                  {row.description}
                </p>
              </div>

              {/* Flèche allongée : elle s'étire au lieu de simplement glisser. */}
              <span
                aria-hidden
                className="hidden items-center md:flex rtl:-scale-x-100"
              >
                <span
                  className={cn(
                    "block h-px bg-anthracite/40 transition-all duration-base ease-brand",
                    isActive ? "w-24 bg-atlas" : "w-14",
                  )}
                />
                <span
                  className={cn(
                    "-ms-2 text-h3 leading-none transition-colors duration-base ease-brand",
                    isActive ? "text-atlas" : "text-anthracite/70",
                  )}
                >
                  ›
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </Stagger>
  );
}
