"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_BRAND,
  EASE_ENTRANCE,
  REVEAL_DURATION,
  SETTLE_DURATION,
  REVEAL_START,
} from "@/components/motion/gsap";
import { whenPreloaderDone } from "@/components/motion/preloader-state";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Décalage en ms — sert à révéler une liste en cascade plutôt qu'en bloc. */
  delay?: number;
  /**
   * Styles portés par le conteneur révélé. Les cadres d'images en ont besoin :
   * leurs proportions sont une valeur du manifeste, pas une classe utilitaire,
   * et un `<div>` intercalé pour les porter casserait la cascade de grille des
   * sections qui appliquent leurs colonnes sur ce même conteneur.
   */
  style?: React.CSSProperties;
  /**
   * Joue à la levée de l'écran de chargement plutôt qu'à l'entrée dans
   * l'écran. Réservé aux blocs du premier écran : ils sont déjà visibles, un
   * déclencheur de défilement les ferait donc partir tout de suite, derrière
   * le voile — et le visiteur découvrirait une composition déjà posée.
   */
  immediate?: boolean;
  /**
   * `media` révèle le bloc comme un cadre d'image : il s'ouvre par le bas au
   * lieu de monter en fondu. Voir plus bas.
   */
  variant?: "block" | "media";
}

/**
 * Révélation à l'entrée dans l'écran.
 *
 * Le contenu monte de quelques pixels en apparaissant, une seule fois : une
 * fois révélé il ne rejoue jamais, sinon la page clignote au défilement
 * inverse (`once: true`).
 *
 * DEUX RÉVÉLATIONS, PAS UNE
 *
 * Un bloc de texte et un cadre d'image ne se posent pas de la même façon, et
 * les traiter pareil est ce qui donnait au site son rythme un peu plat : tout
 * montait de 16 px en fondu, une image de 1200 px de large comme un bouton.
 *
 * — `block` : montée courte et fondu. C'est du contenu qui se pose. Il n'a
 *   pas de bord propre, donc rien à ouvrir — le fondu est le bon geste.
 * — `media` : le cadre S'OUVRE, du bas vers le haut (`clip-path`), pendant que
 *   l'image, elle, se détend d'un léger agrandissement. Le cadre ne bouge pas
 *   d'un pixel : il se découvre. Une image a un bord franc, et un bord franc
 *   qui glisse en fondu se lit comme une carte qui charge ; le même bord qui
 *   s'ouvre se lit comme une bande éditoriale.
 *
 * Les deux durées ne sont pas les mêmes non plus, et c'est délibéré : le cadre
 * s'ouvre en 0,7 s, l'image met 1,2 s à se poser. Elles démarrent ensemble et
 * finissent séparément — c'est ce décalage qui donne la profondeur. Deux
 * durées identiques donneraient un seul mouvement.
 *
 * L'état masqué de départ est rendu par le serveur (`data-reveal="out"` +
 * règle CSS) : ajouté après coup, il ferait disparaître un contenu déjà peint
 * avant de le ramener. GSAP écrit ensuite des styles en ligne, qui l'emportent.
 *
 * Garde-fous conservés : mouvement réduit — tout est posé à l'état final sans
 * animation ; JavaScript en échec — la règle `<noscript>` de globals.css rend
 * le contenu visible, qui de toute façon est présent dans le HTML servi.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  style,
  immediate = false,
  variant = "block",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      /*
       * La pose de l'image, si ce bloc en contient une. Cherchée ici plutôt
       * que déclarée par le composant image : c'est la révélation qui sait
       * quand elle commence, et l'image n'a pas à connaître son enveloppe.
       */
      const media = el.querySelector<HTMLElement>(".media-settle");
      const isMedia = variant === "media";

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Rien à attendre : l'état final, tout de suite.
        el.dataset.reveal = "in";
        gsap.set(el, { opacity: 1, y: 0, clipPath: "none" });
        if (media) gsap.set(media, { scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let unsubscribe: (() => void) | undefined;

        const tl = gsap.timeline({
          paused: immediate,
          ...(immediate
            ? {}
            : {
                scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
              }),
          /*
           * L'attribut suit l'état réel. Les styles en ligne de GSAP
           * l'emportent de toute façon sur la règle CSS d'état masqué, donc
           * rien ne dépend de ce basculement pour l'affichage — mais un
           * élément révélé qui continue d'annoncer `out` est un mensonge dans
           * le DOM, et c'est ce qu'on lit en premier quand on inspecte la page
           * pour comprendre pourquoi quelque chose ne s'affiche pas.
           */
          onStart: () => {
            el.dataset.reveal = "in";
          },
        });

        if (isMedia) {
          /*
           * Le cadre s'ouvre par le bas. `clip-path` ne déplace ni ne repeint
           * rien : la composition reste exactement où elle est, seule la part
           * visible grandit. C'est aussi ce qui permet à l'image de dériver
           * derrière le cadre sans jamais déborder.
           */
          tl.fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: REVEAL_DURATION,
              ease: EASE_ENTRANCE,
            },
            delay / 1000,
          );
        } else {
          tl.fromTo(
            el,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: REVEAL_DURATION,
              ease: EASE_BRAND,
            },
            delay / 1000,
          );
        }

        if (media) {
          tl.fromTo(
            media,
            { scale: 1.06 },
            { scale: 1, duration: SETTLE_DURATION, ease: EASE_ENTRANCE },
            delay / 1000,
          );
        }

        if (immediate) unsubscribe = whenPreloaderDone(() => tl.play());

        return () => unsubscribe?.();
      });

      return () => mm.revert();
    },
    { dependencies: [delay, immediate, variant], revertOnUpdate: true },
  );

  return (
    <div
      ref={ref}
      data-reveal="out"
      className={cn("reveal", variant === "media" && "reveal-media", className)}
      style={style}
    >
      {children}
    </div>
  );
}
