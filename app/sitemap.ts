import type { MetadataRoute } from "next";
import { locales, type CanonicalRoute, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { articles } from "@/data/articles";
import { absoluteUrl, pagePath } from "@/lib/seo/metadata";

/**
 * SITEMAP
 *
 * Une entrée par URL réellement servie — soit trois entrées par page, une par
 * langue, chacune déclarant les deux autres en `alternates`. C'est la forme
 * attendue pour un site multilingue : elle indique aux moteurs que ces URL ne
 * sont pas des doublons mais des traductions.
 *
 * Le guide de style (/styleguide) en est absent : c'est une page de contrôle
 * interne, elle n'a rien à faire dans un index public.
 *
 * Le sitemap exige des URL absolues. Sans NEXT_PUBLIC_SITE_URL, il ne peut pas
 * être produit : on rend alors un document vide plutôt qu'un fichier peuplé
 * d'adresses relatives, qu'un moteur rejetterait en bloc.
 */

interface Entry {
  route?: CanonicalRoute;
  slug?: string;
  lastModified?: MetadataRoute.Sitemap[number]["lastModified"];
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const entries: Entry[] = [
  { priority: 1.0, changeFrequency: "weekly" },
  { route: "services", priority: 0.9, changeFrequency: "monthly" },
  { route: "realisations", priority: 0.9, changeFrequency: "weekly" },
  { route: "demander-un-devis", priority: 0.9, changeFrequency: "monthly" },
  { route: "solutions", priority: 0.8, changeFrequency: "monthly" },
  { route: "methode", priority: 0.7, changeFrequency: "yearly" },
  { route: "a-propos", priority: 0.7, changeFrequency: "yearly" },
  { route: "contact", priority: 0.8, changeFrequency: "monthly" },
  { route: "blog", priority: 0.4, changeFrequency: "weekly" },
  { route: "mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { route: "politique-confidentialite", priority: 0.2, changeFrequency: "yearly" },
  ...services.map((service) => ({
    route: "services" as const,
    slug: service.slug,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  })),
  ...projects.map((project) => ({
    route: "realisations" as const,
    slug: project.slug,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  ...articles.map((article) => ({
    route: "blog" as const,
    slug: article.slug,
    lastModified: article.updatedAt,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
];

const languagesFor = (entry: Entry) => {
  const languageEntries = Object.fromEntries(
    locales.map((locale) => [
      locale,
      absoluteUrl(pagePath(locale, entry.route, entry.slug)),
    ]),
  ) as Record<Locale, string>;
  return {
    ...languageEntries,
    "x-default": absoluteUrl(
      pagePath("fr", entry.route, entry.slug),
    ),
  };
};

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.url) return [];

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: absoluteUrl(pagePath(locale, entry.route, entry.slug)),
      ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages: languagesFor(entry) },
    })),
  );
}
