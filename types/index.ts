/**
 * Types métier partagés.
 * Calqués sur les entités qu'un CMS devra un jour exposer : le front pourra
 * changer de source de données sans réécriture des composants.
 */

import type { Locale } from "@/config/i18n";

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
  /** Contenu publiable de l'étude de cas, limité aux faits validés. */
  caseStudy: {
    context: string;
    approach: string;
    deliverables: string[];
    disclosure: string;
  };
  cover?: MediaAsset;
  /** Logo client reel, affiche en complement du cadre typographique. */
  logo?: MediaAsset;
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
  /**
   * Identifiant stable, utilisé par `reportsTo`. Il ne s'affiche jamais : il
   * ne sert qu'à relier deux entrées entre elles. Un nom ferait l'affaire
   * jusqu'au jour où deux personnes en partagent un.
   */
  id: string;
  /**
   * Le nom ne se traduit pas. Il est écrit une fois, dans sa graphie latine,
   * et sert tel quel dans les trois langues — y compris en arabe, où une
   * translittération inventée pour l'occasion serait un second nom que
   * personne ne porte.
   */
  name: string;
  /**
   * Les intitulés, UNE LISTE ET NON UNE CHAÎNE.
   *
   * Trois personnes en portent deux à la fois. Écrits « Chief Marketing
   * Officer / Chief Technology Officer » sur une seule ligne, les deux titres
   * se coupent n'importe où quand la carte rétrécit — souvent au milieu du
   * premier, ce qui donne à lire un titre qui n'existe pas. Une entrée par
   * titre laisse chacun sur sa ligne et se prête au balisage `Person` des
   * données structurées, qui attend lui aussi une liste.
   *
   * Le dictionnaire par langue reste : une page arabe qui présente son équipe
   * avec des intitulés français est une page à moitié traduite, et c'est celui
   * de l'équipe qu'on remarque en premier.
   */
  role: Record<Locale, string[]>;
  /**
   * Identifiant du responsable hiérarchique. Absent pour la tête de
   * l'organigramme — et une seule entrée doit l'être, sans quoi le schéma
   * n'a pas de racine unique.
   */
  reportsTo?: string;
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
