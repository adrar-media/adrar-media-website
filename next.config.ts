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
         * Empreintes de build dans les noms de fichiers : le contenu ne change
         * jamais sous une même URL, il peut donc être gardé un an. Next pose
         * déjà cet en-tête sur /_next/static ; la règle couvre les polices et
         * les visuels de /public, qui ne l'avaient pas et étaient revalidés à
         * chaque visite.
         */
        source: "/:path*.(woff2|webp|avif|png|jpg|jpeg|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
