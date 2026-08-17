/**
 * CONFIGURATION INTERNATIONALE
 *
 * Point unique de vérité pour les langues, le mapping pays → langue et les
 * segments d'URL localisés. Aucun composant ne doit contenir de logique de
 * langue en dur : tout se règle ici.
 */

export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Langues écrites de droite à gauche. */
export const rtlLocales: readonly Locale[] = ["ar"];
export const isRtl = (locale: Locale) => rtlLocales.includes(locale);

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

/** Libellé court affiché dans le sélecteur de langue. */
export const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
};

/** Code de langue complet, pour l'attribut lang et les métadonnées. */
export const localeTags: Record<Locale, string> = {
  fr: "fr-MA",
  en: "en",
  ar: "ar",
};

/**
 * Mapping pays → langue recommandée (codes ISO 3166-1 alpha-2).
 * Il s'agit d'une recommandation au premier accès, jamais d'une contrainte :
 * un choix explicite de l'utilisateur l'emporte toujours.
 */
export const countryLanguageMap: Record<string, Locale> = {
  // Francophonie et Maghreb
  MA: "fr",
  FR: "fr",
  BE: "fr",
  CA: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  TN: "fr",
  DZ: "fr",
  SN: "fr",
  CI: "fr",
  ML: "fr",
  // Monde arabophone
  AE: "ar",
  SA: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  EG: "ar",
  JO: "ar",
  LB: "ar",
  IQ: "ar",
  LY: "ar",
  SY: "ar",
  YE: "ar",
  PS: "ar",
  // Anglophonie
  GB: "en",
  US: "en",
  AU: "en",
  IE: "en",
  NZ: "en",
  ZA: "en",
  IN: "en",
  NG: "en",
};

/** Langue retenue pour tout pays absent du mapping. */
export const fallbackCountryLocale: Locale = "en";

/**
 * Segments d'URL localisés.
 * La clé est le segment canonique (celui des dossiers dans app/[locale]).
 * La valeur est le segment public par langue. Le middleware réécrit l'un
 * vers l'autre : /en/work est servi par app/[locale]/realisations.
 */
export const routeSegments = {
  services: { fr: "services", en: "services", ar: "khadamat" },
  realisations: { fr: "realisations", en: "work", ar: "aamal" },
  methode: { fr: "methode", en: "method", ar: "manhajiya" },
  "a-propos": { fr: "a-propos", en: "about", ar: "man-nahnu" },
  solutions: { fr: "solutions", en: "solutions", ar: "hulul" },
  contact: { fr: "contact", en: "contact", ar: "tawasul" },
  "demander-un-devis": {
    fr: "demander-un-devis",
    en: "request-a-quote",
    ar: "talab-ard-siar",
  },
  blog: { fr: "blog", en: "blog", ar: "mudawana" },
  "mentions-legales": {
    fr: "mentions-legales",
    en: "legal-notice",
    ar: "isharat-qanuniya",
  },
  "politique-confidentialite": {
    fr: "politique-confidentialite",
    en: "privacy-policy",
    ar: "siyasat-khsusiya",
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type CanonicalRoute = keyof typeof routeSegments;

/** Cookie mémorisant le choix explicite de l'utilisateur. */
export const localeCookie = {
  name: "adrar_locale",
  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
} as const;
