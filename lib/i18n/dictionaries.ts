import { defaultLocale, type Locale } from "@/config/i18n";

/**
 * Chargement des dictionnaires.
 *
 * Les imports sont dynamiques : seule la langue demandée est incluse dans le
 * bundle servi. Les traductions vivent dans locales/, jamais dans les
 * composants — ceux-ci ne manipulent que des clés.
 */

export type Namespace = "common" | "home" | "services" | "pages" | "errors";

type Dictionary = Record<string, unknown>;

const loaders: Record<Locale, Record<Namespace, () => Promise<Dictionary>>> = {
  fr: {
    common: () => import("@/locales/fr/common.json").then((m) => m.default),
    home: () => import("@/locales/fr/home.json").then((m) => m.default),
    services: () => import("@/locales/fr/services.json").then((m) => m.default),
    pages: () => import("@/locales/fr/pages.json").then((m) => m.default),
    errors: () => import("@/locales/fr/errors.json").then((m) => m.default),
  },
  en: {
    common: () => import("@/locales/en/common.json").then((m) => m.default),
    home: () => import("@/locales/en/home.json").then((m) => m.default),
    services: () => import("@/locales/en/services.json").then((m) => m.default),
    pages: () => import("@/locales/en/pages.json").then((m) => m.default),
    errors: () => import("@/locales/en/errors.json").then((m) => m.default),
  },
  ar: {
    common: () => import("@/locales/ar/common.json").then((m) => m.default),
    home: () => import("@/locales/ar/home.json").then((m) => m.default),
    services: () => import("@/locales/ar/services.json").then((m) => m.default),
    pages: () => import("@/locales/ar/pages.json").then((m) => m.default),
    errors: () => import("@/locales/ar/errors.json").then((m) => m.default),
  },
};

/** Descend dans un objet imbriqué via une clé pointée : "nav.services". */
function lookup(dict: Dictionary, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Dictionary)[part]
          : undefined,
      dict,
    );
}

export type Translator = {
  (key: string): string;
  /** Récupère un tableau de chaînes (lignes de titre, listes). */
  list: (key: string) => string[];
  /**
   * Récupère un tableau d'entrées structurées — sections légales, valeurs,
   * formules. Le contenu de ces pages est une liste d'objets et non de
   * chaînes : le rédiger dans le dictionnaire plutôt que dans le composant
   * garde la traduction au même endroit que le reste.
   *
   * Le type de retour reste volontairement large ; chaque page décrit la
   * forme qu'elle attend et lit les champs qui l'intéressent.
   */
  entries: <T = Record<string, unknown>>(key: string) => T[];
};

/**
 * Traducteur pour une langue et un espace de noms.
 * Repli sur le français si la clé manque, avec avertissement en développement.
 * L'utilisateur ne voit jamais une clé brute, `undefined` ou `null`.
 */
export async function getTranslator(
  locale: Locale,
  namespace: Namespace,
): Promise<Translator> {
  const dict = await loaders[locale][namespace]();
  const fallback =
    locale === defaultLocale
      ? dict
      : await loaders[defaultLocale][namespace]();

  const resolve = (key: string): unknown => {
    const value = lookup(dict, key);
    if (value !== undefined) return value;

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `MISSING_TRANSLATION [${locale}/${namespace}] ${key} — repli sur ${defaultLocale}`,
      );
    }
    return lookup(fallback, key);
  };

  const t = ((key: string) => {
    const value = resolve(key);
    if (typeof value === "string") return value;
    if (process.env.NODE_ENV !== "production") {
      console.warn(`MISSING_TRANSLATION [${locale}/${namespace}] ${key}`);
    }
    return "";
  }) as Translator;

  t.list = (key: string) => {
    const value = resolve(key);
    return Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];
  };

  t.entries = <T,>(key: string): T[] => {
    const value = resolve(key);
    if (!Array.isArray(value)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `MISSING_TRANSLATION [${locale}/${namespace}] ${key} — tableau attendu`,
        );
      }
      return [];
    }
    return value.filter(
      (entry): entry is T => typeof entry === "object" && entry !== null,
    );
  };

  return t;
}
