import type { ServiceSlug } from "@/types";

/**
 * Les 7 services. Le libellé et la description viennent des dictionnaires :
 * ce fichier ne porte que la structure, l'ordre et les clés de traduction.
 */
export interface ServiceEntry {
  slug: ServiceSlug;
  index: string;
  /** Étiquette courte en anglais, identique dans les trois langues. */
  kicker: string;
  /** Clé dans common.json → services.* */
  nameKey: string;
  /** Clé dans home.json → services.items.* */
  descriptionKey: string;
}

export const services: ServiceEntry[] = [
  { slug: "strategie-marketing", index: "01", kicker: "Strategy", nameKey: "services.strategy", descriptionKey: "services.items.strategy" },
  { slug: "social-media", index: "02", kicker: "Social", nameKey: "services.social", descriptionKey: "services.items.social" },
  { slug: "creation-contenu", index: "03", kicker: "Content", nameKey: "services.content", descriptionKey: "services.items.content" },
  { slug: "branding", index: "04", kicker: "Brand", nameKey: "services.brand", descriptionKey: "services.items.brand" },
  { slug: "production-audiovisuelle", index: "05", kicker: "Production", nameKey: "services.production", descriptionKey: "services.items.production" },
  { slug: "publicite-digitale", index: "06", kicker: "Performance", nameKey: "services.performance", descriptionKey: "services.items.performance" },
  { slug: "web", index: "07", kicker: "Digital", nameKey: "services.web", descriptionKey: "services.items.web" },
];
