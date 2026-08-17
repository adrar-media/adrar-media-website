import type { NextConfig } from "next";

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
    deviceSizes: [320, 375, 390, 640, 768, 1024, 1280, 1440, 1920],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
