/**
 * Types métier partagés.
 * Calqués sur les entités qu'un CMS devra un jour exposer : le front pourra
 * changer de source de données sans réécriture des composants.
 */

export type ServiceSlug =
  | "strategie-marketing"
  | "social-media"
  | "creation-contenu"
  | "branding"
  | "production-audiovisuelle"
  | "publicite-digitale"
  | "web";

export interface Service {
  slug: ServiceSlug;
  /** Numéro d'affichage : "01" … "07". */
  index: string;
  /** Label court en anglais utilisé comme sur-titre éditorial. */
  kicker: string;
  title: string;
  shortDescription: string;
  /** Détail de la page service. Vide tant que le contenu n'est pas validé. */
  problem?: string;
  solution?: string;
  deliverables?: string[];
  benefits?: string[];
  faq?: { question: string; answer: string }[];
}

export type ProjectCategory =
  | "social-media"
  | "branding"
  | "video"
  | "publicite"
  | "web";

/** Une métrique n'existe que si elle est vérifiée. `source` documente la preuve. */
export interface Metric {
  value: string;
  label: string;
  /** Origine de la donnée (ex. "Meta Business Suite"). Obligatoire : pas de chiffre sans source. */
  source: string;
}

export interface Project {
  slug: string;
  client: string;
  industry: string;
  categories: ProjectCategory[];
  services: string[];
  summary: string;
  /** Résultat mis en avant sur la carte. Optionnel : absent si non vérifié. */
  headlineMetric?: Metric;
  cover?: MediaAsset;
  featured: boolean;
}

export interface CaseStudy extends Project {
  challenge?: string;
  objectives?: string[];
  strategy?: string;
  creative?: string;
  execution?: string;
  results?: Metric[];
  gallery?: MediaAsset[];
  testimonialId?: string;
}

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  photo?: MediaAsset;
  /** Un témoignage n'est publié qu'une fois validé par le client. */
  approved: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: MediaAsset;
}

export interface Statistic {
  value: number;
  /** Suffixe affiché après le compteur : "+", "K+", "%". */
  suffix?: string;
  label: string;
  source: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  cover?: MediaAsset;
}
