/**
 * GÉNÉRATION DES VISUELS DE MARQUE
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Produit, à partir du seul fichier source `public/brand/adrar-media-mark.svg` :
 *   • app/apple-icon.png            — icône iOS (180 px)
 *   • public/icons/icon-192.png     — manifeste web
 *   • public/icons/icon-512.png     — manifeste web et image de partage
 *   • public/brand/og-image-{fr,en,ar}.png — visuels Open Graph (1200 × 630)
 *
 * Ces fichiers sont versionnés : le script sert à les refaire quand la marque
 * ou l'accroche change, pas à chaque build. Un build ne doit pas dépendre du
 * rendu d'images — c'est lent, et cela casse le jour où la police manque.
 *
 * `sharp` est déjà présent (Next l'utilise pour l'optimisation d'images) :
 * aucune dépendance n'est ajoutée pour ce script.
 *
 * Les polices utilisées pour l'Open Graph sont celles du système. Archivo,
 * la police du site, n'est pas installée localement ; Helvetica Neue en est
 * le plus proche parent disponible et la différence n'est pas perceptible à
 * l'échelle d'une vignette de partage.
 */
import { createRequire } from "node:module";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LATIN = "Helvetica Neue, Helvetica, Arial, sans-serif";
const ARABIC = "Geeza Pro, Al Nile, Baghdad, Helvetica, sans-serif";

const markSvg = readFileSync(join(ROOT, "public/brand/adrar-media-mark.svg"));

const icons = [
  ["app/apple-icon.png", 180],
  ["public/icons/icon-192.png", 192],
  ["public/icons/icon-512.png", 512],
];

/** Accroche de partage, par langue. Volontairement courte : deux lignes maximum. */
const cards = {
  fr: {
    lines: ["Stratégie, contenu et", "publicité digitale."],
    foot: "Agence de communication — Maroc",
    font: LATIN,
    rtl: false,
  },
  en: {
    lines: ["Strategy, content and", "digital advertising."],
    foot: "Communication agency — Morocco",
    font: LATIN,
    rtl: false,
  },
  ar: {
    lines: ["استراتيجية ومحتوى", "وإعلانات رقمية."],
    foot: "وكالة تواصل — المغرب",
    font: ARABIC,
    rtl: true,
  },
};

const card = ({ lines, foot, font, rtl }) => {
  const x = rtl ? 1120 : 80;
  const ruleX = rtl ? 1024 : 80;
  const footX = rtl ? 1000 : 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0%" stop-color="#3ED598" stop-opacity="0.20"/>
    <stop offset="100%" stop-color="#3ED598" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="1200" height="630" fill="#0A2540"/>
  <circle cx="1080" cy="90" r="380" fill="url(#halo)"/>
  <g font-family="${LATIN}">
    <text x="196" y="106" fill="#FFFFFF" font-size="40" font-weight="600" letter-spacing="-0.5">Adrar Media</text>
    <text x="197" y="146" fill="#3ED598" font-size="23" letter-spacing="0.5">From Local to Global.</text>
  </g>
  <g font-family="${font}" text-anchor="${rtl ? "end" : "start"}">
    <text x="${x}" y="392" fill="#FFFFFF" font-size="${rtl ? 60 : 66}" font-weight="600" letter-spacing="${rtl ? 0 : -2}">${lines[0]}</text>
    <text x="${x}" y="${rtl ? 478 : 466}" fill="#FFFFFF" font-size="${rtl ? 60 : 66}" font-weight="600" letter-spacing="${rtl ? 0 : -2}">${lines[1]}</text>
    <rect x="${ruleX}" y="530" width="96" height="4" fill="#3ED598"/>
    <text x="${footX}" y="540" fill="#FFFFFF" fill-opacity="0.72" font-size="25">${foot}</text>
  </g>
</svg>`;
};

const kb = (path) => `${(statSync(path).size / 1024).toFixed(0)} ko`;

for (const [target, size] of icons) {
  const path = join(ROOT, target);
  await sharp(markSvg, { density: 400 }).resize(size, size).png().toFile(path);
  console.log(`${target} — ${kb(path)}`);
}

const mark = await sharp(join(ROOT, "public/icons/icon-512.png"))
  .resize(96, 96)
  .png()
  .toBuffer();

for (const [locale, content] of Object.entries(cards)) {
  const background = await sharp(Buffer.from(card(content)), { density: 200 })
    .resize(1200, 630)
    .png()
    .toBuffer();
  const target = `public/brand/og-image-${locale}.png`;
  const path = join(ROOT, target);
  await sharp(background)
    .composite([{ input: mark, top: 44, left: 80 }])
    .png({ compressionLevel: 9 })
    .toFile(path);
  console.log(`${target} — ${kb(path)}`);
}
