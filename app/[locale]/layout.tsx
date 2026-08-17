import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { isLocale, isRtl, locales, localeTags, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { alternateUrls, href } from "@/lib/i18n/routing";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocaleSuggestion } from "@/components/navigation/LocaleSuggestion";
import { PageTransition } from "@/components/ui/PageTransition";
import { cn } from "@/lib/utils";
import "../globals.css";

/**
 * La suggestion de langue s'affiche dans la langue proposée, pas dans celle de
 * la page : un visiteur anglophone doit lire « English detected », pas une
 * phrase en français. Les trois jeux de libellés sont donc préchargés.
 */
async function suggestionLabels() {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const t = await getTranslator(locale, "common");
      return [
        locale,
        {
          detected: t("suggestion.detected"),
          accept: t("suggestion.accept"),
          dismiss: t("suggestion.dismiss"),
        },
      ] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<
    Locale,
    { detected: string; accept: string; dismiss: string }
  >;
}

/**
 * Archivo pour le latin, IBM Plex Sans Arabic pour l'arabe.
 * Les deux sont des grotesques contemporains de proportions voisines : le site
 * garde la même densité et la même autorité typographique d'une langue à
 * l'autre. next/font les auto-héberge — aucune requête vers un domaine tiers.
 */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-latin",
  axes: ["wdth"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslator(locale, "home");
  const languages = siteConfig.url
    ? alternateUrls(href(locale), siteConfig.url)
    : undefined;

  return {
    title: { default: t("meta.title"), template: `%s | ${siteConfig.name}` },
    description: t("meta.description"),
    ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
    alternates: {
      canonical: href(locale),
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      locale: localeTags[locale],
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A2540",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const rtl = isRtl(typedLocale);

  return (
    <html
      lang={localeTags[typedLocale]}
      dir={rtl ? "rtl" : "ltr"}
      className={cn(archivo.variable, plexArabic.variable)}
    >
      <body className={rtl ? "font-arabic" : "font-sans"}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:bg-deep focus:px-4 focus:py-2 focus:text-white"
        >
          {rtl ? "تخطي إلى المحتوى" : "Aller au contenu"}
        </a>
        <LocaleSuggestion current={typedLocale} labels={await suggestionLabels()} />
        <Navbar locale={typedLocale} />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer locale={typedLocale} />
      </body>
    </html>
  );
}
