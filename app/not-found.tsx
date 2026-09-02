import Link from "next/link";
import { localeNames, locales } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata = {
  title: `404 — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

/**
 * 404 hors langue.
 *
 * Se déclenche quand l'URL ne comporte aucune langue valide : /xx/services,
 * ou une ressource servie hors du périmètre du middleware. Le layout racine
 * étant transparent, cette page rend elle-même <html> et <body> — sans quoi
 * le document serait invalide.
 *
 * La langue du visiteur est ici inconnue : plutôt que de choisir à sa place,
 * la page propose les trois portes d'entrée. C'est le seul cas du site où un
 * texte apparaît simultanément dans les trois langues, et c'est justifié —
 * toute autre solution reviendrait à deviner.
 */
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="bg-canvas text-anthracite antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-container flex-col justify-center px-gutter py-24">
          <p className="text-caption uppercase tracking-[0.18em] text-atlas">
            {siteConfig.name}
          </p>

          <p aria-hidden className="mt-8 text-display leading-none text-canvas-gray">
            404
          </p>

          <h1 className="mt-6 text-h2 text-ink">
            Page introuvable · Page not found · الصفحة غير موجودة
          </h1>

          <p className="mt-6 max-w-prose text-body text-anthracite/70">
            L&apos;adresse demandée ne correspond à aucune page. Choisissez une
            langue pour rejoindre le site.
          </p>

          <ul className="mt-12 flex flex-wrap gap-4">
            {locales.map((locale) => (
              <li key={locale}>
                <Link
                  href={`/${locale}`}
                  lang={locale}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  className="inline-flex items-center gap-2.5 rounded-pill bg-atlas px-8 py-4 text-button text-canvas transition duration-base hover:bg-atlas-dark"
                >
                  {localeNames[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
