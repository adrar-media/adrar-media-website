"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_ENTRANCE } from "@/components/motion/gsap";
import { whenPreloaderDone } from "@/components/motion/preloader-state";
import { FIELDS, type FieldVariant } from "@/components/decor/fields";

/**
 * Décor animé des en-têtes de page.
 *
 * TROIS MOUVEMENTS SUPERPOSÉS, ET ILS NE SE MARCHENT PAS DESSUS.
 *
 * 1. LE TRACÉ. Au lever du voile, chaque forme se dessine — `drawSVG` de
 *    « 50% 50% » vers « 0% 100% » : elle naît d'un point de son propre tracé
 *    et s'ouvre dans les deux sens, comme une onde. De « 0% » à « 100% » elle
 *    se déroulerait par un bout, ce qui sur une courbe fermée se lit comme un
 *    lasso qu'on lance.
 *
 * 2. LA DÉRIVE. Chaque couche monte et redescend de quelques pixels, sur des
 *    durées volontairement inégales (7 s, 9 s, 11 s). Des durées identiques
 *    feraient battre les couches à l'unisson et le décor deviendrait un seul
 *    bloc qui respire, ce qui est exactement l'effet mécanique qu'on cherche à
 *    éviter.
 *
 * 3. LA PARALLAXE AU CURSEUR. Les couches suivent la souris, chacune d'une
 *    amplitude différente (`depth`). C'est l'ÉCART entre elles qui fabrique la
 *    profondeur : à amplitudes égales, le dessin glisserait d'un bloc et ne
 *    donnerait rien de plus qu'un décalage.
 *
 * POURQUOI DEUX GROUPES IMBRIQUÉS PAR COUCHE. La dérive et la parallaxe
 * écrivent toutes deux une translation. Sur le même élément, la seconde
 * écraserait la première à chaque mouvement de souris et la dérive
 * s'arrêterait net dès qu'on bouge le curseur. Chaque couche est donc un
 * groupe de parallaxe contenant un groupe de dérive : deux transformations
 * distinctes, composées par le navigateur.
 *
 * `quickTo` plutôt qu'un `gsap.to` par événement : il réutilise une seule
 * instance de tween au lieu d'en créer une à chaque `pointermove`, soit
 * plusieurs centaines par seconde de déplacement. C'est la différence entre un
 * suivi fluide et un ramasse-miettes qui travaille en continu.
 *
 * LE SUIVI NE TOURNE QUE QUAND L'EN-TÊTE EST À L'ÉCRAN. Un `IntersectionObserver`
 * branche et débranche l'écouteur : une fois la page défilée, plus rien
 * n'écoute la souris. Sans cela, chaque page du site garderait un écouteur de
 * `pointermove` actif jusqu'en bas du pied de page, pour animer un dessin
 * sorti de l'écran depuis longtemps.
 *
 * CE QUI L'ÉTEINT :
 *
 * — `prefers-reduced-motion` : les formes sont entières et immobiles. Elles ne
 *   disparaissent pas — c'est un dessin, pas une animation, et il garde son
 *   sens à l'arrêt.
 * — En dessous de `md`, où le conteneur le masque : une classe cache un
 *   élément, elle ne suspend pas GSAP. Sans ce seuil, un téléphone ferait
 *   tourner trois dérives perpétuelles sur un dessin que personne ne voit.
 * — Absence de survol réel (`hover: hover` / `pointer: fine`) : sur un écran
 *   tactile il n'y a pas de curseur à suivre. Le tracé et la dérive restent,
 *   la parallaxe seule est retirée.
 */

interface HeaderFieldProps {
  variant: FieldVariant;
  /**
   * Teinte du dessin. Les formes héritent de `currentColor` : la page décide,
   * le dessin ne connaît aucune couleur.
   */
  className?: string;
}

/** Amplitude maximale du suivi, en unités de la grille 600 × 600. */
const REACH = 26;

