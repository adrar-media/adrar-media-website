/**
 * PRODUCTION DES VISUELS ÉDITORIAUX
 *
 * Lit le manifeste (`data/imagery.ts`) et produit les fichiers manquants dans
 * public/images/sections/ via l'API Gemini (Nano Banana 2).
 *
 *   node scripts/generate-imagery.ts              # produit ce qui manque
 *   node scripts/generate-imagery.ts --dry-run    # affiche les prompts, n'appelle rien
 *   node scripts/generate-imagery.ts --only home-hero,about-name
 *   node scripts/generate-imagery.ts --force      # régénère même si le fichier existe
 *
 * Clé : GEMINI_API_KEY (ou GOOGLE_AI_API_KEY, GOOGLE_API_KEY). Gratuite sur
 * https://aistudio.google.com/apikey
 *
 * POURQUOI UN SCRIPT ET NON DES APPELS À LA MAIN
 *
 * Trente visuels doivent partager une direction artistique pour se lire comme
 * une série et non comme trente images achetées séparément. Le préambule de
 * style ci-dessous est donc écrit une fois et appliqué à tous ; seul le sujet
 * change d'un emplacement à l'autre. Régénérer une image isolée six mois plus
 * tard la remettra dans la même lumière que les autres.
 *
 * Le script est volontairement séquentiel : le palier gratuit tourne autour de
 * 5 à 15 requêtes par minute, et une rafale de trente appels parallèles se
 * ferait rejeter avant la moitié.
 */

import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import sharp from "sharp";
import { allImageSlots, type ImageSlot } from "../data/imagery.ts";

const MODEL = "gemini-3.1-flash-image-preview";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const RESOLUTION = "2K";
const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "sections");

/** Marge entre deux appels, pour rester sous le débit du palier gratuit. */
const THROTTLE_MS = 7_000;

/**
 * COMPOSANTE 5 — STYLE, commune à toute la série.
 *
 * Elle porte trois choses : le registre photographique, la palette de la
 * marque, et les trois interdits qui font la différence entre une image
 * illustrative et une image qui prétendrait documenter quelque chose de faux.
 *
 * Les interdits sont écrits en formulation positive et en capitales, seule
 * forme que le modèle suit de façon fiable — il n'existe pas de prompt négatif
 * dans cette API.
 */
const STYLE = [
  "Shot on a Leica Q3 with natural color science, soft directional daylight,",
  "shallow depth of field, quiet documentary register in the manner of Magnum Photos.",
  "The palette stays muted and warm: deep navy shadows, warm beige and ochre midtones,",
  "a single restrained green accent, never saturated.",
  "The frame is calm and uncluttered, with generous empty space and one clear subject.",
  "NEVER include any text, lettering, signage, logos, watermarks or user-interface labels —",
  "any writing that appears MUST be abstract, out of focus and illegible.",
  "NEVER show a recognisable human face: people appear only as hands, forearms,",
  "backs, or distant silhouettes.",
].join(" ");

/** Le manifeste écrit `16/9` (CSS), l'API attend `16:9`. */
function apiRatio(ratio: string): string {
  return ratio.replace("/", ":");
}

function buildPrompt(slot: ImageSlot): string {
  return `${slot.brief}\n\n${STYLE}`;
}

interface Args {
  dryRun: boolean;
  force: boolean;
  only: Set<string> | null;
}

function parseArgs(argv: string[]): Args {
  const only = argv.find((a) => a.startsWith("--only="));
  const onlyIndex = argv.indexOf("--only");
  const list =
    only?.slice("--only=".length) ??
    (onlyIndex >= 0 ? argv[onlyIndex + 1] : undefined);

  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    only: list ? new Set(list.split(",").map((s) => s.trim())) : null,
  };
}

/** Vrai si un fichier de ce nom existe déjà, quelle que soit son extension. */
function alreadyProduced(id: string): boolean {
  if (!fs.existsSync(OUTPUT_DIR)) return false;
  return fs
    .readdirSync(OUTPUT_DIR)
    .some((file) => path.basename(file, path.extname(file)) === id);
}

interface GeminiPart {
  inlineData?: { data: string; mimeType?: string };
  text?: string;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
}

