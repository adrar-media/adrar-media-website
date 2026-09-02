import { contact } from "@/config/site";

const env = (key: string, fallback = ""): string =>
  process.env[key]?.trim() || fallback;

/**
 * Identité réglementaire fournie au déploiement. Aucune valeur juridique
 * n'est déduite du nom commercial : le contrôle de préproduction exige les
 * champs officiels avant une mise en ligne publique.
 */
export const legalConfig = {
  tradeName: "Adrar Media",
  legalName: env("NEXT_PUBLIC_LEGAL_NAME"),
  legalForm: env("NEXT_PUBLIC_LEGAL_FORM"),
  capital: env("NEXT_PUBLIC_SHARE_CAPITAL"),
  tradeRegister: env("NEXT_PUBLIC_TRADE_REGISTER"),
  taxId: env("NEXT_PUBLIC_TAX_ID"),
  ice: env("NEXT_PUBLIC_ICE"),
  // Une adresse de contact confirmée n'est pas nécessairement le siège social.
  headquarters: env("NEXT_PUBLIC_REGISTERED_OFFICE"),
  publicationDirector: env("NEXT_PUBLIC_PUBLICATION_DIRECTOR"),
  dataContact: env("NEXT_PUBLIC_DATA_CONTACT_EMAIL", contact.email),
  cndpReceipt: env("NEXT_PUBLIC_CNDP_RECEIPT"),
  hostName: env(
    "NEXT_PUBLIC_HOST_NAME",
    process.env.VERCEL ? "Vercel Inc." : "",
  ),
  hostAddress: env("NEXT_PUBLIC_HOST_ADDRESS"),
  hostUrl: env(
    "NEXT_PUBLIC_HOST_URL",
    process.env.VERCEL ? "https://vercel.com" : "",
  ),
} as const;

export const legalIdentityComplete = (): boolean =>
  Boolean(
    legalConfig.legalName &&
      legalConfig.legalForm &&
      legalConfig.capital &&
      legalConfig.tradeRegister &&
      legalConfig.taxId &&
      legalConfig.ice &&
      legalConfig.headquarters &&
      legalConfig.publicationDirector &&
      legalConfig.dataContact &&
      legalConfig.hostName &&
      legalConfig.hostAddress &&
      legalConfig.hostUrl &&
      legalConfig.cndpReceipt,
  );
