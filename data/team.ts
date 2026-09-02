import type { TeamMember } from "@/types";

/**
 * Équipe confirmée par la direction le 28 août 2026.
 *
 * `reportsTo` alimente l'organigramme de la page À propos. Nabil et Zineb sont
 * directement rattachés à Yassine afin que le schéma reste exact après le
 * retrait des anciens profils. Les initiales remplacent proprement les photos
 * tant que les portraits officiels ne sont pas disponibles.
 */

/** Titres de direction : identiques dans les trois langues (voir en-tête). */
const sameInAllLocales = (titles: string[]) => ({
  fr: titles,
  en: titles,
  ar: titles,
});

export const team: TeamMember[] = [
  {
    id: "yassine",
    name: "Yassine Kanoun Alaoui",
    role: sameInAllLocales([
      "Chief Executive Officer",
      "Chief Communication Officer",
    ]),
  },
  {
    id: "nabil",
    name: "Nabil Kassmi",
    reportsTo: "yassine",
    role: {
      fr: ["Community management"],
      en: ["Community management"],
      ar: ["إدارة المجتمع الرقمي"],
    },
  },
  {
    id: "zineb",
    name: "Zineb Bsara",
    reportsTo: "yassine",
    role: {
      fr: ["Graphisme"],
      en: ["Graphic design"],
      ar: ["تصميم جرافيك"],
    },
  },
];
