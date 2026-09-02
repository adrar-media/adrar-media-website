import type { ServiceSlug } from "@/types";

/**
 * MANIFESTE DES VISUELS
 *
 * Source unique de vérité pour toutes les images éditoriales du site. Un
 * emplacement y est décrit une fois — fichier, proportions, cadrage, brief de
 * direction artistique — et chaque section se contente d'y faire référence par
 * son identifiant.
 *
 * Pourquoi un manifeste plutôt qu'un `<Image src="...">` posé dans chaque
 * page : les proportions et l'attribut `sizes` conditionnent le poids réellement
 * téléchargé sur mobile. Écrits au point d'appel, ils dérivent — une section
 * finit par servir une image de 1400 px dans un cadre de 380 px. Réunis ici,
 * ils se relisent d'un coup d'œil.
 *
 * Le champ `brief` ne sert pas au rendu : il est lu par
 * `scripts/generate-imagery.mjs`, qui produit les fichiers. Le garder à côté de
 * la définition de l'emplacement évite qu'une image soit régénérée un jour sur
 * une intention différente de celle pour laquelle le cadre a été dessiné.
 *
 * DEUX ZONES RESTENT VOLONTAIREMENT SANS IMAGE :
 *   — les vignettes de réalisations (components/portfolio/ProjectVisual.tsx),
 *     qui montreraient un travail client inventé ;
 *   — les portraits d'équipe (data/team.ts), qui montreraient des personnes
 *     qui n'existent pas.
 * Ces deux cadres gardent leur composition typographique. C'est la même règle
 * que le reste du site : on n'illustre pas ce qu'on ne peut pas prouver.
 */

export interface ImageSlot {
  /** Fichier servi : public/images/sections/<id>.webp */
  id: string;
  /** Proportions du cadre, en notation CSS `aspect-ratio`. */
  ratio: string;
  /** Largeur d'affichage déclarée au navigateur (attribut `sizes`). */
  sizes: string;
  /** Clé de texte alternatif dans common.json → `imagery.<clé>`. */
  altKey: string;
  /**
   * Brief de génération. Le préambule commun (palette, lumière, interdits)
   * est ajouté par le script : n'écrire ici que le sujet et le cadrage.
   */
  brief: string;
}

/**
 * LARGEURS RÉELLES D'AFFICHAGE
 *
 * `sizes` dit au navigateur quelle largeur l'image occupera, AVANT qu'il
 * connaisse la mise en page — c'est sur cette seule déclaration qu'il choisit
 * le fichier à télécharger. Une valeur trop généreuse ne se voit pas à
 * l'écran : elle se paie en octets, en silence.
 *
 * Ces valeurs ne sont pas estimées, elles sont MESURÉES au navigateur. La
 * version précédente déclarait une largeur par gabarit (`band`, `offset`,
 * `inline`), or « offset » recouvrait aussi bien une colonne de 4 sur 12
 * qu'une de 9 : toutes annonçaient 58vw, et le navigateur téléchargeait
 * 1920 px de large pour un cadre de 348 px — près de huit fois les pixels
 * réellement affichables.
 *
 * Le calcul de référence : le conteneur vaut `min(1400px, 100vw)` moins deux
 * fois la marge `gutter` (clamp(1.25rem, 8.3vw, 8.75rem)). Au-delà de 1400 px
 * de fenêtre la zone de contenu vaut donc 1120 à 1168 px, et en dessous
 * 100vw − 16,6vw = 83,4vw. Les colonnes s'en déduisent avec l'écart `grid`.
 */
export const SIZES = {
  /** Pleine largeur de la zone de contenu. Mesuré : 1124 px à 1660 px de fenêtre. */
  band: "(min-width: 1400px) 1168px, 83.4vw",
  /** Colonne de 9/12 plafonnée à 46rem par la composition. Mesuré : 736 px. */
  prose: "(min-width: 1024px) 736px, (min-width: 768px) 63vw, 83.4vw",
  /** 7 colonnes sur 12. Calculé : 639 px. */
  col7: "(min-width: 1024px) 640px, (min-width: 768px) 52vw, 83.4vw",
  /** 6 colonnes sur 12. Calculé : 542 px. */
  col6: "(min-width: 1024px) 545px, (min-width: 768px) 45vw, 83.4vw",
  /** 5 colonnes sur 12. Calculé : 445 px. */
  col5: "(min-width: 1024px) 450px, (min-width: 768px) 37vw, 83.4vw",
  /** 4 colonnes sur 12. Mesuré : 348 px. */
  col4: "(min-width: 1024px) 350px, (min-width: 768px) 29vw, 83.4vw",
  /** Entrée d'une grille de trois cartes, rembourrage déduit. Calculé : 268 px. */
  card: "(min-width: 1024px) 270px, (min-width: 640px) 38vw, 83.4vw",
} as const;

export type ImageWidth = keyof typeof SIZES;

function slot(
  id: string,
  ratio: string,
  width: ImageWidth,
  brief: string,
): ImageSlot {
  return { id, ratio, sizes: SIZES[width], altKey: id, brief };
}

