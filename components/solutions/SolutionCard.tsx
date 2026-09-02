"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_BRAND } from "@/components/motion/gsap";
import { cn } from "@/lib/utils";

interface SolutionCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Carte de formule.
 *
 * TROIS CORRECTIONS DE COMPOSITION, avant toute animation :
 *
 * 1. L'appel à l'action est poussé en bas par `mt-auto`. Les trois formules
 *    n'énumèrent pas le même nombre de prestations ; avec une marge fixe, les
 *    trois boutons se retrouvaient à trois hauteurs différentes — sur la seule
 *    page du site dont le travail est justement de faire comparer. C'est le
 *    défaut le plus visible de la page, et il ne se voit qu'une fois les trois
 *    cartes côte à côte.
 *
 * 2. Chaque carte porte son rang. Tout le reste du site numérote ses séries
 *    éditoriales — sept services, six étapes, six principes — et les trois
 *    formules étaient les seules à ne pas le faire. Le rang dit aussi qu'il
 *    s'agit d'une progression (lancer, croître, produire), pas de trois
 *    options interchangeables.
 *
 * 3. Le rang et le nom partagent une ligne de base, ce qui donne à la carte un
 *    en-tête plutôt qu'une pile de blocs.
 *
 * L'ANIMATION AU SURVOL est une seule chronologie construite une fois et
 * rejouée dans les deux sens, jamais deux tweens concurrents : la carte monte
 * de 6 px, sa bordure prend la couleur de la marque, et l'image se rapproche
 * de 3 %. Un `reversed()` sur la sortie garantit que le retour emprunte
 * exactement le chemin de l'aller — deux tweens séparés se coupent la parole
 * quand on survole vite, et la carte reste alors coincée à mi-course.
 *
 * Seuls `transform` et des couleurs sont animés : aucune propriété de mise en
 * page, donc aucun recalcul pendant le survol.
 *
 * Le survol n'existe que sur pointeur fin. Au doigt, `:hover` reste collé
 * après le tap et la carte resterait soulevée sans raison.
 */
export function SolutionCard({ children, className }: SolutionCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const card = ref.current;
      if (!card || !contextSafe) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          fin: "(pointer: fine)",
          calme: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { fin, calme } = context.conditions as {
            fin: boolean;
            calme: boolean;
          };
          if (!fin || calme) return;

          const media = card.querySelector<HTMLElement>(".media-settle");

          const tl = gsap.timeline({ paused: true });
          tl.to(
            card,
            {
              y: -6,
              borderColor: "rgb(var(--atlas) / 0.45)",
              duration: 0.4,
              ease: EASE_BRAND,
            },
            0,
          );
          if (media) {
            tl.to(media, { scale: 1.03, duration: 0.6, ease: EASE_BRAND }, 0);
          }

          const enter = contextSafe(() => tl.play());
          const leave = contextSafe(() => tl.reverse());

          card.addEventListener("mouseenter", enter);
          card.addEventListener("mouseleave", leave);
          /*
           * Le clavier reçoit le même retour que la souris. `focusin` plutôt
           * que `focus` : le bouton se trouve à l'intérieur de la carte, et
           * `focus` ne remonte pas.
           */
          card.addEventListener("focusin", enter);
          card.addEventListener("focusout", leave);

          return () => {
            card.removeEventListener("mouseenter", enter);
            card.removeEventListener("mouseleave", leave);
            card.removeEventListener("focusin", enter);
            card.removeEventListener("focusout", leave);
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={cn(
        "card-sweep flex h-full min-w-0 flex-col rounded-lg border border-anthracite/[0.12] bg-canvas-raised p-8 md:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Pied de carte, plaqué en bas quelle que soit la longueur de la liste
 * au-dessus. Séparé du reste pour que la règle soit lisible au point d'appel :
 * `mt-auto` isolé dans une classe utilitaire au milieu d'une carte se perd.
 */
export function SolutionCardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto pt-10">{children}</div>;
}

/** En-tête : rang et nom sur une même ligne de base. */
export function SolutionCardHeader({
  index,
  name,
  tagline,
}: {
  index: string;
  name: string;
  tagline: string;
}) {
  return (
    <>
      <div className="flex min-w-0 items-baseline gap-4">
        <span className="text-caption text-anthracite/70">{index}</span>
        <h2 className="min-w-0 text-h4 text-ink [overflow-wrap:anywhere]">
          {name}
        </h2>
      </div>
      <p className="mt-3 text-body text-atlas">{tagline}</p>
    </>
  );
}
