import type { Metadata } from "next";
import {
  defaultLocale,
  locales,
  localeTags,
  routeSegments,
  type CanonicalRoute,
  type Locale,
} from "@/config/i18n";
import { siteConfig } from "@/config/site";

/**
 * MÉTADONNÉES DE PAGE
 *
 * Chaque page se décrivait par un titre et une description, jamais par son
 * adresse. Next fusionne les métadonnées par champ : faute d'`alternates` sur
 * les pages, toutes héritaient de celles du layout — c'est-à-dire que
 * /fr/services, /fr/contact et /fr/realisations/bricodi-pro déclaraient tous
 * la page d'accueil comme URL canonique. Un moteur suit cette déclaration : il
 * n'aurait indexé qu'une seule page du site.
 *
 * Le calcul est donc centralisé ici. Une page fournit sa route canonique, le
 * reste — URL canonique, hreflang des trois langues, Open Graph, Twitter — en
 * découle mécaniquement et ne peut plus être oublié.
 */

/** Chemin public d'une page dans une langue : ("en", "realisations", "bricodi-pro") → /en/work/bricodi-pro */
export function pagePath(
  locale: Locale,
  route?: CanonicalRoute,
  slug?: string,
): string {
  const parts: string[] = [locale];
  if (route) parts.push(routeSegments[route][locale]);
  if (slug) parts.push(slug);
  return `/${parts.join("/")}`;
}

/**
 * Toutes les variantes linguistiques d'une page, pour les balises hreflang.
 * `x-default` pointe vers le français : c'est la langue servie quand aucune
 * autre ne correspond.
 */
export function languageAlternates(
  route?: CanonicalRoute,
  slug?: string,
): Record<string, string> {
  const entries = locales.map((locale) => [locale, pagePath(locale, route, slug)]);
  return {
    ...Object.fromEntries(entries),
    "x-default": pagePath(defaultLocale, route, slug),
  };
}

export interface PageMetadataInput {
  locale: Locale;
  /** Route canonique — absente pour la page d'accueil. */
  route?: CanonicalRoute;
  /** Segment de second niveau : slug de service ou de projet. */
  slug?: string;
  title: string;
  description: string;
  /** Ignore le template du layout, utile lorsque le titre contient déjà la marque. */
  absoluteTitle?: boolean;
  /** Retire la page des index — pages internes, états vides sans valeur SEO. */
  noIndex?: boolean;
}

/**
 * Visuel de partage, une déclinaison par langue.
 *
 * Fichier statique plutôt que route de génération : `opengraph-image.tsx`
 * ne s'appliquait qu'au segment où il était posé — l'accueil recevait bien sa
 * balise `og:image`, aucune des pages intérieures ne l'obtenait. Or ce sont
 * ces pages-là qu'un prospect partage. Un PNG de 58 ko référencé explicitement
 * par chaque page règle le problème, et sans rendu à la demande.
 *
 * Régénérable : `node scripts/generate-brand-assets.mjs`.
 */
const shareImage = (locale: Locale) => ({
  url: `/brand/og-image-${locale}.png`,
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
});

export function pageMetadata({
  locale,
  route,
  slug,
  title,
  description,
  absoluteTitle = false,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const path = pagePath(locale, route, slug);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      languages: languageAlternates(route, slug),
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: localeTags[locale],
      alternateLocale: locales
        .filter((entry) => entry !== locale)
        .map((entry) => localeTags[entry]),
      type: "website",
      images: [shareImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage(locale).url],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false, nocache: true } }
      : {}),
  };
}

/**
 * URL absolue d'une ressource. Vide tant que le domaine de production n'est
 * pas renseigné : mieux vaut ne rien émettre qu'une URL relative là où la
 * spécification exige une adresse complète (sitemap, JSON-LD, Open Graph).
 */
export const absoluteUrl = (path: string): string =>
  siteConfig.url ? `${siteConfig.url.replace(/\/$/, "")}${path}` : "";
