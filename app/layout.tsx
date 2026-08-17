import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Layout racine — squelette de PHASE 02.
 * La typographie définitive, la Navbar et le Footer arrivent en PHASE 05/06.
 * Les métadonnées SEO complètes (canonical, OG, structured data) sont
 * finalisées en PHASE 12, une fois le domaine de production confirmé.
 */
export const metadata: Metadata = {
  title: {
    default: "Adrar Media — From Local to Global.",
    template: "%s | Adrar Media",
  },
  description:
    "Nous transformons les marques et entreprises en expériences digitales capables d'attirer, convaincre et convertir.",
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
