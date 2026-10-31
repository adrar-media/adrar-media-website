import { contact, siteConfig } from "@/config/site";

const env = (value: string | undefined, fallback = ""): string =>
  value?.trim() || fallback;

/** Identité réglementaire officielle communiquée par la direction. */
export const legalConfig = {
  tradeName: "Adrar Media",
  legalName: env(process.env.NEXT_PUBLIC_LEGAL_NAME, "ADRAR MEDIA"),
  legalForm: env(
    process.env.NEXT_PUBLIC_LEGAL_FORM,
    "Société à Responsabilité Limitée à Associé Unique (SARL AU)",
  ),
  capital: env(process.env.NEXT_PUBLIC_SHARE_CAPITAL, "100 000 MAD"),
  tradeRegister: env(process.env.NEXT_PUBLIC_TRADE_REGISTER, "RC 2643 — Azrou"),
  taxId: env(process.env.NEXT_PUBLIC_TAX_ID, "73274886"),
  ice: env(process.env.NEXT_PUBLIC_ICE, "003988605000072"),
  professionalTax: env(process.env.NEXT_PUBLIC_PROFESSIONAL_TAX, "18605317"),
  headquarters: env(
    process.env.NEXT_PUBLIC_REGISTERED_OFFICE,
    "N47, Nakhil 6, Azrou, Maroc",
  ),
  manager: env(process.env.NEXT_PUBLIC_MANAGER, "Kanoun Alaoui Yassine"),
  publicationDirector: env(
    process.env.NEXT_PUBLIC_PUBLICATION_DIRECTOR,
    "Kanoun Alaoui Yassine",
  ),
  dataContact: env(process.env.NEXT_PUBLIC_DATA_CONTACT_EMAIL, contact.email),
  website: siteConfig.url,
  hostName: env(process.env.NEXT_PUBLIC_HOST_NAME, "Netlify, Inc."),
  hostAddress: env(
    process.env.NEXT_PUBLIC_HOST_ADDRESS,
    "101 2nd Street, San Francisco, CA 94105, États-Unis",
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
      legalConfig.professionalTax &&
      legalConfig.headquarters &&
      legalConfig.manager &&
      legalConfig.publicationDirector &&
      legalConfig.dataContact &&
      legalConfig.website &&
      legalConfig.hostName &&
      legalConfig.hostAddress,
  );
