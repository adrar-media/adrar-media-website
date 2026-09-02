"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Ce qui doit faire réagir le curseur. */
const INTERACTIVE =
  'a, button, [role="button"], label, summary, select, [tabindex]:not([tabindex="-1"])';

/**
 * Curseur personnalisé.
 *
 * DEUX ÉLÉMENTS, DEUX VITESSES. Un point qui colle à la souris, un anneau qui
 * la rattrape. C'est l'écart entre les deux qui fait la matière : le point
 * garde la précision — on vise toujours au pixel — et l'anneau donne le poids.
 *
 * POURQUOI GSAP ICI PLUTÔT QU'UNE BOUCLE ÉCRITE À LA MAIN
 *
 * La première version interpolait elle-même : `x += (cible - x) * 0.18` à
 * chaque image. Deux défauts, et le second se voyait.
 *
 * 1. Le pas était lié à la fréquence d'affichage. Sur un écran à 120 Hz la
 *    boucle tourne deux fois plus souvent, donc l'anneau rattrapait deux fois
 *    plus vite : le curseur n'avait pas le même comportement selon la machine.
 * 2. L'interpolation linéaire vers une cible n'a pas de courbe. Le mouvement
 *    démarre à sa vitesse maximale et s'éteint en exponentielle — d'où cette
 *    impression de traîne molle qui n'arrive jamais tout à fait.
 *
 * `gsap.quickTo()` est fait exactement pour ça : il réutilise un seul tween
 * par propriété au lieu d'en créer un par mouvement, la durée est exprimée en
 * secondes — donc identique à 60 comme à 144 Hz — et la course reçoit une
 * vraie courbe. Le point est réglé court (0,12 s) et l'anneau long (0,45 s) :
 * l'écart entre les deux durées est ce qui produit le décalage, et il ne
 * dépend plus du matériel.
 *
 * LE SURVOL N'EST PLUS MESURÉ À CHAQUE IMAGE
 *
 * La version précédente appelait `elementFromPoint` dans la boucle. Cette
 * fonction force le navigateur à recalculer la mise en page pour répondre ;
 * sur ce site, dont le premier écran porte une couche floutée de 80 px, la
 * mesure est assez coûteuse pour hacher le mouvement — soixante fois par
 * seconde, en permanence, y compris souris immobile.
 *
 * `mouseover` la remplace. L'événement ne se déclenche qu'au CHANGEMENT
 * d'élément survolé : le coût n'est plus proportionnel au temps mais au
 * nombre de franchissements, c'est-à-dire presque rien.
 *
 * CE QUI L'ÉTEINT : `gsap.matchMedia()` ne monte l'ensemble que sur pointeur
 * fin et hors mouvement réduit, et défait tout automatiquement si la
 * condition cesse d'être vraie — souris débranchée, réglage système modifié.
 * Le curseur natif revient alors entièrement, ce qui est le bon comportement :
 * mieux vaut aucun curseur personnalisé qu'un curseur personnalisé immobile.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

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

        const root = document.documentElement;
        root.dataset.cursor = "custom";

        /*
         * Le recentrage passe par `xPercent`/`yPercent` plutôt que par une
         * seconde translation écrite dans la feuille de style : GSAP compose
         * les deux dans une seule matrice de transformation. Un `transform`
         * posé en CSS serait écrasé par celui que GSAP écrit à chaque image.
         */
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

        // Un tween réutilisé par propriété, jamais un tween par mouvement.
        const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
        const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
        const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

        let visible = false;

        function onMove(event: MouseEvent) {
          if (!visible) {
            visible = true;
            gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
          }
          dotX(event.clientX);
          dotY(event.clientY);
          ringX(event.clientX);
          ringY(event.clientY);
        }

        /*
         * `mouseover` ne se déclenche qu'en entrant dans un nouvel élément :
         * c'est ce qui remplace la mesure par image. `closest` remonte au
         * premier ancêtre actionnable, donc un survol qui commence sur un
         * enfant décoratif — l'icône d'un bouton, le texte d'un lien — est
         * bien attribué à la cible réelle.
         */
        function onOver(event: MouseEvent) {
          const target = event.target as Element | null;
          const actif = Boolean(target?.closest(INTERACTIVE));

          /*
           * L'échelle, jamais la largeur. La version précédente animait
           * `width` et `height` du point : deux propriétés qui déclenchent un
           * recalcul de mise en page à chaque image d'une transition, sur un
           * élément posé en `fixed` au-dessus de toute la page.
           */
          gsap.to(ring, {
            scale: actif ? 1.55 : 1,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(dot, {
            scale: actif ? 0 : 1,
            duration: 0.25,
            ease: "power3.out",
            overwrite: "auto",
          });
          ring!.dataset.over = actif ? "true" : "false";
        }

        function onDown() {
          gsap.to(ring, { scale: 0.85, duration: 0.18, ease: "power2.out" });
          ring!.dataset.down = "true";
        }

        function onUp() {
          gsap.to(ring, {
            scale: ring!.dataset.over === "true" ? 1.55 : 1,
            duration: 0.3,
            ease: "power3.out",
          });
          ring!.dataset.down = "false";
        }

        /*
         * Sortie de la fenêtre : sans cela l'anneau reste posé sur le dernier
         * point connu d'une page que le visiteur a quittée.
         */
        function onLeave() {
          visible = false;
          gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
        }

        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseover", onOver, { passive: true });
        document.addEventListener("mouseleave", onLeave);
        window.addEventListener("mousedown", onDown, { passive: true });
        window.addEventListener("mouseup", onUp, { passive: true });

        return () => {
          window.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseover", onOver);
          document.removeEventListener("mouseleave", onLeave);
          window.removeEventListener("mousedown", onDown);
          window.removeEventListener("mouseup", onUp);
          delete root.dataset.cursor;
        };
      },
    );

    return () => mm.revert();
  }, []);

  /*
   * Les deux nœuds sont rendus dans tous les cas — deux `div` vides, sans
   * événements, invisibles tant qu'aucune souris n'a bougé. Les rendre
   * conditionnellement obligeait à attendre un second rendu avant de pouvoir
   * les câbler, ce qui laissait le curseur figé hors champ quand l'ordre
   * n'était pas respecté. La décision d'activer appartient à `matchMedia`,
   * pas au rendu.
   */
  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring" />
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  );
}
