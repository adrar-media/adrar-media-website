import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

/**
 * Archivo — grotesque variable. Retenue pour ses capitales larges et ses
 * apex nets, qui prolongent le lettrage du logo "ADRAR". Une seule famille
 * pour tout le site : cohérence maximale, poids réseau minimal.
 * next/font l'auto-héberge — aucune requête vers un domaine tiers.
 * Pour changer de typographie, ce fichier est le seul point d'entrée.
 */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
