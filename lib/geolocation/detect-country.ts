/**
 * DÉTECTION DU PAYS — par en-tête de requête, jamais par GPS.
 *
 * Les plateformes d'hébergement modernes résolvent l'IP en code pays en amont
 * et le transmettent en en-tête. On lit cet en-tête : aucun appel réseau, donc
 * aucune latence ajoutée au rendu, et aucune adresse IP manipulée ni stockée.
 * Seul un code pays sur deux lettres transite — jamais de position précise.
 *
 * Si aucun en-tête n'est présent (développement local, hébergeur sans
 * géolocalisation), la fonction renvoie null et la résolution de langue
 * bascule immédiatement sur l'en-tête Accept-Language.
 */

/** En-têtes consultés, par ordre de priorité, selon la plateforme. */
const COUNTRY_HEADERS = [
  "x-vercel-ip-country", // Vercel
  "cf-ipcountry", // Cloudflare
  "x-country-code", // proxys courants
  "x-geo-country",
  "fastly-client-country-code", // Fastly
] as const;

export function detectCountry(headers: Headers): string | null {
  for (const header of COUNTRY_HEADERS) {
    const value = headers.get(header)?.trim().toUpperCase();
    // Cloudflare renvoie "XX" pour une IP non localisable.
    if (value && value.length === 2 && value !== "XX") return value;
  }
  return null;
}

/**
 * Première langue de l'en-tête Accept-Language reconnue par le site.
 * "fr-FR,fr;q=0.9,en;q=0.8" → "fr"
 */
export function parseAcceptLanguage(
  header: string | null,
  supported: readonly string[],
): string | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1] ?? "0") : 1;
      return { tag: (tag ?? "").trim().toLowerCase(), quality };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (base && supported.includes(base)) return base;
  }
  return null;
}
