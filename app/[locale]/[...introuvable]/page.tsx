import { notFound } from "next/navigation";

/**
 * FILET DES URL INCONNUES SOUS UNE LANGUE
 *
 * Sans cette route, /fr/nimportequoi ne correspondait à aucun segment de
 * app/[locale] : Next remontait alors jusqu'à la 404 racine, celle qui
 * s'adresse à un visiteur dont on ignore la langue et propose les trois
 * portes d'entrée. Un visiteur français déjà installé dans /fr se retrouvait
 * devant un écran trilingue, sans navigation ni pied de page.
 *
 * La route attrape tout ce qui n'a pas trouvé preneur à l'intérieur d'une
 * langue et déclenche la 404 localisée — dans la bonne langue, la bonne
 * direction de texte, et avec la navigation du site autour.
 *
 * Elle ne masque aucune page réelle : Next donne toujours la priorité au
 * segment le plus spécifique, et cette route est la moins spécifique de
 * toutes.
 */
export default function CatchAll(): never {
  notFound();
}
