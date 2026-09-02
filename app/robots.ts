import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * Tout est ouvert à l'indexation sauf ce qui n'a pas vocation à l'être :
 * le guide de style interne, et les routes techniques de Next.
 *
 * La ligne Sitemap n'est écrite que si le domaine est connu — une adresse
 * relative y est invalide et fait ignorer la directive entière.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Les fichiers `/_next/` contiennent le CSS et le JavaScript nécessaires
      // au rendu. Les bloquer empêcherait les moteurs de voir la page comme un
      // visiteur. Seules les routes sans valeur publique restent fermées.
      disallow: ["/api/", "/*/styleguide"],
    },
    ...(siteConfig.url
      ? {
          sitemap: absoluteUrl("/sitemap.xml"),
          host: siteConfig.url.replace(/^https?:\/\//, ""),
        }
      : {}),
  };
}
