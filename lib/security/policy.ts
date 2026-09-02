/**
 * POLITIQUE DE SÉCURITÉ HTTP
 *
 * Un site vitrine n'a ni compte utilisateur ni base de données : sa surface
 * d'attaque tient dans ce que le navigateur accepte de faire en son nom.
 * D'où le choix de tout régler par en-têtes, au plus près de la réponse, et
 * non par une bibliothèque intermédiaire.
 *
 * Les en-têtes sont construits ici plutôt que dans `next.config.ts` pour deux
 * raisons : la politique est longue et mérite d'être expliquée ligne à ligne,
 * et elle dépend de la configuration réelle du déploiement — un domaine tiers
 * n'est autorisé que si l'outil qui l'utilise est effectivement activé.
 */

const env = (key: string): string => process.env[key]?.trim() ?? "";

/**
 * Domaines des mesures d'audience, ajoutés à la politique UNIQUEMENT si
 * l'identifiant correspondant est renseigné.
 *
 * C'est la différence entre une politique écrite une fois pour toutes et une
 * politique qui décrit le déploiement : sur une instance sans Meta Pixel,
 * `connect.facebook.net` n'a rien à faire dans la liste blanche. Chaque
 * domaine autorisé est une porte ; on n'en ouvre aucune « au cas où ».
 */
function analyticsOrigins(): {
  script: string[];
  connect: string[];
  img: string[];
  frame: string[];
} {
  const script: string[] = [];
  const connect: string[] = [];
  const img: string[] = [];
  const frame: string[] = [];

  if (env("NEXT_PUBLIC_GA4_MEASUREMENT_ID")) {
    script.push("https://www.googletagmanager.com");
    connect.push(
      "https://www.google-analytics.com",
      "https://analytics.google.com",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
    );
    img.push(
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://www.googletagmanager.com",
    );
  }

  if (env("NEXT_PUBLIC_META_PIXEL_ID")) {
    script.push("https://connect.facebook.net");
    connect.push("https://www.facebook.com", "https://connect.facebook.net");
    img.push("https://www.facebook.com");
  }

  if (env("NEXT_PUBLIC_TIKTOK_PIXEL_ID")) {
    script.push("https://analytics.tiktok.com");
    connect.push("https://analytics.tiktok.com");
    img.push("https://analytics.tiktok.com");
  }

  return { script, connect, img, frame };
}

/**
 * Cadres tiers autorisés : la carte de la page Contact, et rien d'autre.
 *
 * La carte n'est chargée qu'après un clic explicite du visiteur (voir
 * `components/contact/LocationMap.tsx`), mais l'autorisation doit tout de même
 * exister dans la politique — sinon le clic ne produirait qu'un cadre vide.
 */
const MAP_FRAME_ORIGINS = [
  "https://www.google.com",
  "https://maps.google.com",
];

/**
 * CONTENT SECURITY POLICY
 *
 * ── Sur `'unsafe-inline'` dans `script-src`, qui est le seul relâchement ──
 *
 * Next.js pré-rend ce site en HTML statique. Ce HTML contient sept balises
 * `<script>` en ligne qui portent la charge utile de l'hydratation
 * (`self.__next_f.push(...)`), dont le contenu diffère à chaque page. Trois
 * façons de les autoriser :
 *
 *   1. par empreinte (`'sha256-…'`) — impossible, le contenu varie par page ;
 *   2. par nonce — impossible sans lire les en-têtes de la requête au rendu,
 *      ce qui ferait basculer TOUTES les pages du pré-rendu statique au rendu
 *      à la demande. On échangerait la mise en cache complète du site contre
 *      une protection dont le bénéfice est examiné au point suivant ;
 *   3. par `'unsafe-inline'` — retenu.
 *
 * Ce que cela laisse passer : un script injecté EN LIGNE dans la page. Or
 * pour en injecter un, il faut d'abord pouvoir écrire dans le HTML — et ce
 * site n'affiche aucun contenu soumis par un visiteur. Les seules entrées
 * publiques sont le formulaire de contact et celui de devis, dont le contenu
 * part par e-mail (échappé, cf. `lib/leads/email.ts`) et n'est jamais rendu
 * dans une page.
 *
 * Ce que la politique bloque en revanche, et qui est le risque réel pour un
 * site vitrine : le chargement d'un script depuis un domaine non listé
 * (dépendance compromise, balise ajoutée par erreur, extension malveillante),
 * l'envoi d'un formulaire vers un domaine tiers, la réécriture de l'URL de
 * base, les objets Flash/Java, et la mise en cadre du site.
 *
 * Le jour où une page affichera du contenu tiers, le passage au nonce se fait
 * en lisant `headers()` dans `app/[locale]/layout.tsx` — au prix du rendu
 * statique, qui devient alors le bon échange.
 */