async function callGemini(
  prompt: string,
  ratio: string,
  apiKey: string,
): Promise<Buffer> {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: { aspectRatio: ratio, imageSize: RESOLUTION },
    },
  };

  // Trois tentatives : le palier gratuit renvoie 429 dès qu'on le serre un peu.
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(`${API_BASE}/${MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      if (attempt === 3) throw new Error("débit dépassé après 3 tentatives");
      const wait = 2 ** attempt * 5_000;
      console.log(`      débit dépassé, nouvelle tentative dans ${wait / 1000} s`);
      await sleep(wait);
      continue;
    }

    if (!response.ok) {
      const detail = await response.text();
      if (response.status === 400 && detail.includes("FAILED_PRECONDITION")) {
        throw new Error(
          "facturation non activée sur le projet Google — https://aistudio.google.com/apikey",
        );
      }
      throw new Error(`HTTP ${response.status} — ${detail.slice(0, 300)}`);
    }

    const result = (await response.json()) as GeminiResponse;
    const candidate = result.candidates?.[0];
    const part = candidate?.content?.parts?.find((p) => p.inlineData?.data);

    if (!part?.inlineData) {
      const reason =
        candidate?.finishReason ?? result.promptFeedback?.blockReason ?? "inconnue";
      throw new Error(`aucune image renvoyée (raison : ${reason})`);
    }

    return Buffer.from(part.inlineData.data, "base64");
  }

  throw new Error("épuisement des tentatives");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // Trois noms acceptés : `GEMINI_API_KEY` est celui qu'affiche AI Studio,
  // les deux autres sont ceux qu'emploient les outils Google existants. Faire
  // deviner le bon nom à celui qui reprend le script serait une perte de temps.
  const apiKey =
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_AI_API_KEY ??
    process.env.GOOGLE_API_KEY;

  if (!apiKey && !args.dryRun) {
    console.error(
      "GEMINI_API_KEY absente.\n" +
        "  Clé gratuite : https://aistudio.google.com/apikey\n" +
        "  Puis : GEMINI_API_KEY=… node scripts/generate-imagery.ts\n" +
        "  (--dry-run affiche les prompts sans clé)",
    );
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const queue = allImageSlots.filter((slot) => {
    if (args.only && !args.only.has(slot.id)) return false;
    if (!args.force && alreadyProduced(slot.id)) {
      console.log(`  ⏭  ${slot.id} — déjà produit`);
      return false;
    }
    return true;
  });

  if (queue.length === 0) {
    console.log("\nRien à produire.");
    return;
  }

  console.log(`\n${queue.length} visuel(s) à produire — modèle ${MODEL}\n`);

  let done = 0;
  const failures: { id: string; reason: string }[] = [];

  for (const [index, slot] of queue.entries()) {
    const label = `[${index + 1}/${queue.length}] ${slot.id} (${slot.ratio})`;

    if (args.dryRun) {
      console.log(`${label}\n${buildPrompt(slot)}\n${"─".repeat(72)}`);
      continue;
    }

    process.stdout.write(`${label} … `);
    try {
      const raw = await callGemini(
        buildPrompt(slot),
        apiRatio(slot.ratio),
        apiKey!,
      );

      // WebP à la place du PNG renvoyé par l'API : même image, environ un
      // cinquième du poids. next/image redérivera l'AVIF à la demande.
      const target = path.join(OUTPUT_DIR, `${slot.id}.webp`);
      await sharp(raw).webp({ quality: 82 }).toFile(target);

      const size = (fs.statSync(target).size / 1024).toFixed(0);
      console.log(`ok (${size} Ko)`);
      done++;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.log(`échec — ${reason}`);
      failures.push({ id: slot.id, reason });
    }

    if (index < queue.length - 1) await sleep(THROTTLE_MS);
  }

  if (args.dryRun) return;

  console.log(`\n${done} produit(s), ${failures.length} en échec.`);
  for (const failure of failures) {
    console.log(`  ✗ ${failure.id} — ${failure.reason}`);
  }
  if (failures.length > 0) {
    console.log(
      "\nRelancer les échecs :\n  node scripts/generate-imagery.ts --only " +
        failures.map((f) => f.id).join(","),
    );
    process.exitCode = 1;
  }
}

await main();