/* -------------------------------------------------------------------------- */
/* Page d'accueil                                                             */
/* -------------------------------------------------------------------------- */

export const homeImagery = {
  /*
   * Le cadre du premier écran est VERTICAL, et ce n'est pas un choix de goût.
   *
   * L'image ne ferme plus la section sur toute sa largeur : elle tient la
   * colonne de droite, à côté du titre. Un 21/9 posé dans cinq colonnes ferait
   * 190 px de haut contre 480 px de texte à sa gauche — une bande perdue en
   * haut d'une colonne vide. Le 4/5 remplit la hauteur du bloc de texte et
   * rend la composition à deux colonnes lisible comme une seule image.
   *
   * Le brief est réécrit en conséquence : recadrer un panorama existant en
   * portrait n'en garde que le tiers central, où il n'y a par construction
   * aucune composition. Le sujet reste le même massif, cadré pour la hauteur.
   */
  hero: slot(
    "home-hero",
    "4/5",
    "col5",
    "Vertical shot of the Atlas foothills at first light, framed tall from a high plateau: ridgelines stacked from the foreground to the haze at the top, a single thin road tracing the valley floor in the lower third. Empty of people. Open sky fills the upper quarter.",
  ),
  intro: slot(
    "home-intro",
    "3/2",
    "prose",
    "Overhead view of a working strategy table: printed audience maps, a channel plan annotated in pencil, two coffee glasses, one forearm reaching across to move a card. Shot from directly above, faces out of frame.",
  ),
  services: slot(
    "home-services",
    "21/9",
    "band",
    "Interior of a working creative studio at dusk, seen wide: an edit bay glowing on the left, a lit product-shoot corner on the right, cables and c-stands between them. Two figures in silhouette against the monitors, unrecognisable.",
  ),
  /*
   * `why` ET `results` ONT ÉTÉ RETIRÉS DU MANIFESTE.
   *
   * Les deux sections qu'ils servaient ne montrent plus d'image : « Pourquoi
   * Adrar » est passée en frise verticale, et « Résultats » en graphique animé.
   * Aucune des deux ne s'illustrait — un principe et une mesure se lisent.
   *
   * Les entrées sont supprimées plutôt que laissées inertes : le manifeste est
   * ce que `scripts/generate-imagery.ts` parcourt, et une définition sans point
   * d'appel fait reproduire indéfiniment un fichier que plus rien ne sert.
   *
   * `public/images/sections/home-why.webp` et `home-results.webp` sont TOUJOURS
   * SUR LE DISQUE — ils ne sont simplement plus référencés. À supprimer à la
   * main le jour où il est acquis qu'aucune section ne les reprendra.
   */
} as const;

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export const servicesHero = slot(
  "services-hero",
    "16/9",
    "band",
  "Seven printed briefs fanned across a large table in a single row, each open to a different spread, shot from a low three-quarter angle so the row recedes. Morning window light from the left.",
);

