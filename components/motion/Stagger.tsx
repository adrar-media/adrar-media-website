"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_BRAND,
  REVEAL_DURATION,
  REVEAL_START,
  STAGGER_STEP,
  STAGGER_MAX,
} from "@/components/motion/gsap";
import { cn } from "@/lib/utils";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Balise du conteneur. Une liste doit rester une liste : un `<div>` glissé
   * entre un `<ul>` et ses `<li>` casse la sémantique, et avec elle
   * l'annonce du nombre d'entrées par les lecteurs d'écran.
   */
  as?: "div" | "ul" | "ol";
}

/**
 * Révélation en cascade d'une liste.
 *
 * Le conteneur observe son entrée dans l'écran ; ses enfants directs se
 * posent l'un après l'autre. Une section qui se révèle d'un bloc se lit comme
 * un chargement ; la même section dont les entrées se posent l'une après
 * l'autre se lit comme une composition. La différence tient à quelques
 * dizaines de millisecondes.
 *
 * LE RANG N'EST PLUS PASSÉ À LA MAIN.
 *
 * L'ancienne version demandait à chaque point d'appel d'écrire le rang de
 * l'enfant en style en ligne :
 *
 *     <div key={item.slug} style={{ "--i": index } as React.CSSProperties}>
 *
 * …que la feuille de style traduisait en `transition-delay`. Cela marchait,
 * mais le rythme d'une cascade est une propriété de la LISTE, pas de chacun de
 * ses éléments : six composants recopiaient la même incantation, et un enfant
 * qui oubliait `--i` se révélait sans retard, en silence.
 *
 * `stagger` est fait exactement pour cela : le conteneur connaît ses enfants,
 * il n'a besoin de rien de leur part. Les six styles en ligne ont donc été
 * retirés de leurs points d'appel.
 *
 * Le plafond de sept rangs est conservé, mais exprimé autrement. L'ancienne
 * règle bornait le rang (`min(var(--i), 7)`), ce qui faisait arriver ensemble
 * tous les éléments au-delà du septième. `amount` répartit un total fixe sur
 * l'ensemble : au-delà de sept entrées, la cascade se resserre au lieu de se
 * tronquer, et la dernière carte n'attend jamais plus de 0,42 s.
 *
 * Rien à inverser en arabe : le rang suit l'ordre du DOM, et une grille
 * dirigée de droite à gauche place déjà son premier enfant à droite. La
 * cascade épouse donc le sens de lecture sans règle dédiée.
 */
export function Stagger({ children, className, as: Tag = "div" }: StaggerProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.dataset.reveal = "in";
      gsap.set(items, { opacity: 1, y: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          ease: EASE_BRAND,
          stagger: {
            amount: Math.min(items.length * STAGGER_STEP, STAGGER_MAX),
          },
          scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
          /* L'attribut suit l'état réel — voir `Reveal` pour le détail. */
          onStart: () => {
            el.dataset.reveal = "in";
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      data-reveal="out"
      className={cn("reveal-stagger", className)}
    >
      {children}
    </Tag>
  );
}
