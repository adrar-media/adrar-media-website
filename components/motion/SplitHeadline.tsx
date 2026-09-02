"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  SplitText,
  EASE_ENTRANCE,
  CHAR_STAGGER_AMOUNT,
} from "@/components/motion/gsap";
import { whenPreloaderDone } from "@/components/motion/preloader-state";
import { cn } from "@/lib/utils";

interface SplitHeadlineProps {
  /** Une entrée par ligne : la découpe reste un choix éditorial, pas automatique. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  /**
   * Joue à la levée de l'écran de chargement au lieu d'attendre le
   * défilement. Réservé au premier écran, déjà visible : l'accrocher à un
   * déclencheur de défilement le ferait partir immédiatement — c'est-à-dire
   * DERRIÈRE le voile, et le visiteur découvrirait un titre déjà posé.
   */
  immediate?: boolean;
  /** Retard au démarrage, en secondes. Sert à enchaîner sur l'écran de chargement. */
  delay?: number;
}

/**
 * Grand titre découpé, révélé caractère par caractère.
 *
 * C'EST LE MOUVEMENT SIGNATURE DU SITE. Les lettres montent depuis sous leur
 * ligne de base en pivotant autour de l'axe horizontal : pendant la montée,
 * chacune est encore inclinée, et comme elles ne partent pas toutes en même
 * temps, la ligne se lit une fraction de seconde comme une onde. Puis tout se
 * range. Un fondu simple aurait posé le titre ; la découpe le fait ARRIVER.
 *
 * TROIS CHOSES RENDENT L'EFFET LISIBLE PLUTÔT QUE TAPE-À-L'ŒIL :
 *
 * 1. Le masque. `mask: "lines"` enveloppe chaque ligne dans un conteneur à
 *    débord caché : les lettres montent depuis DERRIÈRE le bord du texte au
 *    lieu de traverser l'espace blanc au-dessus. Sans lui, on verrait des
 *    caractères flotter dans la marge, et le titre perdrait sa ligne.
 * 2. La cascade est répartie, pas multipliée (`amount`). Une accroche de huit
 *    mots met exactement le même temps à se poser qu'une accroche de trois —
 *    le rythme appartient au titre, pas à sa longueur.
 * 3. La perspective est courte (600 px) mais la rotation faible (-72°). Une
 *    rotation forte sous perspective longue donne un effet de générique de
 *    film ; l'inverse donne une matière qui se retourne.
 *
 * L'ARABE NE SE DÉCOUPE PAS EN CARACTÈRES.
 *
 * C'est le point qui compte le plus dans ce fichier. L'arabe est une écriture
 * liée : la forme d'une lettre dépend de ses voisines, et chaque lettre en a
 * jusqu'à quatre selon sa position dans le mot. Découper « التسويق » en sept
 * boîtes indépendantes casse toutes les liaisons — le mot ne s'affiche plus
 * en arabe, il s'affiche en lettres isolées, ce qui est au mieux illisible et
 * au pire une faute de langue affichée en corps 80.
 *
 * La découpe se fait donc PAR MOT sur les versions dirigées de droite à
 * gauche. Le mot est l'unité liée la plus petite qu'on puisse déplacer sans
 * rien casser, et la cascade se lit exactement pareil — elle porte simplement
 * sur des groupes plus larges. La direction, elle, n'a rien à inverser :
 * l'ordre du DOM suit déjà l'ordre de lecture.
 *
 * L'état masqué de départ est rendu par le serveur (`data-reveal="out"`), pour
 * la même raison que dans `Reveal` : posé après coup, il ferait disparaître un
 * titre déjà peint. Sans JavaScript, la règle `<noscript>` de globals.css le
 * rend visible ; sous mouvement réduit, il est posé net, sans découpe — le
 * texte n'est alors jamais touché par SplitText.
 */
