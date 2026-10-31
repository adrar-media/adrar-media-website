import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security/policy";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Verrouille la racine du projet. Sans cela, Next remonte l'arborescence et
  // détecte le package.json/package-lock.json présents dans le dossier HOME
  // (projet tiers), ce qui polluerait le file tracing du build.
  outputFileTracingRoot: __dirname,
  images: {
    // AVIF/WebP servis automatiquement par next/image (cf. PROMPT §09).
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    /*
     * Aucun domaine distant n'est autorisé. `next/image` ne servira donc que
     * des fichiers de /public : une URL d'image fournie par une source
     * extérieure ne peut pas transformer l'optimiseur en relais ouvert.
     */
    remotePatterns: [],
    /* Un SVG distant est un document scriptable. Il n'en entre aucun. */
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [
      {
        /*
         * La politique s'applique à TOUT, y compris aux fichiers statiques.
         * Une politique posée sur les seules pages laisse le reste — images,
         * polices, manifeste — hors de sa portée.
         */
        source: "/:path*",
        headers: securityHeaders(),
      },
      {
        /*
         * Next gère le cache immuable de /_next/static. Les assets de /public
         * gardent des noms stables : revalidation après une heure pour que le
         * remplacement du logo ou des visuels soit visible après publication.
         */
        source: "/:path*.(woff2|webp|avif|png|jpg|jpeg|svg|ico|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
