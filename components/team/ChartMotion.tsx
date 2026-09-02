"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_BRAND,
  EASE_ENTRANCE,
  REVEAL_DURATION,
  REVEAL_START,
  STAGGER_STEP,
} from "@/components/motion/gsap";

/**
 * Mouvement de l'organigramme.
 *
 * IL N'EN CONNAÎT PAS LE CONTENU, ET C'EST TOUT L'INTÉRÊT.
 *
 * Le schéma porte les cartes de l'équipe, leurs intitulés traduits et, un jour,
 * leurs portraits. Faire passer tout cela dans un composant client obligerait à
 * sérialiser la section vers le navigateur et à y réimporter `next/image`.
 * Ici, le balisage arrive déjà rendu par le serveur en `children` ; ce
 * composant ne fait que le tenir et animer ce qu'il trouve dedans, repéré par
 * `data-chart-node` et `data-chart-line`. Le JavaScript envoyé est celui de ce
 * fichier, rien de plus.
 *
 * LES TRAITS SE TRACENT AVANT QUE LES CARTES N'ARRIVENT, et l'ordre n'est pas
 * décoratif : un organigramme se lit en suivant ses branches. Les traits
 * posent la structure, les cartes viennent la remplir. Dans l'autre sens, les
 * cartes apparaîtraient d'abord en désordre, puis des traits viendraient
 * expliquer après coup ce qu'on a déjà essayé de comprendre seul.
 *
 * `scaleY` pour les traits verticaux, `scaleX` pour les horizontaux : une
 * transformation, composée par le GPU, là où animer `height` ou `width`
 * relancerait la mise en page du schéma entier à chaque image.
 *
 * L'origine des traits horizontaux est `left center` et NON `start` : GSAP
 * écrit une transformation physique, et une barre qui se trace depuis la
 * gauche reste correcte en arabe — elle part simplement de l'autre extrémité
 * de la branche, ce qui ne se remarque pas sur un trait de 1 px de haut.
 *
 * UNE SEULE FOIS (`once: true`), au passage. Un schéma qui se redessine à
 * chaque remontée de molette attire l'œil sur son animation plutôt que sur son
 * contenu.
 *
 * `prefers-reduced-motion` : tout est en place d'emblée, aucun déclencheur
 * créé, aucune mesure faite.
 */
export function ChartMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;

    const nodes = el.querySelectorAll<HTMLElement>("[data-chart-node]");
    const vertical = el.querySelectorAll<HTMLElement>('[data-chart-line="v"]');
    const horizontal = el.querySelectorAll<HTMLElement>(
      '[data-chart-line="h"]',
    );

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([...nodes], { opacity: 1, y: 0 });
      gsap.set([...vertical, ...horizontal], { scaleX: 1, scaleY: 1 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
      });

      if (vertical.length > 0) {
        timeline.fromTo(
          vertical,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.5,
            ease: EASE_BRAND,
            stagger: { amount: 0.25 },
          },
        );
      }

      if (horizontal.length > 0) {
        timeline.fromTo(
          horizontal,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.5,
            ease: EASE_BRAND,
            stagger: { amount: 0.25 },
          },
          /*
             Les barres partent AVANT que les verticales n'aient fini : les
             deux familles décrivent la même structure, les séparer nettement
             la ferait apparaître en deux temps sans raison.
          */
          0.2,
        );
      }

      timeline.fromTo(
        nodes,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          ease: EASE_ENTRANCE,
          stagger: { amount: 0.35 },
        },
        STAGGER_STEP * 4,
      );
    });

    return () => mm.revert();
  }, []);

  /*
   * `data-chart-motion="out"` porte l'état de départ, décrit en CSS dans
   * globals.css plutôt qu'ici. C'est le même dispositif que `data-reveal="out"`
   * et il vaut pour la même raison : l'état masqué doit être présent dans le
   * HTML SERVI, sinon les cartes sont peintes en clair puis disparaissent au
   * montage du script — un clignotement à chaque chargement.
   *
   * Le même attribut porte les deux replis : la règle `<noscript>` de
   * `app/[locale]/layout.tsx`, qui rend tout visible si le script ne s'exécute
   * jamais, et la reprise sous `prefers-reduced-motion`.
   */
  return (
    <div ref={root} data-chart-motion="out">
      {children}
    </div>
  );
}
