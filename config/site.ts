/**
 * Configuration centrale du site.
 *
 * RIEN N'EST INVENTÉ ICI. Une coordonnée n'apparaît dans ce fichier qu'une fois
 * confirmée par la direction ; tout le reste vient de l'environnement et reste
 * vide par défaut. Les composants qui consomment ces valeurs doivent gérer
 * l'absence — masquage propre, jamais de contenu de remplacement.
 *
 * L'environnement écrase toujours ce qui est écrit ici : un déploiement peut
 * donc corriger un numéro sans passer par le code.
 */

/**
 * Lit une variable d'environnement, avec repli facultatif.
 *
 * LE REPLI N'EST PAS UNE VALEUR PAR DÉFAUT INVENTÉE. Il ne sert qu'aux
 * coordonnées que la direction a CONFIRMÉES et qui ne changent pas d'un
 * déploiement à l'autre — téléphones, adresses e-mail. Les écrire ici plutôt
 * que de les laisser à l'environnement seul évite le piège où un déploiement
 * sans `.env` publie un pied de page sans aucun moyen de joindre l'agence, en
 * silence et sans erreur. L'environnement reste prioritaire : il suffit de
 * définir la variable pour écraser la valeur.
 *
 * Ce qui n'est PAS confirmé n'a pas de repli et reste vide — voir `socials` et
 * `location` plus bas.
 */
const env = (key: string, fallback = ""): string =>
  process.env[key]?.trim() || fallback;

export const siteConfig = {
  name: "Adrar Media",
  tagline: "From Local to Global.",
  description:
    "Nous transformons les marques et entreprises en expériences digitales capables d'attirer, convaincre et convertir.",
  url: env("NEXT_PUBLIC_SITE_URL"),
  locale: "fr-MA",
} as const;

/**
 * Coordonnées.
 *
 * Les numéros et adresses ci-dessous ont été communiqués par la direction et
 * sont publiés. Les valeurs SANS repli restent soumises à la règle d'origine :
 * tant qu'elles ne sont pas fournies, elles restent vides et le composant qui
 * les consomme masque proprement son bloc — jamais de faux contenu.
 *
 * DEUX LIGNES, ET ELLES NE SE VALENT PAS. Le mobile se prend en déplacement,
 * le fixe est celui du bureau. Les afficher tous les deux sans les distinguer
 * laisse le visiteur choisir au hasard ; ils portent donc chacun leur nature à
 * l'écran.
 *
 * Le numéro affiché reste en format national (06…, 05…) parce que c'est celui
 * que lit un client marocain, mais le lien `tel:` part en E.164 : composé
 * depuis l'étranger, un 06 ne joint personne.
 */
export const contact = {
  /** Ligne mobile. */
  phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "06 63 07 05 61"),
  phoneE164: env("NEXT_PUBLIC_PHONE_E164", "+212663070561"),
  /** Ligne fixe du bureau. */
  landlineDisplay: env("NEXT_PUBLIC_LANDLINE_DISPLAY", "05 35 56 45 43"),
  landlineE164: env("NEXT_PUBLIC_LANDLINE_E164", "+212535564543"),
  /*
   * WhatsApp, confirmé : c'est la ligne mobile ci-dessus.
   *
   * Le format n'est PAS celui du lien `tel:` et la différence n'est pas
   * cosmétique — `wa.me` refuse le « + » et tout séparateur, et répond par une
   * page « numéro invalide » au lieu d'ouvrir la conversation. D'où le même
   * numéro écrit une troisième fois, en chiffres nus.
   */
  whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER", "212663070561"),
  /** Adresse générale. */
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", "contact@adrar.media"),
  /**
   * Candidatures. Séparée de l'adresse générale pour que les CV n'atterrissent
   * pas dans la boîte commerciale, où ils se perdent entre deux demandes de
   * devis.
   */
  emailRecruitment: env("NEXT_PUBLIC_RECRUITMENT_EMAIL", "recrutement@adrar.media"),
  /** Adresse postale affichée. Confirmée par la direction. */
  location: env("NEXT_PUBLIC_LOCATION", "N° 47, Lot Nakhil 6, Ahadaf, Azrou"),
  /** Ville et pays, pour les données structurées. */
  locality: env("NEXT_PUBLIC_LOCALITY", "Azrou"),
  country: env("NEXT_PUBLIC_COUNTRY", "MA"),
  /**
   * Requête envoyée à la carte, si elle diffère du libellé affiché — un nom
   * d'établissement précis place un repère là où une simple ville n'en place
   * aucun. Vide, la carte retombe sur `location` ; si les deux sont vides, elle
   * ne s'affiche pas.
   *
   * CE SONT DES COORDONNÉES ET NON L'ADRESSE ÉCRITE, VOLONTAIREMENT.
   *
   * « Lot Nakhil 6, Ahadaf » est un lotissement, pas une voie référencée :
   * envoyé tel quel à Google, il place l'épingle au centre d'Azrou, à plusieurs
   * centaines de mètres du bureau. Le couple latitude/longitude relevé sur
   * place tombe juste à la porte. L'adresse reste affichée sous la carte : le
   * visiteur lit une adresse, la carte reçoit un point.
   */
  mapQuery: env("NEXT_PUBLIC_MAP_QUERY", "33.4538199,-5.2248788"),
  /** Coordonnées séparées, pour le champ `geo` de schema.org. */
  latitude: env("NEXT_PUBLIC_LATITUDE", "33.4538199"),
  longitude: env("NEXT_PUBLIC_LONGITUDE", "-5.2248788"),
} as const;

/**
 * Comptes officiels.
 *
 * `key` n'est pas un doublon de `label` : c'est lui qui choisit le pictogramme
 * dans `components/ui/SocialIcon.tsx`. Le libellé reste le texte accessible du
 * lien — une icône seule ne dit rien à un lecteur d'écran.
 *
 * Instagram et LinkedIn ont été confirmés par la direction et portent donc un
 * repli, comme les téléphones. Facebook et TikTok n'ont pas été communiqués :
 * ils restent vides et leur icône n'apparaît pas.
 */
export const socials = [
  {
    key: "instagram",
    label: "Instagram",
    url: env("NEXT_PUBLIC_INSTAGRAM_URL", "https://www.instagram.com/adrar.media/"),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    url: env("NEXT_PUBLIC_LINKEDIN_URL", "https://ma.linkedin.com/company/adrar-media"),
  },
  { key: "facebook", label: "Facebook", url: env("NEXT_PUBLIC_FACEBOOK_URL") },
  { key: "tiktok", label: "TikTok", url: env("NEXT_PUBLIC_TIKTOK_URL") },
] as const;

export type SocialKey = (typeof socials)[number]["key"];

export const activeSocials = () => socials.filter((s) => s.url.length > 0);

export const whatsappLink = (message?: string): string | null => {
  if (!contact.whatsapp) return null;
  const base = `https://wa.me/${contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/*
 * La navigation ne vit pas ici.
 *
 * Ce fichier portait une liste `mainNav`, un `primaryCta`, un `secondaryCta`
 * et un `legalNav` en français, écrits en dur — aucun n'était utilisé. Les
 * libellés du site sont traduits et les adresses dépendent de la langue : la
 * navigation est donc construite par `components/navigation/Navbar.tsx` et
 * `components/layout/Footer.tsx` à partir des dictionnaires et de
 * `lib/i18n/routing`. Une seconde liste ici n'aurait fait que diverger en
 * silence.
 */
