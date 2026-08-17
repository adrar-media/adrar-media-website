/**
 * Configuration centrale du site.
 * Toute donnée de contact vient de l'environnement : rien n'est écrit en dur,
 * rien n'est inventé. Une valeur absente reste vide et les composants qui la
 * consomment doivent gérer cet état (masquage propre, jamais de faux contenu).
 */

const env = (key: string): string => process.env[key]?.trim() ?? "";

export const siteConfig = {
  name: "Adrar Media",
  tagline: "From Local to Global.",
  description:
    "Nous transformons les marques et entreprises en expériences digitales capables d'attirer, convaincre et convertir.",
  url: env("NEXT_PUBLIC_SITE_URL"),
  locale: "fr-MA",
} as const;

/**
 * Coordonnées. CONTENT_REQUIRED tant que la direction ne les a pas fournies.
 * `hasContact()` permet aux composants de masquer proprement un bloc vide.
 */
export const contact = {
  phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY"),
  phoneE164: env("NEXT_PUBLIC_PHONE_E164"),
  whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER"),
  email: env("NEXT_PUBLIC_CONTACT_EMAIL"),
  location: env("NEXT_PUBLIC_LOCATION"),
} as const;

export const socials = [
  { label: "Instagram", url: env("NEXT_PUBLIC_INSTAGRAM_URL") },
  { label: "Facebook", url: env("NEXT_PUBLIC_FACEBOOK_URL") },
  { label: "TikTok", url: env("NEXT_PUBLIC_TIKTOK_URL") },
  { label: "LinkedIn", url: env("NEXT_PUBLIC_LINKEDIN_URL") },
] as const;

export const activeSocials = () => socials.filter((s) => s.url.length > 0);

export const whatsappLink = (message?: string): string | null => {
  if (!contact.whatsapp) return null;
  const base = `https://wa.me/${contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Navigation principale — libellés courts, à l'anglaise du brief mais en français. */
export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Méthode", href: "/methode" },
  { label: "À propos", href: "/a-propos" },
] as const;

export const primaryCta = {
  label: "Demander un devis",
  href: "/demander-un-devis",
} as const;

export const secondaryCta = {
  label: "Voir nos réalisations",
  href: "/realisations",
} as const;

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
] as const;
