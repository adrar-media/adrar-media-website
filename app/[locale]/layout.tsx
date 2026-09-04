import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, Readex_Pro } from "next/font/google";
import { isLocale, isRtl, locales, localeTags, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocaleSuggestion } from "@/components/navigation/LocaleSuggestion";
import { Consent } from "@/components/consent/Consent";
import { DEFAULT_THEME, themeScript } from "@/lib/theme";
import { Cursor } from "@/components/cursor/Cursor";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { DesktopPreloader } from "@/components/motion/DesktopPreloader";
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
 * Archivo pour le latin, Madani Arabic pour l'arabe.
 *
 * Madani Arabic est désormais le caractère principal de la version arabe. Il
 * est auto-hébergé : ses quatre graisses sont déclarées en @font-face dans
 * globals.css, à partir des WOFF2 de /public/fonts. next/font ne l'expose pas
 * — il ne gère que les polices qu'il télécharge ou importe lui-même — d'où la
 * déclaration manuelle et le préchargement conditionnel posé plus bas.
 *
 * Readex Pro reste chargé, mais comme repli. Deux raisons de le garder :
 *
 * - la version DEMO de Madani est incomplète. Il lui manque une partie de la
 *   ponctuation — virgule arabe (،), point d'interrogation arabe (؟), trait
 *   d'union, deux-points, parenthèses, apostrophe — et ses chiffres sont des
 *   pavés hachurés, que le script de fabrication retire (voir
 *   scripts/build-madani-webfonts.py). Tous ces caractères tombent, un par un,
 *   sur Readex, qui est un arabe réel : la substitution reste discrète. Sans
 *   lui, ils tomberaient sur une police système, avec une rupture de dessin
 *   bien plus visible ;
 * - tant que Madani n'est pas chargé, le texte arabe s'affiche dans un
 *   caractère arabe et non dans une substitution système, qui casserait les
 *   liaisons entre lettres.
 *
 * IBM Plex Sans Arabic, qui tenait ce rôle de second repli, est retiré : deux
 * polices de repli pour une police principale, c'est une famille chargée pour
 * rien.
 *
 * next/font auto-héberge Archivo et Readex — aucune requête vers un domaine
 * tiers, pour aucune des trois familles.
 */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-latin",
  axes: ["wdth"],
});

