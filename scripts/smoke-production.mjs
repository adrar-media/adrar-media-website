import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";

const require = createRequire(import.meta.url);
const approvals = JSON.parse(readFileSync(new URL("../config/project-media-approvals.json", import.meta.url), "utf8"));
const port = process.env.SMOKE_PORT || "3310";
const base = `http://localhost:${port}`;
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "-H", "localhost", "-p", port], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NODE_ENV: "production" },
});
let output = "";
server.stdout.on("data", (data) => { output = (output + data).slice(-5000); });
server.stderr.on("data", (data) => { output = (output + data).slice(-5000); });
const get = async (path, options) => {
  try {
    return await fetch(`${base}${path}`, { redirect: "manual", signal: AbortSignal.timeout(15000), ...options });
  } catch (error) {
    throw new Error(`Requête en échec : ${path}`, { cause: error });
  }
};

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Serveur arrêté : ${output}`);
    if (output.includes("Ready in")) { ready = true; break; }
    await setTimeout(100);
  }
  assert.ok(ready, "Le serveur doit démarrer");
  const sitemap = await get("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  assert.ok(urls.length > 0, "Le sitemap ne doit pas être vide");
  for (let offset = 0; offset < urls.length; offset += 6) {
    await Promise.all(urls.slice(offset, offset + 6).map(async (url) => {
      const response = await get(url.pathname);
      assert.equal(response.status, 200, `${url.pathname} → ${response.headers.get("location")}`);
      const html = await response.text();
      assert.ok(html.includes(`rel="canonical" href="${url.href}"`), `Canonique : ${url.pathname}`);
      assert.ok(!/CONTENT_REQUIRED|IMAGE_REQUIRED|DATA_REQUIRED/.test(html), `Marqueur public : ${url.pathname}`);
      if (url.pathname.startsWith("/ar")) assert.match(html, /dir="rtl"/);
      assert.ok(response.headers.has("content-security-policy"), `CSP : ${url.pathname}`);
    }));
  }
  const robots = await (await get("/robots.txt")).text();
  assert.ok(robots.includes(`${urls[0].origin}/sitemap.xml`));
  for (const path of ["/fr/styleguide", "/en/styleguide", "/ar/styleguide", "/fr/page-absente", "/en/work/projet-absent"]) {
    assert.equal((await get(path)).status, 404, path);
  }
  assert.equal((await get("/en/realisations", { redirect: "manual" })).status, 308);
  const home = await (await get("/fr")).text();
  assert.ok(home.includes("https://wa.me/212663070561"));
  assert.ok(home.includes("mailto:contact@adrar.media"));
  if (!Object.values(approvals).some((reference) => reference.trim())) {
    assert.ok(!home.includes('src="/images/projects/'), "Pas de média client sans accord enregistré");
  }
  for (const [slug, path] of [
    ["bricodi-pro", "/images/projects/bricodi-pro-logo.jpg"],
    ["bricodi-pro", "/images/projects/bricodi-pro/gallery/01.jpg"],
    ["zenori-cafe", "/images/projects/zenori-cafe/videos/match-day.mp4"],
    ["bricodi-pro", "/_next/image?url=%2Fimages%2Fprojects%2Fbricodi-pro-logo.jpg&w=256&q=75"],
  ]) {
    assert.equal((await get(path)).status, approvals[slug]?.trim() ? 200 : 404, `Accord média : ${path}`);
  }
  console.log(`OK : ${urls.length} URL du sitemap, canoniques, RTL, CSP, robots, redirection, 404, contacts et accords médias.`);
  console.log("La réception email, les DNS et le consentement interactif nécessitent encore une recette dédiée.");
} finally {
  server.kill("SIGTERM");
}
