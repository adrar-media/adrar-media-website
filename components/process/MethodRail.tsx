"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

/**
 * Rail de progression de la frise « Comment nous travaillons ».
 *
 * IL NE PREND PAS LES ÉTAPES EN PROPRIÉTÉS, ET C'EST LE POINT.
 *
 * La frise porte du texte traduit, six photographies et six listes de
 * livrables. Faire passer tout cela dans un composant client obligerait à
 * sérialiser le contenu de la page vers le navigateur et à y réimporter le
 * cadre image, qui est un composant serveur. Le rail n'a besoin de rien de
 * tout ça : il lui suffit d'exister dans le flux et de mesurer son parent.
 * La page reste donc entièrement rendue sur le serveur, et le seul JavaScript
 * envoyé est celui de ces deux traits.
 *
 * `parentElement` comme déclencheur : le rail est posé en absolu dans la liste
 * qu'il accompagne, sa hauteur est donc exactement celle de la frise. Prendre
 * le rail lui-même comme déclencheur reviendrait au même à la première mesure,
 * mais il est mis à l'échelle pendant l'animation — ScrollTrigger recalculerait
 * alors sur un élément qui rétrécit.
 *
 * `scrub` lie le tracé à la position dans la page et non au temps : le trait
 * avance autant que le lecteur, s'arrête avec lui, recule s'il remonte. Une
 * ligne qui se dessine seule en une seconde raconte la frise avant qu'on l'ait
 * lue ; celle-ci accompagne la lecture.
 *
 * `prefers-reduced-motion` : rail plein d'emblée, aucun déclencheur créé.
 *
 * En arabe, la position est donnée en propriétés logiques (`start-*`) : le rail
 * passe à droite sans une ligne de JavaScript.
 */
export function MethodRail() {
  const line = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = line.current;
    const track = el?.parentElement;
    if (!el || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el, { scaleY: 1 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            /*
             * Le tracé s'achève quand la DERNIÈRE étape atteint le milieu de
             * l'écran, pas quand la frise en sort. Calé sur la sortie, le rail
             * resterait inachevé sous la sixième étape pendant toute sa
             * lecture — ce qui se lit comme un rail cassé, pas comme une
             * progression.
             */
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/*
        Deux traits superposés. La gorge est posée une fois pour toutes : sans
        elle, le rail n'existe pas tant qu'il n'est pas tracé et les médaillons
        des étapes suivantes flottent dans le vide.

        `start-[27px]` centre les deux sur un médaillon de 56 px, dont le rayon
        vaut 28 ; le trait fait 2 px, il se pose donc à 28 − 1. Même calcul à
        `md` pour un médaillon de 72 px : 36 − 1.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-[27px] w-0.5 rounded-pill bg-anthracite/10 md:start-[35px]"
      />
      <span
        ref={line}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-[27px] w-0.5 origin-top scale-y-0 rounded-pill bg-atlas md:start-[35px]"
      />
    </>
  );
}
