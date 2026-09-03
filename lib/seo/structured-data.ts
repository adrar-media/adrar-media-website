import type { Locale } from "@/config/i18n";
import { localeTags } from "@/config/i18n";
import { activeSocials, contact, siteConfig } from "@/config/site";
import { absoluteUrl, pagePath } from "@/lib/seo/metadata";
import type { CanonicalRoute } from "@/config/i18n";
import type { EditorialArticle, LocalizedArticle } from "@/data/articles";

/**
 * DONNÉES STRUCTURÉES (schema.org)
 *
 * Ce que les moteurs affichent d'une entreprise dans leurs résultats — nom,
 * logo, langues, comptes officiels, fil d'Ariane — ne se déduit pas du texte
 * de la page : il faut le déclarer. Sans ces blocs, Adrar Media apparaît comme
 * une page parmi d'autres et non comme une organisation identifiée.
 *
 * Même règle que partout ailleurs dans le projet : un champ dont la donnée
 * n'est pas fournie n'est pas émis. Un JSON-LD qui annonce un téléphone vide
 * ou une URL relative est rejeté à la validation — mieux vaut un bloc plus
 * court et exact.
 */

type Schema = Record<string, unknown>;

/** Retire les clés vides, nulles ou tableaux vides avant émission. */
const compact = (schema: Schema): Schema =>
  Object.fromEntries(
    Object.entries(schema).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );

export function organizationSchema(locale: Locale): Schema {
  const socials = activeSocials().map((social) => social.url);
  const home = absoluteUrl(pagePath(locale));

  return compact({
    "@context": "https://schema.org",
    /*
     * Deux types, pas un remplacement : ladresse et les coordonnees GPS
     * deja emises plus bas sont exactement les champs que Google associe a
     * un etablissement local (fiche Maps, resultats locaux). Rester en
     * simple `Organization` les laissait sur la table sans quaucune donnee
     * supplementaire ne soit necessaire pour les recuperer.
     */
    "@type": ["Organization", "ProfessionalService"],
    "@id": home ? `${home}#organization` : undefined,
    name: siteConfig.name,
    alternateName: siteConfig.tagline,
    description: siteConfig.description,
    url: home,
    logo: absoluteUrl("/brand/adrar-media-logo.png"),
    image: absoluteUrl("/brand/adrar-media-logo.png"),
    email: contact.email,
    telephone: contact.phoneE164,
    sameAs: socials,
    /*
     * L'adresse est DÉCOUPÉE, et ce n'est pas de la coquetterie : Google lit
     * `streetAddress` et `addressLocality` comme deux champs distincts pour
     * composer une fiche établissement. La chaîne entière poussée dans
     * `addressLocality` annonçait « N° 47, Lot Nakhil 6, Ahadaf, Azrou » comme
     * un nom de ville — une ville qui n'existe pas.
     */
    address: contact.location
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.location,
          addressLocality: contact.locality || undefined,
          addressCountry: contact.country || "MA",
        }
      : undefined,
    /*
     * Les coordonnées placent l'établissement là où l'adresse écrite ne suffit
     * pas : « Lot Nakhil 6 » n'est pas une voie référencée, et sans `geo` la
     * fiche retombe sur le centre d'Azrou.
     */
    geo:
      contact.latitude && contact.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: contact.latitude,
            longitude: contact.longitude,
          }
        : undefined,
    contactPoint:
      contact.email || contact.phoneE164
        ? compact({
            "@type": "ContactPoint",
            contactType: "sales",
            email: contact.email,
            telephone: contact.phoneE164,
            availableLanguage: ["French", "English", "Arabic"],
          })
        : undefined,
  });
}

export function websiteSchema(locale: Locale): Schema {
  const home = absoluteUrl(pagePath(locale));

  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": home ? `${home}#website` : undefined,
    name: siteConfig.name,
    url: home,
    inLanguage: localeTags[locale],
    publisher: home ? { "@id": `${home}#organization` } : undefined,
  });
}

export interface Crumb {
  name: string;
  route?: CanonicalRoute;
  slug?: string;
}

/**
 * Fil d'Ariane. Émis uniquement si le domaine est connu : la spécification
 * impose des URL absolues pour chaque étape.
 */
export function breadcrumbSchema(locale: Locale, crumbs: Crumb[]): Schema | null {
  if (!siteConfig.url) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(pagePath(locale, crumb.route, crumb.slug)),
    })),
  };
}

export function serviceSchema(
  locale: Locale,
  {
    name,
    description,
    slug,
  }: { name: string; description: string; slug: string },
): Schema {
  const home = absoluteUrl(pagePath(locale));

  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: absoluteUrl(pagePath(locale, "services", slug)),
    provider: home
      ? { "@id": `${home}#organization` }
      : { "@type": "Organization", name: siteConfig.name },
    areaServed: { "@type": "Country", name: "Morocco" },
    availableLanguage: ["fr", "en", "ar"],
  });
}

export function articleSchema(
  locale: Locale,
  article: EditorialArticle,
  content: LocalizedArticle,
): Schema {
  const url = absoluteUrl(pagePath(locale, "blog", article.slug));
  const home = absoluteUrl(pagePath(locale));

  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: localeTags[locale],
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      ...(home ? { "@id": `${home}#organization` } : {}),
    },
    publisher: home ? { "@id": `${home}#organization` } : undefined,
  });
}
