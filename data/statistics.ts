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
