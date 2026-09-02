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

export interface TimelineItem {
  key: string;
  /** Libellés déjà traduits. Jamais des clés. */
  title: string;
  body: string;
}

interface PrincipleTimelineProps {
  items: TimelineItem[];
}

/**
 * Les principes, en frise verticale.
 *
 * POURQUOI UNE FRISE PLUTÔT QUE LA GRILLE DE SIX
 *
 * Les six principes étaient posés en trois colonnes décalées. La grille les
 * donnait comme un INVENTAIRE — six choses vraies, sans rapport entre elles,
 * qu'on lit dans n'importe quel ordre. Or ils décrivent un enchaînement :
 * comprendre le business, puis créer, puis mesurer, puis ancrer, puis réunir,
 * puis faire croître. Une frise dit cet ordre par sa forme, et le rail qui la
 * traverse dit qu'il n'y a qu'un seul chemin.
 *
 * LE RAIL SE TRACE AU DÉFILEMENT, ET C'EST LA SEULE ANIMATION LIÉE AU SCROLL.
 *
 * `scrub` le lie à la position dans la page plutôt qu'au temps : le trait
 * avance exactement autant que le lecteur, s'arrête quand il s'arrête, recule
 * s'il remonte. Une frise dont la ligne se dessine toute seule en 800 ms
 * raconte sa propre histoire pendant qu'on lit la première entrée ; celle-ci
 * accompagne la lecture au lieu de la précéder.
 *
 * Les cartes, elles, ne sont PAS liées au défilement — elles entrent une fois
 * et restent. Une carte dont l'opacité suit le scrub clignote à chaque
 * mouvement de molette, et son texte devient impossible à lire pendant qu'on
 * l'atteint. Le rail est un décor, il peut suivre le doigt ; le contenu, non.
 *
 * `prefers-reduced-motion` : rail plein, cartes en place, aucun déclencheur de
 * défilement créé.
 *
 * EN ARABE, le rail passe à droite : sa position est donnée en propriétés
 * logiques (`start-*`), et les pastilles suivent. La frise n'a rien à inverser
 * en JavaScript.
 */
export function PrincipleTimeline({ items }: PrincipleTimelineProps) {
  const root = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = root.current;
    const line = rail.current;
    if (!el || !line) return;

    const cards = el.querySelectorAll<HTMLElement>("[data-timeline-card]");
    const dots = el.querySelectorAll<HTMLElement>("[data-timeline-dot]");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(line, { scaleY: 1 });
      gsap.set([...cards, ...dots], { autoAlpha: 1, x: 0, scale: 1 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* 1. Le rail suit la lecture. */
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            /*
             * Le tracé commence quand la frise est franchement entrée et se
             * termine quand sa dernière entrée atteint le milieu de l'écran —
             * pas quand elle SORT. Calé sur la sortie, le rail resterait
             * inachevé sous la dernière carte pendant toute sa lecture, ce qui
             * se lit comme une frise cassée.
             */
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );

      /* 2. Les cartes entrent une fois, en cascade, depuis le bord du rail. */
      cards.forEach((card, index) => {
        const dot = dots[index];
        if (!dot) return;

        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: REVEAL_START, once: true },
          })
          .fromTo(
            card,
            { autoAlpha: 0, x: 24 },
            {
              autoAlpha: 1,
              x: 0,
              duration: REVEAL_DURATION,
              ease: EASE_BRAND,
            },
          )
          /*
           * La pastille arrive APRÈS le début de sa carte, pas avant : elle
           * marque le point atteint sur le rail, et un repère qui apparaît
           * devant ce qu'il repère n'a rien à désigner.
           */
          .fromTo(
            dot,
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, scale: 1, duration: 0.45, ease: EASE_ENTRANCE },
            STAGGER_STEP * 2,
          );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <ol ref={root} className="relative flex flex-col gap-12 md:gap-16">
      {/*
        LE RAIL. Deux traits superposés : la gorge, posée une fois pour toutes,
        et le trait actif qui se remplit par-dessus. Sans la gorge, le rail
        n'existe pas tant qu'il n'est pas tracé, et les pastilles des entrées
        suivantes flottent dans le vide.

        `start-[7px]` centre les deux sur la pastille de 16 px, dont le rayon
        vaut 8 : le trait fait 2 px, il faut donc le poser à 8 − 1.
      */}
      <span
        aria-hidden
        className="absolute inset-y-2 start-[7px] w-0.5 rounded-pill bg-anthracite/10 md:start-[9px]"
      />
      <span
        ref={rail}
        aria-hidden
        className="absolute inset-y-2 start-[7px] w-0.5 origin-top scale-y-0 rounded-pill bg-atlas md:start-[9px]"
      />

      {items.map((item, index) => (
        <li key={item.key} className="relative ps-10 md:ps-16">
          <span
            aria-hidden
            data-timeline-dot
            className="absolute start-0 top-1.5 block h-4 w-4 rounded-pill border-2 border-atlas bg-canvas opacity-0 md:h-5 md:w-5"
          />

          <div data-timeline-card className="opacity-0">
            <p className="text-caption text-anthracite/70">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-h3 text-ink">{item.title}</h3>
            <p className="mt-3 max-w-prose text-small text-anthracite/70">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
