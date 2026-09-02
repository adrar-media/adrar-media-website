import type { Statistic } from "@/types";

/**
 * Statistiques de preuve sociale.
 *
 * CONTENT_REQUIRED — aucun de ces chiffres n'a été fourni ni vérifié :
 * clients accompagnés, projets réalisés, contenus produits, vues générées.
 * Tant que ce tableau est vide, la section correspondante ne s'affiche pas.
 * Ne jamais y placer une estimation : un chiffre non sourcé est un mensonge
 * commercial, et il sera repris par des prospects.
 */
export const statistics: Statistic[] = [];

/**
 * Résultats vérifiés, mesurés sur des projets réels.
 * Chaque entrée doit porter sa source.
 */
export const verifiedResults: Statistic[] = [
  {
    value: 516,
    suffix: "K+",
    label: "results.bricodiViews",
    source: "Bricodi Pro — Meta, phase de lancement",
  },
];

/* -------------------------------------------------------------------------- */
/* Série graphique de la section Résultats                                    */
/* -------------------------------------------------------------------------- */

export interface ResultMetric {
  /** Clé de libellé : `results.series.<key>` dans home.json. */
  key: string;
  value: number;
  /** Suffixe affiché après la valeur : "K+", "%", "x". */
  suffix?: string;
  /**
   * Remplissage de la barre, de 0 à 1.
   *
   * DONNÉ EXPLICITEMENT, JAMAIS DÉDUIT DE `value`. Les métriques d'une même
   * série n'ont pas la même échelle — 516 000 vues et 38 % d'engagement ne se
   * comparent pas — et normaliser sur la plus grande écraserait toutes les
   * autres à un trait de deux pixels. Chaque barre dit donc sa propre
   * proportion : part d'un objectif, d'un maximum théorique, d'un référentiel
   * de secteur. C'est au chiffre de porter son échelle, pas au graphique.
   */
  ratio: number;
  /** Source publiée. Chaîne vide = donnée de démonstration. */
  source: string;
}

/**
 * La série ne reprend que des résultats vérifiés. Le graphique reste en place
 * et représente la même preuve sous une forme visuelle, sans introduire de
 * métrique de démonstration.
 */
export const resultSeriesIsPlaceholder = false;

export const resultSeries: ResultMetric[] = [
  {
    key: "bricodiViews",
    value: 516,
    suffix: "K+",
    ratio: 1,
    source: "Bricodi Pro — Meta, phase de lancement",
  },
];