export function SplitHeadline({
  lines,
  className,
  as: Tag = "h2",
  immediate = false,
  delay = 0,
}: SplitHeadlineProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Aucune découpe : le titre est posé tel quel, tout de suite.
        el.dataset.reveal = "in";
        gsap.set(el, { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /*
         * La direction est lue sur le document, pas passée en propriété : la
         * langue est une donnée de la page entière, et un titre n'a pas à se
         * la faire répéter par chacun de ses points d'appel.
         */
        const rtl = document.documentElement.dir === "rtl";

        /*
         * `autoSplit` redécoupe le titre au chargement des polices : `onSplit`
         * peut donc être rappelé plusieurs fois, et chaque passage réabonne au
         * signal du voile. La référence est gardée ici pour que le passage
         * suivant, comme le démontage, ferme l'abonnement précédent.
         */
        let unsubscribe: (() => void) | undefined;
        let observer: IntersectionObserver | undefined;
        let split: ReturnType<typeof SplitText.create> | undefined;

        const initialize = () => {
          if (split) return;

          split = SplitText.create(el, {
          type: rtl ? "lines,words" : "lines,chars",
          mask: "lines",
          /*
           * Redécoupe après le chargement des polices et à chaque
           * redimensionnement. Sans cela, la découpe est faite sur la police
           * de repli, puis la vraie police arrive et change la longueur des
           * lignes : les masques restent calés sur l'ancienne mise en page et
           * tranchent le texte.
           */
          autoSplit: true,
          onSplit: (self) => {
            const units = rtl ? self.words : self.chars;
            if (units.length === 0) return;

            el.dataset.reveal = "in";
            unsubscribe?.();

            const tween = gsap.from(units, {
              yPercent: 108,
              rotateX: -72,
              transformOrigin: "50% 100%",
              transformPerspective: 600,
              duration: 0.9,
              ease: EASE_ENTRANCE,
              delay,
              stagger: { amount: CHAR_STAGGER_AMOUNT },
              /*
               * Le titre du premier écran part en attente : il ne se découpe
               * qu'une fois le voile retiré. Les autres se déclenchent au
               * défilement, comme le reste de la page.
               */
              paused: immediate,
            });

            if (immediate) unsubscribe = whenPreloaderDone(() => tween.play());

            return tween;
          },
          });
        };

        if (immediate || !("IntersectionObserver" in window)) {
          initialize();
        } else {
          observer = new IntersectionObserver(
            (entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              observer?.disconnect();
              initialize();
            },
            { rootMargin: "0px 0px -10% 0px" },
          );
          observer.observe(el);
        }

        return () => {
          observer?.disconnect();
          unsubscribe?.();
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [immediate, delay], revertOnUpdate: true },
  );

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      data-reveal="out"
      className={cn("reveal split-headline", className)}
    >
      {/*
        `<bdi>` plutôt que `<span>` : sur la version arabe, la signature de
        marque reste en latin — « From Local / to Global. ». Dans un bloc
        dirigé de droite à gauche, l'algorithme bidirectionnel rattache le
        point final au contexte arabe et l'affiche à gauche du mot :
        « .to Global ». `<bdi>` isole chaque ligne, qui retrouve alors sa
        propre direction sans que le bloc cesse d'être aligné à droite.

        ET C'EST `rtl:text-right` QUI TIENT CETTE DERNIÈRE PROMESSE. `<bdi>`
        vaut `dir="auto"` : sur une ligne en caractères latins, il calcule sa
        direction propre et vaut donc `ltr`, y compris au milieu d'une page
        arabe. `text-align: start` — la valeur héritée — se résout alors sur
        SA direction à lui, pas sur celle de la page : le titre partait à
        GAUCHE pendant que le surtitre, l'accroche et les boutons restaient à
        droite, et le décrochage de la deuxième ligne (`ps-[14%]`, devenu une
        marge à droite en arabe) ne se voyait plus du tout. `text-right` est
        une valeur absolue, insensible à la direction du `<bdi>` : elle rend
        au bloc l'alignement de la page. Les titres déjà en arabe ne bougent
        pas — leur `start` valait déjà « droite ».
      */}
      {lines.map((line, i) => (
        <bdi key={i} className="block rtl:text-right">
          {line}
          {i < lines.length - 1 ? " " : null}
        </bdi>
      ))}
    </Tag>
  );
}