export function HeaderField({ variant, className }: HeaderFieldProps) {
  const root = useRef<HTMLDivElement>(null);
  const layers = FIELDS[variant];

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const shapes = el.querySelectorAll<SVGElement>("[data-field-draw]");
      const parallax = el.querySelectorAll<SVGGElement>("[data-field-parallax]");
      const floaters = el.querySelectorAll<SVGGElement>("[data-field-float]");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(shapes, { drawSVG: "0% 100%" });
      });

      /* ------------------------------------------------------------------
       * Tracé + dérive — dès que la largeur rend le décor visible.
       * ------------------------------------------------------------------ */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const intro = gsap.timeline({ paused: true });
          intro.fromTo(
            shapes,
            { drawSVG: "50% 50%" },
            {
              drawSVG: "0% 100%",
              duration: 1.4,
              ease: EASE_ENTRANCE,
              stagger: 0.1,
            },
          );

          const drifts = Array.from(floaters).map((layer, index) =>
            gsap.to(layer, {
              y: index % 2 === 0 ? -14 : 10,
              duration: 7 + index * 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 1 + index * 0.4,
            }),
          );

          const unsubscribe = whenPreloaderDone(() => intro.play());

          return () => {
            unsubscribe();
            intro.kill();
            drifts.forEach((drift) => drift.kill());
          };
        },
      );

      /* ------------------------------------------------------------------
       * Suivi du curseur — seulement là où un curseur existe.
       * ------------------------------------------------------------------ */
      mm.add(
        "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const movers = Array.from(parallax).map((layer) => ({
            depth: Number(layer.dataset.depth ?? 1),
            x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3.out" }),
            y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3.out" }),
          }));

          const onMove = (event: PointerEvent) => {
            /*
             * Position du curseur ramenée à −1…1 sur la fenêtre, et non sur le
             * dessin : le décor est posé en bord de page et souvent coupé, un
             * repère pris sur sa propre boîte réagirait à contretemps de ce
             * que fait la main à l'écran.
             */
            const nx = (event.clientX / window.innerWidth) * 2 - 1;
            const ny = (event.clientY / window.innerHeight) * 2 - 1;
            for (const mover of movers) {
              mover.x(nx * REACH * mover.depth);
              mover.y(ny * REACH * mover.depth);
            }
          };

          const listen = (on: boolean) =>
            on
              ? window.addEventListener("pointermove", onMove, { passive: true })
              : window.removeEventListener("pointermove", onMove);

          let listening = false;
          const observer = new IntersectionObserver(
            ([entry]) => {
              const visible = Boolean(entry?.isIntersecting);
              if (visible === listening) return;
              listening = visible;
              listen(visible);
              /* Sorti de l'écran, le dessin revient à sa place au lieu de
                 rester figé sur le dernier geste. */
              if (!visible) {
                for (const mover of movers) {
                  mover.x(0);
                  mover.y(0);
                }
              }
            },
            { threshold: 0 },
          );
          observer.observe(el);

          return () => {
            observer.disconnect();
            if (listening) listen(false);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [variant] },
  );

  return (
    /*
      LE CADRE EST POSÉ ICI ET NON DANS LA PAGE : six pages l'utilisent, et six
      copies des mêmes classes de position auraient divergé à la première
      retouche. Le décor déborde volontairement par le bord — coupé par
      l'`overflow-hidden` de l'en-tête, il se lit comme un fragment aperçu, pas
      comme une vignette centrée derrière le texte.

      Masqué sous `md` : à cette largeur, la place disponible est celle du
      titre. Le dessin passerait derrière lui au lieu d'à côté, et un texte posé
      sur des traits est un texte moins lisible pour rien.
    */
    <div
      ref={root}
      className={[
        "absolute end-0 top-4 hidden aspect-square w-[38rem] md:block lg:w-[46rem]",
        "ltr:translate-x-1/3 rtl:-translate-x-1/3",
        className ?? "text-atlas",
      ].join(" ")}
    >
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 600 600"
        className="h-full w-full overflow-visible"
      >
        {layers.map((layer, index) => (
          <g
            key={index}
            data-field-parallax
            data-depth={layer.depth}
            /*
              `will-change` prépare une couche de composition pour les deux
              groupes qui bougent réellement. Sans lui, le navigateur promeut
              la couche au premier mouvement de souris — et ce premier
              mouvement saute.
            */
            style={{ willChange: "transform" }}
          >
            <g data-field-float style={{ willChange: "transform" }}>
              {layer.nodes}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
