import type { MetadataRoute } from "next";
import { defaultLocale } from "@/config/i18n";
import { siteConfig } from "@/config/site";

/**
 * Manifeste d'application web.
 *
 * Il ne s'agit pas d'en faire une application installable à part entière :
 * son rôle ici est d'assurer un ajout à l'écran d'accueil correct sur mobile —
 * icône de marque, nom lisible, couleur de barre — plutôt qu'une capture
 * d'écran tronquée et une URL brute.
 *
 * `start_url` pointe vers la racine et non vers une langue : le middleware
 * résout la langue à l'entrée, un raccourci figé sur /fr enfermerait un
 * visiteur anglophone ou arabophone dans le français.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F4F2EE",
    theme_color: "#0A2540",
    lang: defaultLocale,
    dir: "ltr",
    categories: ["business", "marketing", "design"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
