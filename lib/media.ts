import fs from "node:fs";
import path from "node:path";

/**
 * Résolution des fichiers d'images éditoriales.
 *
 * `data/imagery.ts` décrit des emplacements ; ce module dit lesquels sont
 * réellement remplis. Le site doit rester publiable avant que les visuels
 * soient produits : un cadre dont le fichier manque rend une composition
 * typographique au lieu d'une image cassée, exactement comme les vignettes de
 * réalisations. Aucune section ne s'effondre, aucune requête ne part vers un
 * fichier absent.
 *
 * La lecture du dossier est mémorisée en production, où tout est statique :
 * elle a lieu au build, jamais à la requête. En développement elle est refaite
 * à chaque rendu — sans quoi un visuel qui vient d'être produit n'apparaîtrait
 * qu'après un redémarrage du serveur, puisque le processus aurait mémorisé un
 * dossier encore vide. Une lecture de dossier par rendu ne coûte rien à côté
 * de la recompilation qui l'accompagne.
 */

const DIRECTORY = path.join(process.cwd(), "public", "images", "sections");

/** Ordre de préférence : le format le plus léger d'abord. */
const EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

let index: Map<string, string> | null = null;

function buildIndex(): Map<string, string> {
  const found = new Map<string, string>();

  let files: string[];
  try {
    files = fs.readdirSync(DIRECTORY);
  } catch {
    // Le dossier n'existe pas encore : aucun visuel produit, ce n'est pas une
    // erreur. Tous les cadres rendront leur état d'attente.
    return found;
  }

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (!EXTENSIONS.includes(extension)) continue;

    const id = path.basename(file, extension);
    const current = found.get(id);
    // À identifiant égal, on garde le format le mieux placé dans EXTENSIONS.
    if (
      !current ||
      EXTENSIONS.indexOf(extension) <
        EXTENSIONS.indexOf(path.extname(current).toLowerCase())
    ) {
      found.set(id, file);
    }
  }

  return found;
}

/**
 * Chemin public du visuel, ou `null` s'il n'a pas encore été produit.
 * Le `null` est une réponse attendue, pas un cas d'erreur.
 */
export function imageSrc(id: string): string | null {
  if (process.env.NODE_ENV !== "production") {
    const file = buildIndex().get(id);
    return file ? `/images/sections/${file}` : null;
  }

  index ??= buildIndex();
  const file = index.get(id);
  return file ? `/images/sections/${file}` : null;
}

/**
 * Aplat de couleur affiché pendant le décodage, en base64.
 *
 * Un seul pixel du bleu profond de la marque, étiré par le navigateur. Cela
 * évite le rectangle blanc qui clignote avant l'arrivée de l'image, sans
 * embarquer une miniature par visuel : la teinte est commune à toutes, elle
 * n'a pas besoin d'être calculée fichier par fichier.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#12335620"/></svg>',
  ).toString("base64");