const readexArabic = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic-fallback",
  /*
   * `preload: false` — READEX EST UN REPLI, IL NE DOIT PAS ÊTRE PRÉCHARGÉ.
   *
   * next/font pose ses `<link rel="preload">` à partir des variables déclarées
   * sur le document. La variable de Readex est appliquée sur `<html>` dans
   * TOUTES les langues — c'est ce qui la rend disponible comme repli — donc
   * next/font préchargeait ses fichiers sur les pages françaises et anglaises
   * aussi, où pas un caractère ne lui revient.
   *
   * Mesuré sur l'en-tête `Link` de /fr : trois polices préchargées, dont deux
   * Readex (31 ko + 22 ko). Cinquante-trois kilo-octets réservés en priorité
   * haute, avant le CSS et les images, sur les pages de la langue principale,
   * pour une famille que ces pages n'affichent jamais.
   *
   * Désactiver le préchargement ne retire pas la police : elle reste déclarée,
   * et le navigateur la demande si un caractère tombe dessus — c'est exactement
   * le comportement voulu d'un repli. Sur la version arabe, la police du corps
   * de texte est Madani, déjà préchargée explicitement plus bas ; Readex n'y
   * couvre que la ponctuation manquante et les chiffres, soit quelques signes
   * par page, qui peuvent attendre le CSS.
   */
  preload: false,
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

  /*
   * Le layout ne porte plus ni URL canonique ni hreflang. Next fusionne les
   * métadonnées champ par champ : une valeur posée ici serait héritée par
   * toutes les pages qui ne la redéfinissent pas, et c'est exactement ce qui
   * faisait déclarer la page d'accueil comme canonique sur l'ensemble du site.
   * Chaque page construit désormais les siennes via `pageMetadata`.
   */
  return {
    title: { default: t("meta.title"), template: `%s | ${siteConfig.name}` },
    description: t("meta.description"),
    ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
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
  const preloaderEnabled =
    process.env.NEXT_PUBLIC_ENABLE_PRELOADER?.trim().toLowerCase() === "true";

  return (
    /*
      `data-theme` EST RENDU CÔTÉ SERVEUR, avec le thème officiel.
      Le document n'existe donc jamais sans attribut, et il n'y a plus d'état
      « aucun thème » que la feuille de style et les utilitaires `dark:` de
      Tailwind pourraient interpréter différemment. Le script de tête ne fait
      que le corriger si le visiteur a déjà choisi autre chose — ce qui
      n'arrive qu'après lecture du stockage local, donc jamais au premier
      passage.
    */
    <html
      lang={localeTags[typedLocale]}
      dir={rtl ? "rtl" : "ltr"}
      data-theme={DEFAULT_THEME}
      /*
       * `suppressHydrationWarning` EST OBLIGATOIRE ICI, ET UNIQUEMENT ICI.
       *
       * React rend `data-theme="dark"` et s'attend à le retrouver intact à
       * l'hydratation. Or le script de tête s'exécute AVANT — c'est tout son
       * intérêt — et le remplace par le choix du visiteur. React voit alors un
       * attribut modifié sous ses pieds et signale une divergence serveur /
       * client, sur la seule différence qui soit voulue.
       *
       * L'avertissement est donc supprimé pour cet élément seul. La portée est
       * limitée à `<html>` et à ses attributs : rien de ce qu'il contient n'est
       * couvert, et une vraie divergence dans la page sera toujours signalée.
       */
      suppressHydrationWarning
      className={cn(archivo.variable, readexArabic.variable)}
    >
      <head>
        {/*
          Madani est la police du corps de texte arabe : sans préchargement,
          elle n'est demandée qu'une fois la feuille de style analysée, et la
          page s'affiche d'abord en Readex avant de basculer. On précharge donc
          les deux seules graisses réellement appelées par le système
          typographique — 400 pour le texte courant, 700 pour les titres, où
          la graisse 600 des jetons se résout. Uniquement en arabe : sur les
          versions française et anglaise, ces fichiers ne servent à rien.
        */}
        {rtl && (
          <>
            <link
              rel="preload"
              href="/fonts/madani-arabic-regular.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/madani-arabic-bold.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          </>
        )}
        {/*
          THÈME — posé avant la première image peinte.

          Ce script est volontairement synchrone et en tête de document. Placé
          plus bas, ou différé, la page s'afficherait une fraction de seconde
          dans le thème clair avant de basculer : c'est le « flash blanc » que
          tout visiteur en thème sombre connaît, et il est d'autant plus
          violent qu'il arrive en pleine nuit.

          Il ne lit qu'une clé et ne pose qu'un attribut. L'absence de valeur
          stockée signifie « suivre le système » : dans ce cas il ne pose rien
          et laisse la requête média de globals.css décider seule.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />

        {/*
          Sans JavaScript, aucun observateur ne viendra révéler les blocs :
          la page entière resterait vide. Cette feuille n'est appliquée par le
          navigateur que lorsque le script est indisponible — c'est le seul
          mécanisme qui distingue vraiment les deux cas côté CSS.
        */}
        <noscript>
          <style>{`.reveal[data-reveal="out"],.reveal-stagger[data-reveal="out"]>*{opacity:1;transform:none}.reveal-media[data-reveal="out"]{clip-path:none}.reveal[data-reveal="out"] .media-settle{transform:none}[data-chart-motion="out"] [data-chart-node],[data-chart-motion="out"] [data-chart-line]{opacity:1;transform:none}.preloader{display:none}`}</style>
        </noscript>
      </head>
      <body className={rtl ? "font-arabic" : "font-sans"}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:bg-surface focus:px-4 focus:py-2 focus:text-white"
        >
          {rtl ? "تخطي إلى المحتوى" : "Aller au contenu"}
        </a>
        {/*
          Écran de chargement. Monté avant tout le reste du corps : il doit
          être peint dans la même image que le contenu qu'il recouvre, sinon on
          voit la page une fraction de seconde avant que le voile ne tombe
          dessus — soit exactement le clignotement qu'il est censé éviter.

          Il ne rend rien sous mouvement réduit, et le contenu qu'il masque est
          entièrement présent dans le HTML servi : ni le référencement ni les
          lecteurs d'écran ne voient de page vide.
        */}
        {preloaderEnabled && <DesktopPreloader />}

        {/*
          Curseur personnalisé. Monté en tête de corps pour que ses deux nœuds
          soient dans le document avant tout le reste, mais il ne rend rien
          tant que le pointeur n'est pas reconnu comme fin — au doigt comme en
          mouvement réduit, il n'ajoute pas un seul élément à la page.
        */}
        <Cursor />

        {/*
          Barre de progression de lecture et dérive des visuels. Les deux
          étaient pilotées par les chronologies de défilement CSS, que seuls
          Chrome et Edge implémentent : ailleurs, elles ne faisaient rien.
        */}
        <ScrollMotion />

        <Navbar locale={typedLocale} />
        <main id="main">{children}</main>
        <Footer locale={typedLocale} />
        <LocaleSuggestion current={typedLocale} labels={await suggestionLabels()} />
        <Consent locale={typedLocale} />
      </body>
    </html>
  );
}
