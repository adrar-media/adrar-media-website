"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_BRAND,
  EASE_ENTRANCE,
  REVEAL_START,
  STAGGER_STEP,
} from "@/components/motion/gsap";

export interface ChartMetric {
  key: string;
  /** Libellé déjà traduit. Jamais une clé. */
  label: string;
  value: number;
  suffix: string;
  /** Remplissage de la barre, de 0 à 1. Voir `data/statistics.ts`. */
  ratio: number;
  /** Source publiée, déjà mise en forme. Vide si la donnée est illustrative. */
  source: string;
}

interface ResultsChartProps {
  metrics: ChartMetric[];
}

/**
 * Graphique des résultats — barres qui se remplissent, valeurs qui montent.
 *
 * POURQUOI UN COMPTEUR ANIMÉ ICI, ALORS QUE `Counter` REFUSE DE L'ÊTRE
 *
 * `components/statistics/Counter.tsx` affiche ses chiffres tels quels, et la
 * raison tenait : un nombre isolé posé dans une phrase est une information, et
 * la faire attendre ne l'améliore pas. Ici le nombre n'est pas isolé — il
 * légende une barre. La barre se remplit forcément dans le temps, c'est ce qui
 * en fait une barre plutôt qu'un rectangle ; un chiffre figé à côté d'une
 * longueur qui bouge donne deux objets qui parlent de la même mesure et ne
 * s'accordent pas. Le compte n'est donc pas un effet ajouté au nombre, c'est
 * la barre lue à voix haute.
 *
 * L'OBJECTION D'ACCESSIBILITÉ DE `Counter` RESTE VALIDE, ET ELLE EST TRAITÉE.
 *
 * Un nombre qui change trente fois par seconde est illisible pour une
 * technologie d'assistance : la valeur est réannoncée à chaque image, ou lue au
 * milieu de sa course. Les chiffres animés portent donc `aria-hidden`, et la
 * valeur finale est présente à côté dans un élément réservé aux lecteurs
 * d'écran. Ce qui est restitué est stable et exact dès le premier instant ;
 * seule la peinture bouge.
 *
 * TROIS TEMPS, ET LEUR ORDRE PORTE LE SENS
 *
 * 1. La ligne de base se trace d'un bord à l'autre. Un graphique commence par
 *    son axe : sans lui, les barres flottent.
 * 2. Chaque barre se remplit depuis le bord de départ, en cascade. Le
 *    remplissage part de `scaleX: 0` avec `transform-origin` au départ — pas
 *    d'une largeur animée, qui ferait recalculer la mise en page à chaque
 *    image pour le même résultat à l'écran.
 * 3. La valeur monte pendant que sa barre se remplit, et se fige avec elle.
 *
 * `prefers-reduced-motion` : tout est peint à l'état final, sans compte ni
 * remplissage. Un graphique est une image, pas une animation — sa version
 * réduite est simplement l'image.
 *
 * EN ARABE, le remplissage part du bord droit : `transform-origin` est posé
 * par la classe logique `origin-left rtl:origin-right`, et la ligne de base est
 * symétrique. Rien d'autre à inverser.
 */
export function ResultsChart({ metrics }: ResultsChartProps) {
  const root = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;

    const bars = el.querySelectorAll<HTMLElement>("[data-chart-bar]");
    const numbers = el.querySelectorAll<HTMLElement>("[data-chart-value]");
    const axes = el.querySelectorAll<HTMLElement>("[data-chart-axis]");
    if (bars.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([...axes, ...bars], { scaleX: 1 });
      numbers.forEach((node) => {
        node.textContent = node.dataset.chartValue ?? node.textContent;
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
      });

      timeline
        .fromTo(
          axes,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: EASE_BRAND, stagger: STAGGER_STEP },
        )
        .fromTo(
          bars,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: EASE_ENTRANCE,
            stagger: STAGGER_STEP * 2,
          },
          0.18,
        );

      /*
       * Le compte est monté SUR LA MÊME LIGNE DE TEMPS que sa barre, au même
       * décalage : deux animations lancées séparément dérivent l'une de
       * l'autre dès qu'une image est sautée, et le chiffre finit avant ou
       * après la longueur qu'il légende.
       */
      numbers.forEach((node, index) => {
        const target = Number(node.dataset.chartTarget ?? 0);
        const suffix = node.dataset.chartSuffix ?? "";
        const counter = { value: 0 };

        timeline.to(
          counter,
          {
            value: target,
            duration: 1.1,
            ease: EASE_ENTRANCE,
            onUpdate: () => {
              node.textContent = `${Math.round(counter.value)}${suffix}`;
            },
          },
          0.18 + index * STAGGER_STEP * 2,
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <ul ref={root} className="flex flex-col gap-9">
      {metrics.map((metric) => (
        <li key={metric.key}>
          <div className="flex items-baseline justify-between gap-6">
            <p className="text-body-lg text-anthracite/75">{metric.label}</p>

            <p className="text-h3 leading-none text-ink">
              {/*
                Les chiffres qui défilent sont retirés de la restitution ; la
                valeur exacte vit dans l'élément voisin, lisible dès le premier
                instant et jamais réannoncée.
              */}
              <bdi
                aria-hidden
                data-chart-value
                data-chart-target={metric.value}
                data-chart-suffix={metric.suffix}
                className="tabular-nums"
              >
                0{metric.suffix}
              </bdi>
              <span className="sr-only">
                {metric.value}
                {metric.suffix}
              </span>
            </p>
          </div>

          {/* Piste : la ligne de base du graphique, sur toute la largeur. */}
          <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-pill">
            <span
              aria-hidden
              data-chart-axis
              className="absolute inset-0 origin-left scale-x-0 rounded-pill bg-anthracite/10 rtl:origin-right"
            />
            <span
              aria-hidden
              data-chart-bar
              style={{ width: `${Math.round(metric.ratio * 100)}%` }}
              className="absolute inset-y-0 start-0 origin-left scale-x-0 rounded-pill bg-atlas rtl:origin-right"
            />
          </div>

          {metric.source && (
            <p className="mt-3 text-caption text-anthracite/70">
              {metric.source}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