/** Une image par page de service, indexée par le slug d'URL. */
export const serviceImagery: Record<ServiceSlug, ImageSlot> = {
  "strategie-marketing": slot(
    "service-strategie-marketing",
    "16/9",
    "band",
    "A wall-sized plan in progress: a quarterly timeline drawn across brown paper, coloured tags marking phases, a hand mid-way through placing one. Room reads as a workshop, not an office.",
  ),
  "social-media": slot(
    "service-social-media",
    "16/9",
    "band",
    "A grid of nine vertical phone-format frames laid out on a light table, each holding a different composition, arranged for review. Shot from above, one hand reordering two of them.",
  ),
  "creation-contenu": slot(
    "service-creation-contenu",
    "16/9",
    "band",
    "A small tabletop set being built: a product on a beige riser, a diffuser panel catching the light, a camera on a low tripod just entering frame at the edge. Warm practical lighting.",
  ),
  branding: slot(
    "service-branding",
    "16/9",
    "band",
    "Brand system laid out flat: paper swatches in deep navy, warm beige and green, three weights of a typeface printed large, a folded stationery mock-up. All lettering abstract and illegible.",
  ),
  "production-audiovisuelle": slot(
    "service-production-audiovisuelle",
    "16/9",
    "band",
    "A film set between takes: cinema camera on a fluid head facing an empty lit set, a large soft source glowing off to one side, crew as silhouettes at the back of the room.",
  ),
  "publicite-digitale": slot(
    "service-publicite-digitale",
    "16/9",
    "band",
    "Two screens side by side on a desk showing an ad-account view and a rising performance curve, a notebook of hand-written figures in the foreground. Screen content abstract, no readable text.",
  ),
  web: slot(
    "service-web",
    "16/9",
    "band",
    "A responsive layout being checked across three devices lined up on a desk — laptop, tablet, phone — each showing the same abstract page at a different width. Wireframe sketches beside them.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Méthode — une image par étape                                              */
/* -------------------------------------------------------------------------- */

export const methodHero = slot(
  "method-hero",
    "16/9",
    "band",
  "A six-column process wall: six sheets pinned in a row, each denser than the last, a figure stepping back to look at the whole. Seen from behind, at a distance.",
);

export const methodImagery: Record<string, ImageSlot> = {
  discover: slot(
    "method-discover",
    "4/3",
    "col7",
    "An interview in progress at a small table: a recorder between two people, a notebook filling with shorthand, hands only. Quiet, close, natural light.",
  ),
  strategize: slot(
    "method-strategize",
    "4/3",
    "col7",
    "A single sheet of paper with a positioning statement written by hand, surrounded by discarded earlier drafts crossed out. Overhead, warm desk lamp.",
  ),
  create: slot(
    "method-create",
    "4/3",
    "col7",
    "A retouching workstation mid-session: a colour-graded frame on a calibrated monitor, a graphics tablet and pen in use, the room dim around it.",
  ),
  distribute: slot(
    "method-distribute",
    "4/3",
    "col7",
    "A publishing calendar on screen with slots filled across a month, a phone beside it showing a post going live. Shot at a slight angle, content abstract.",
  ),
  optimize: slot(
    "method-optimize",
    "4/3",
    "col7",
    "A printed performance report with two variants compared side by side, one circled in green pencil, the pencil still resting on the page.",
  ),
  scale: slot(
    "method-scale",
    "4/3",
    "col7",
    "A wide window view over a Moroccan city at dusk from a working floor, a desk in the foreground with the day's work still open on it.",
  ),
};

/* -------------------------------------------------------------------------- */
/* À propos                                                                    */
/* -------------------------------------------------------------------------- */

export const aboutImagery = {
  name: slot(
    "about-name",
    "4/3",
    "col7",
    "A lone peak of the High Atlas in flat afternoon light, snow on the upper third, foreground scree in warm ochre. No people, no structures.",
  ),
  story: slot(
    "about-story",
    "4/3",
    "col7",
    "A modest first workspace: two desks pushed together, a window, a plant, equipment cases stacked against the wall. Lived-in rather than styled. Empty of people.",
  ),
  values: slot(
    "about-values",
    "16/9",
    "band",
    "Detail of hands and a workbench: a stack of printed proofs being squared up, one sheet held to the light for checking. Shallow depth, warm neutral tones.",
  ),
} as const;

/* -------------------------------------------------------------------------- */
/* Solutions                                                                   */
/* -------------------------------------------------------------------------- */

export const solutionsHero = slot(
  "solutions-hero",
    "16/9",
    "band",
  "Three folders of differing thickness laid in a row on a clean surface, each tabbed with a coloured marker, the thinnest nearest camera. Even overhead light.",
);

export const solutionsImagery: Record<string, ImageSlot> = {
  launch: slot(
    "solutions-pack-launch",
    "3/2",
    "card",
    "A single sheet of paper on a clean desk, one line written at the top, pen resting across it. Wide margins, a great deal of empty surface.",
  ),
  growth: slot(
    "solutions-pack-growth",
    "3/2",
    "card",
    "A month wall-planner filled with coloured markers, roughly two thirds complete, a hand adding the next block.",
  ),
  project: slot(
    "solutions-pack-project",
    "3/2",
    "card",
    "A production case open on a floor, lenses and cards in foam, one slot empty where a lens has just been taken out.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Contact, blog, devis                                                        */
/* -------------------------------------------------------------------------- */

export const contactImage: ImageSlot = {
  id: "contact-azrou",
  ratio: "4/3",
  sizes: SIZES.col6,
  // La traduction existante décrit un paysage marocain sans identifier un lieu précis.
  altKey: "contact",
  brief:
    "Editorial Middle Atlas landscape inspired by Azrou: cedar forest, layered ridges and a winding road. Illustrative rather than documentary; no office or specific landmark claim.",
};

export const blogImage = slot(
  "blog",
    "16/9",
    "band",
  "A closed notebook and a fountain pen on a bare table, a shaft of window light across the cover. Nothing written yet.",
);

export const quoteImage = slot(
  "quote",
    "4/3",
    "col4",
  "A short printed brief on a table with a pen laid diagonally across it, a phone face-down beside it. Calm, uncluttered, warm daylight.",
);

/* -------------------------------------------------------------------------- */
/* Inventaire complet                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Tous les emplacements, à plat.
 *
 * Sert au script de production (`scripts/generate-imagery.ts`) et à rien
 * d'autre : les sections lisent l'entrée qui les concerne, jamais la liste.
 * L'ordre est celui du parcours du site, pour qu'une production interrompue
 * remplisse d'abord les pages les plus vues.
 */
export const allImageSlots: ImageSlot[] = [
  homeImagery.hero,
  homeImagery.intro,
  homeImagery.services,
  servicesHero,
  ...Object.values(serviceImagery),
  methodHero,
  ...Object.values(methodImagery),
  aboutImagery.name,
  aboutImagery.story,
  aboutImagery.values,
  solutionsHero,
  ...Object.values(solutionsImagery),
  contactImage,
  blogImage,
  quoteImage,
];
