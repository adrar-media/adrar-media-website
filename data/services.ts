import type { ServiceSlug } from "@/types";

/**
 * Les 7 services. Le libellé et la description viennent des dictionnaires :
 * ce fichier ne porte que la structure, l'ordre et les clés de traduction.
 */
export interface ServiceEntry {
  slug: ServiceSlug;
  /** Clé courte partagée par les dictionnaires (common, home, services). */
  key: string;
  index: string;
  /** Étiquette courte en anglais, identique dans les trois langues. */
  kicker: string;
  /** Clé dans common.json → services.* */
  nameKey: string;
  /** Clé dans home.json → services.items.* */
  descriptionKey: string;
}

export const services: ServiceEntry[] = [
  { slug: "strategie-marketing", key: "strategy", index: "01", kicker: "Strategy", nameKey: "services.strategy", descriptionKey: "services.items.strategy" },
  { slug: "social-media", key: "social", index: "02", kicker: "Social", nameKey: "services.social", descriptionKey: "services.items.social" },
  { slug: "creation-contenu", key: "content", index: "03", kicker: "Content", nameKey: "services.content", descriptionKey: "services.items.content" },
  { slug: "branding", key: "brand", index: "04", kicker: "Brand", nameKey: "services.brand", descriptionKey: "services.items.brand" },
  { slug: "production-audiovisuelle", key: "production", index: "05", kicker: "Production", nameKey: "services.production", descriptionKey: "services.items.production" },
  { slug: "publicite-digitale", key: "performance", index: "06", kicker: "Performance", nameKey: "services.performance", descriptionKey: "services.items.performance" },
  { slug: "web", key: "web", index: "07", kicker: "Digital", nameKey: "services.web", descriptionKey: "services.items.web" },
];
