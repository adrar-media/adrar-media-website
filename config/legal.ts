import { contact } from "@/config/site";

const env = (key: string, fallback = ""): string =>
  process.env[key]?.trim() || fallback;

/** Identité réglementaire officielle communiquée par la direction. */
export const legalConfig = {
  tradeName: "Adrar Media",
  legalName: env("NEXT_PUBLIC_LEGAL_NAME", "ADRAR MEDIA"),
  legalForm: env(
    "NEXT_PUBLIC_LEGAL_FORM",
    "Société à Responsabilité Limitée à Associé Unique (SARL AU)",
  ),
  capital: env("NEXT_PUBLIC_SHARE_CAPITAL", "100 000 MAD"),
  tradeRegister: env("NEXT_PUBLIC_TRADE_REGISTER", "RC 2643 — Azrou"),
  taxId: env("NEXT_PUBLIC_TAX_ID", "73274886"),
  ice: env("NEXT_PUBLIC_ICE", "003988605000072"),
  professionalTax: env("NEXT_PUBLIC_PROFESSIONAL_TAX", "18605317"),
  headquarters: env(
    "NEXT_PUBLIC_REGISTERED_OFFICE",
    "N47, Nakhil 6, Azrou, Maroc",
  ),
  manager: env("NEXT_PUBLIC_MANAGER", "Kanoun Alaoui Yassine"),
  publicationDirector: env(
    "NEXT_PUBLIC_PUBLICATION_DIRECTOR",
    "Kanoun Alaoui Yassine",
  ),
  dataContact: env("NEXT_PUBLIC_DATA_CONTACT_EMAIL", contact.email),
  website: "https://adrar.media",
  hostName: env("NEXT_PUBLIC_HOST_NAME", "Netlify, Inc."),
  hostAddress: env(
    "NEXT_PUBLIC_HOST_ADDRESS",
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
