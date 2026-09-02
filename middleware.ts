import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localeCookie } from "@/config/i18n";

/** Indice de langue recommandée, lu par l'interface pour proposer un changement. */
export const suggestionCookie = "adrar_locale_hint";

/** Langue de la requête, transmise aux rendus serveur qui ne reçoivent pas les paramètres de route. */
export const localeHeader = "x-adrar-locale";

import { toCanonicalSegment, toPublicSegment } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

/**
 * Résolution de la langue à l'entrée du site.
 *
 * Deux cas seulement :
 *   • l'URL porte déjà une langue → on la sert, sans jamais la contredire.
 *     Les segments publics localisés (/en/work) sont réécrits vers leur
 *     segment canonique (/en/realisations) pour retrouver le bon dossier.
 *   • l'URL n'en porte pas → on résout la langue et on redirige.
 *
 * Aucun appel réseau : la détection lit un en-tête déjà présent sur la requête.
 * Le rendu n'est donc jamais mis en attente d'un service externe.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  const preference = request.cookies.get(localeCookie.name)?.value;

  if (first && isLocale(first)) {
    const rest = segments.slice(1);
    const canonical = rest.map(toCanonicalSegment);
    /** Segment public attendu pour cette langue. */
    const expected = canonical.map((seg) => toPublicSegment(seg, first));

    /**
     * Une page n'existe qu'à une seule URL par langue. /en/realisations est un
     * segment français servi sous /en : on redirige définitivement vers
     * /en/work plutôt que de laisser deux URL servir le même contenu.
     */
    if (expected.some((seg, i) => seg !== rest[i])) {
      const url = request.nextUrl.clone();
      url.pathname = `/${[first, ...expected].join("/")}`;
      return NextResponse.redirect(url, 308);
    }

    /**
     * La langue est recopiée dans un en-tête de requête.
     *
     * La page 404 en a besoin et ne peut pas la lire ailleurs : une frontière
     * `not-found` ne reçoit pas les paramètres de route, et un composant client
     * ne s'y rend pas. L'en-tête est la seule voie qui traverse la réécriture.
     */
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(localeHeader, first);

    // Réécriture du segment public vers le dossier canonique (/en/work → …/realisations).
    const needsRewrite = canonical.some((seg, i) => seg !== rest[i]);
    const response = needsRewrite
      ? (() => {
          const url = request.nextUrl.clone();
          url.pathname = `/${[first, ...canonical].join("/")}`;
          return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
        })()
      : NextResponse.next({ request: { headers: requestHeaders } });

    /**
     * Suggestion, pas imposition : si le visiteur n'a jamais choisi de langue
     * et que son pays en recommanderait une autre, on dépose un simple indice
     * que l'interface pourra proposer. La page demandée est servie telle quelle.
     */
    if (!preference) {
      const { locale: recommended } = resolveLocale(request.headers, undefined);
      if (recommended !== first) {
        response.cookies.set(suggestionCookie, recommended, {
          path: "/",
          maxAge: 60 * 30,
          sameSite: "lax",
        });
      }
    }

    return response;
  }

  const { locale } = resolveLocale(request.headers, preference);

  const url = request.nextUrl.clone();
  url.pathname = `/${[locale, ...segments].join("/")}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Exclut les fichiers statiques, l'API et les ressources internes de Next.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
