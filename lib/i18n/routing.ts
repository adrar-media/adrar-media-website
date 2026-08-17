import {
  defaultLocale,
  isLocale,
  locales,
  routeSegments,
  type CanonicalRoute,
  type Locale,
} from "@/config/i18n";

/** Index inverse : segment public localisé → segment canonique. */
const publicToCanonical: Record<string, CanonicalRoute> = {};
for (const [canonical, byLocale] of Object.entries(routeSegments)) {
  for (const segment of Object.values(byLocale)) {
    publicToCanonical[segment] = canonical as CanonicalRoute;
  }
}

export const toCanonicalSegment = (segment: string): string =>
  publicToCanonical[segment] ?? segment;

export const toPublicSegment = (segment: string, locale: Locale): string => {
  const canonical = publicToCanonical[segment];
  return canonical ? routeSegments[canonical][locale] : segment;
};

/** Découpe "/fr/services/branding" en locale + segments. */
export function parsePathname(pathname: string): {
  locale: Locale | null;
  segments: string[];
} {
  const parts = pathname.split("/").filter(Boolean);
  const [first, ...rest] = parts;
  if (first && isLocale(first)) return { locale: first, segments: rest };
  return { locale: null, segments: parts };
}

/**
 * Traduit un chemin vers une autre langue en conservant la page courante.
 * /fr/realisations → /en/work → /ar/aamal
 */
export function localizePathname(pathname: string, target: Locale): string {
  const { segments } = parsePathname(pathname);
  const translated = segments.map((segment) =>
    toPublicSegment(toCanonicalSegment(segment), target),
  );
  return `/${[target, ...translated].join("/")}`;
}

/** Construit une URL localisée à partir d'une route canonique. */
export function href(
  locale: Locale,
  route?: CanonicalRoute,
  ...rest: string[]
): string {
  if (!route) return `/${locale}`;
  return `/${[locale, routeSegments[route][locale], ...rest].join("/")}`;
}

/** Toutes les variantes d'une page, pour les balises hreflang. */
export function alternateUrls(
  pathname: string,
  baseUrl: string,
): Record<string, string> {
  const entries = locales.map((locale) => [
    locale,
    `${baseUrl}${localizePathname(pathname, locale)}`,
  ]);
  return {
    ...Object.fromEntries(entries),
    "x-default": `${baseUrl}${localizePathname(pathname, defaultLocale)}`,
  };
}
