"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Moteur des animations liées au défilement.
 *
 * POURQUOI CE COMPOSANT EXISTE
 *
 * La dérive des images et la barre de progression de lecture étaient pilotées
 * par `animation-timeline: view()` et `scroll()`, la solution CSS pure. Elle
 * est élégante — aucun script, tout est composé — mais elle n'est
 * implémentée que dans Chrome et Edge : Safari ne la connaît pas et Firefox
 * la garde derrière un drapeau. Sur ces navigateurs, les deux effets ne
 * dégradaient pas, ils n'existaient tout simplement pas. La barre restait à
 * zéro, les images restaient plates, et rien ne le signalait.
 *
 * ScrollTrigger fait le même travail partout. Le coût est une bibliothèque à
 * charger ; le gain est que deux effets sur trois navigateurs cessent d'être
 * des lignes mortes.
 *
 * `scrub` avec une valeur numérique plutôt que `true` : la progression
 * rattrape le défilement en un tiers de seconde au lieu de le suivre au
 * pixel. C'est ce qui absorbe les à-coups d'une molette crantée, qui saute par
 * paliers — sans cela l'image avance par marches, et c'est précisément ce
 * qu'on cherche à éviter.
 *
 * Tout est monté dans un `gsap.matchMedia()` : sous mouvement réduit, rien
 * n'est créé du tout, et ce qui aurait été créé est défait automatiquement si
 * le réglage change en cours de visite.
 */
export function ScrollMotion() {
  const barRef = useRef<HTMLDivElement>(null);
  /*
   * Le composant vit dans la mise en page : il est monté une seule fois pour
   * toute la visite. Or la navigation d'une page à l'autre est faite côté
   * client — le document reste le même, seul son contenu est remplacé.
   *
   * Sans cette dépendance, les repères de défilement seraient calculés sur la
   * première page visitée et n'en bougeraient plus : les visuels de la page
   * suivante n'auraient aucune dérive, et la barre mesurerait une hauteur de
   * document qui n'existe plus. `revertOnUpdate` défait proprement l'ancien
   * jeu avant d'en créer un nouveau.
   */
  const pathname = usePathname();

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const bar = barRef.current;

      /*
       * Barre de progression. `start: 0` / `end: "max"` couvrent le document
       * entier plutôt qu'un élément déclencheur : c'est la lecture de la page
       * qu'elle mesure, pas la traversée d'une section.
       *
       * L'origine de la transformation reste en CSS, où elle sait déjà
       * s'inverser en arabe (globals.css).
       */
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
          },
        );
      }

      /*
       * Dérive des visuels. Chaque piste marquée `.parallax` traverse ±44 px
       * pendant sa traversée de l'écran.
       *
       * L'amplitude était de ±24 px, héritée de la version CSS. Sur un cadre
       * de 1200 px de large, 24 px de dérive répartis sur toute la hauteur de
       * l'écran ne se voient pas : la mesure au navigateur montrait une image
       * qu'on croyait fixe. Une parallaxe qu'on ne perçoit pas n'est pas une
       * parallaxe discrète, c'est du calcul pour rien. À ±44 px l'image se
       * décolle nettement de son cadre sans qu'on puisse pour autant surprendre
       * le mouvement en le fixant — le seuil est autour de 60 px, où la dérive
       * commence à se lire comme un défaut de calage.
       *
       * `ease: "none"` est obligatoire : la progression est déjà donnée par le
       * défilement, une courbe par-dessus désynchroniserait le mouvement de la
       * position réelle de la page.
       *
       * Le déclencheur est le cadre parent, pas la piste elle-même : la piste
       * déborde volontairement de 24 px en haut et en bas, et se prendre
       * soi-même pour repère décalerait le début et la fin d'autant.
       */
      /*
       * Aucune piste tant qu'aucun visuel n'est produit : les cadres en
       * attente n'ont pas d'image à faire dériver. La boucle ne tourne alors
       * simplement pas — ce n'est pas un cas d'erreur, c'est l'état normal du
       * site avant la production des images.
       */
      const tracks = gsap.utils.toArray<HTMLElement>(".parallax");
      for (const track of tracks) {
        gsap.fromTo(
          track,
          { y: 44 },
          {
            y: -44,
            ease: "none",
            scrollTrigger: {
              trigger: track.parentElement ?? track,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
            },
          },
        );
      }
    });

    return () => mm.revert();
  }, { dependencies: [pathname], revertOnUpdate: true });

  /*
   * La barre est rendue ici plutôt que dans la mise en page : l'élément et
   * l'animation qui le pilote vivent au même endroit, et il n'y a pas de
   * sélecteur à tenir synchronisé entre deux fichiers.
   *
   * Décorative — elle redit ce que la barre de défilement du navigateur
   * indique déjà, elle n'annonce rien de neuf aux technologies d'assistance.
   */
  return (
    <div
      ref={barRef}
      aria-hidden
      className="scroll-progress fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-atlas rtl:origin-right"
    />
  );
}