export function contentSecurityPolicy(): string {
  const analytics = analyticsOrigins();

  const directives: Record<string, string[]> = {
    /* Tout ce qui n'est pas réglé explicitement plus bas vient de ce domaine. */
    "default-src": ["'self'"],

    /*
     * `'unsafe-eval'` UNIQUEMENT EN DÉVELOPPEMENT, et ce n'est pas un confort.
     *
     * Le serveur de développement de Next construit ses modules avec le
     * `devtool` « eval » de webpack, et le rafraîchissement à chaud
     * (react-refresh) évalue lui aussi du code sous forme de chaîne. Sans ce
     * relâchement, le navigateur refuse le paquet client TOUT ENTIER : la page
     * reste au HTML servi, React ne s'hydrate jamais, et le symptôme visible
     * est un écran de chargement figé à 0 % — le voile est posé par le CSS, le
     * script qui doit le lever n'a jamais démarré.
     *
     * La compilation de production n'utilise pas `eval` : la politique servie
     * aux visiteurs reste inchangée.
     */
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
      ...analytics.script,
    ],

    /*
     * Tailwind produit une feuille statique, mais Next et GSAP posent des
     * styles en ligne (attribut `style`) sur les éléments animés. Un style
     * injecté ne peut ni exfiltrer ni exécuter — c'est le relâchement le moins
     * coûteux de toute la politique.
     */
    "style-src": ["'self'", "'unsafe-inline'"],

    /* `data:` sert aux SVG en ligne ; `blob:` à l'optimiseur d'images de Next. */
    "img-src": ["'self'", "data:", "blob:", ...analytics.img],

    /* Les trois familles sont auto-hébergées : aucun domaine tiers requis. */
    "font-src": ["'self'", "data:"],

    "connect-src": ["'self'", ...analytics.connect],

    /* La carte, et uniquement elle. */
    "frame-src": [...MAP_FRAME_ORIGINS, ...analytics.frame],

    /* Ni Flash, ni Java, ni PDF embarqué : rien de tout cela n'est utilisé. */
    "object-src": ["'none'"],

    /*
     * Personne ne met ce site en cadre. C'est la protection contre le
     * détournement de clic — un attaquant qui superpose une page invisible
     * au-dessus d'un bouton « Demander un devis ».
     */
    "frame-ancestors": ["'none'"],

    /*
     * Une balise <base> injectée réécrit la cible de TOUS les liens relatifs
     * de la page d'un coup. Bloquée.
     */
    "base-uri": ["'self'"],

    /*
     * Les formulaires ne peuvent partir que vers ce domaine. Sans cette
     * directive, un formulaire détourné enverrait nom, e-mail et téléphone
     * vers un serveur tiers sans que rien ne paraisse à l'écran.
     */
    "form-action": ["'self'"],

    /* Aucun worker tiers. */
    "worker-src": ["'self'", "blob:"],

    /* Interdit les manifestes d'application venus d'ailleurs. */
    "manifest-src": ["'self'"],
  };

  const rendered = Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");

  /*
   * `upgrade-insecure-requests` n'a de sens qu'en HTTPS : en développement, il
   * ferait tenter une connexion TLS vers http://localhost, qui n'écoute pas.
   */
  return process.env.NODE_ENV === "production"
    ? `${rendered}; upgrade-insecure-requests`
    : rendered;
}

/**
 * Fonctionnalités du navigateur refusées d'emblée.
 *
 * Le site n'a besoin d'aucune d'entre elles. Les déclarer vides ferme la
 * question pour la page ET pour tout cadre qu'elle contiendrait : la carte
 * embarquée ne peut pas demander la position du visiteur.
 */
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "browsing-topics=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

export interface SecurityHeader {
  key: string;
  value: string;
}

/**
 * Jeu complet d'en-têtes appliqué à toutes les réponses.
 */
export function securityHeaders(): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy() },

    /*
     * Empêche le navigateur de « deviner » le type d'un fichier. Sans cet
     * en-tête, un fichier téléversé et servi comme texte peut être réinterprété
     * comme du script par certains navigateurs.
     */
    { key: "X-Content-Type-Options", value: "nosniff" },

    /* Doublon volontaire de `frame-ancestors`, pour les navigateurs anciens. */
    { key: "X-Frame-Options", value: "DENY" },

    /*
     * Le domaine d'origine est transmis en HTTPS, jamais le chemin complet, et
     * rien du tout vers un site en clair.
     */
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },

    /*
     * Isole le contexte de navigation : une fenêtre ouverte depuis un autre
     * site ne garde pas de référence exploitable vers celle-ci.
     */
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },

    /*
     * `same-site` plutôt que `same-origin` : les images de partage et les
     * polices doivent rester lisibles par les sous-domaines du projet, sans
     * pour autant être incorporables par n'importe quel site.
     */
    { key: "Cross-Origin-Resource-Policy", value: "same-site" },

    /* Vestige Adobe, mais un crossdomain.xml oublié suffit à ouvrir une brèche. */
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ];

  /*
   * HSTS. Jamais en développement : l'en-tête est mémorisé par le navigateur
   * pour deux ans et rendrait http://localhost inaccessible sur la machine du
   * développeur, bien après la fin du projet.
   */
  if (process.env.NODE_ENV === "production") {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  return headers;
}
