import type { ReactNode } from "react";
import { createElement as h } from "react";

/**
 * LES SIX DESSINS D'EN-TÊTE.
 *
 * Ce fichier ne contient que de la géométrie. Le mouvement, la parallaxe et
 * les garde-fous vivent dans `HeaderField.tsx` : séparer les deux permet
 * d'ajouter un dessin sans toucher à une seule ligne d'animation, et de régler
 * l'animation sans relire six cents coordonnées.
 *
 * TOUT EST TRACÉ SUR LA MÊME GRILLE 600 × 600, au trait, sans remplissage et
 * sans couleur propre : la couleur vient de `currentColor`, donc du parent, et
 * chaque page peut la teinter sans que le dessin le sache.
 *
 * CHAQUE DESSIN DIT CE QUE SA PAGE DIT. Un décor interchangeable serait un
 * fond d'écran ; celui-ci est la même idée que le texte, exprimée d'une autre
 * façon :
 *
 *   about      des courbes de niveau — « Adrar » est la montagne en amazigh,
 *              et les anneaux s'ouvrent du plus petit au plus grand, ce qui
 *              est « from local to global » exécuté plutôt qu'écrit.
 *   method     un chemin qui monte, jalonné de six points — les six étapes,
 *              dans l'ordre, une seule voie.
 *   services   sept arcs concentriques de portée croissante — les sept
 *              métiers, distincts et centrés sur le même point.
 *   solutions  trois cadres emboîtés et décalés — des dispositifs qui
 *              s'assemblent, pas une prestation isolée.
 *   work       quatre cadres en enfilade — une suite de réalisations vue en
 *              perspective.
 *   contact    des ondes ouvertes depuis un point bas — un signal qui part.
 *
 * LES COORDONNÉES SONT ÉCRITES OU CALCULÉES, JAMAIS TIRÉES AU SORT. Un décor
 * doit être identique à chaque chargement : `Math.random()` donnerait un
 * dessin sur le serveur et un autre à l'hydratation, et React signalerait la
 * différence.
 */

export type FieldVariant =
  | "about"
  | "method"
  | "services"
  | "solutions"
  | "work"
  | "contact";

/**
 * Une couche du dessin.
 *
 * `depth` est le seul réglage de la parallaxe : la couche se déplace de
 * `depth` fois l'amplitude de base quand le curseur bouge. Les couches
 * lointaines portent les petites valeurs, les proches les grandes — c'est
 * l'écart entre elles qui crée le relief, pas leur valeur absolue.
 */
export interface FieldLayer {
  depth: number;
  nodes: ReactNode;
}

const C = 300;
/** Constante d'approximation d'un cercle par quatre cubiques de Bézier. */
const K = 0.5523;

/**
 * LIMITE DROITE UTILE DE LA GRILLE.
 *
 * Le cadre déborde volontairement d'un tiers de sa largeur hors de l'écran
 * (voir `HeaderField`), ce qui coupe la grille aux alentours de x = 400. Pour
 * un dessin radial centré, la coupe passe inaperçue : on voit le cœur et les
 * anneaux se perdent au bord, ce qui est l'effet recherché.
 *
 * Pour un dessin ORIENTÉ, elle est destructrice. Le chemin de la méthode monte
 * vers son sixième jalon ; posé jusqu'à x = 540, ce jalon — le but du dessin —
 * tombait hors champ, et il ne restait à l'écran qu'un bout de trait montant
 * vers rien. Les dessins directionnels tiennent donc dans cette limite.
 */
const EDGE = 400;

/** Marque un élément comme traçable — voir le tracé d'entrée dans `HeaderField`. */
const drawable = { "data-field-draw": "" } as const;

const stroke = (extra: Record<string, unknown> = {}) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  /*
   * Le trait garde son épaisseur quel que soit l'agrandissement du cadre.
   * Sans cela, un SVG affiché à 700 px de large épaissit ses courbes autant
   * que le reste et le décor passe du crayon au feutre.
   */
  vectorEffect: "non-scaling-stroke" as const,
  ...extra,
});

/* ---------------------------------------------------------------------------
 * Générateurs
 * ------------------------------------------------------------------------- */

/**
 * Courbe fermée, lisse et volontairement irrégulière.
 *
 * Les quatre multiplicateurs déforment le rayon aux points cardinaux : c'est
 * ce qui distingue une courbe de niveau d'un rond.
 */
function contour(radius: number, wobble: [number, number, number, number]) {
  const [we, ws, ww, wn] = wobble;
  const e = radius * we;
  const s = radius * ws;
  const w = radius * ww;
  const n = radius * wn;
  return [
    `M ${C + e} ${C}`,
    `C ${C + e} ${C + e * K}, ${C + s * K} ${C + s}, ${C} ${C + s}`,
    `C ${C - s * K} ${C + s}, ${C - w} ${C + w * K}, ${C - w} ${C}`,
    `C ${C - w} ${C - w * K}, ${C - n * K} ${C - n}, ${C} ${C - n}`,
    `C ${C + n * K} ${C - n}, ${C + e} ${C - e * K}, ${C + e} ${C}`,
    "Z",
  ].join(" ");
}

/** Arc de cercle, angles en degrés, 0° à l'est et sens horaire. */
function arc(
  cx: number,
  cy: number,
  radius: number,
  from: number,
  to: number,
): string {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(rad(from));
  const y1 = cy + radius * Math.sin(rad(from));
  const x2 = cx + radius * Math.cos(rad(to));
  const y2 = cy + radius * Math.sin(rad(to));
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const path = (d: string, opacity: number) =>
  h("path", { key: d, ...drawable, d, ...stroke({ strokeOpacity: opacity }) });

const mark = (cx: number, cy: number, r: number, delay: string) =>
  h("circle", {
    key: `m-${cx}-${cy}`,
    cx,
    cy,
    r,
    fill: "currentColor",
    fillOpacity: 0.5,
    className: "animate-dot-pulse",
    style: { transformOrigin: `${cx}px ${cy}px`, animationDelay: delay },
  });

/* ---------------------------------------------------------------------------
 * Les dessins
 * ------------------------------------------------------------------------- */

const ABOUT_RINGS: [number, [number, number, number, number], number][] = [
  [48, [1.0, 0.92, 1.06, 0.97], 0.55],
  [96, [1.05, 0.95, 0.98, 1.04], 0.45],
  [148, [0.96, 1.05, 1.03, 0.94], 0.36],
  [202, [1.04, 0.97, 0.95, 1.05], 0.27],
  [258, [0.97, 1.03, 1.05, 0.96], 0.18],
];

/** Le chemin de la méthode et ses six jalons. */
const METHOD_PATH =
  "M 60 460 C 88 460, 104 436, 128 424 C 160 408, 174 400, 196 388 C 232 370, 242 358, 264 340 C 300 312, 314 296, 332 272 C 364 234, 382 212, 400 190";
const METHOD_STOPS: [number, number][] = [
  [60, 460],
  [128, 424],
  [196, 388],
  [264, 340],
  [332, 272],
  [EDGE, 190],
];

/** Sept portées, du plus court au plus large. */
const SERVICE_ARCS = Array.from({ length: 7 }, (_, i) => ({
  d: arc(C, C, 80 + i * 30, -150, -150 + 70 + i * 22),
  opacity: 0.5 - i * 0.05,
}));

/** Trois cadres qui s'emboîtent en pivotant. */
const SOLUTION_FRAMES = [
  { size: 170, angle: -9, opacity: 0.5 },
  { size: 245, angle: 0, opacity: 0.34 },
  { size: 320, angle: 9, opacity: 0.2 },
];

/** Quatre cadres en enfilade. */
const WORK_FRAMES = [
  { x: 60, y: 168, opacity: 0.5 },
  { x: 112, y: 220, opacity: 0.36 },
  { x: 164, y: 272, opacity: 0.24 },
  { x: 216, y: 324, opacity: 0.14 },
];

/** Ondes ouvertes depuis un point bas. */
const CONTACT_ORIGIN: [number, number] = [120, 440];
const CONTACT_WAVES = Array.from({ length: 5 }, (_, i) => ({
  d: arc(...CONTACT_ORIGIN, 60 + i * 55, -96, 8),
  opacity: 0.5 - i * 0.07,
}));

export const FIELDS: Record<FieldVariant, FieldLayer[]> = {
  about: [
    { depth: 0.5, nodes: ABOUT_RINGS.slice(3).map(([r, w, o]) => path(contour(r, w), o)) },
    { depth: 1, nodes: ABOUT_RINGS.slice(1, 3).map(([r, w, o]) => path(contour(r, w), o)) },
    {
      depth: 1.8,
      nodes: [
        ...ABOUT_RINGS.slice(0, 1).map(([r, w, o]) => path(contour(r, w), o)),
        mark(300, 300, 3.5, "0s"),
        mark(396, 252, 2.5, "0.8s"),
        mark(214, 396, 2.5, "1.6s"),
      ],
    },
  ],

  method: [
    { depth: 0.6, nodes: [path(METHOD_PATH, 0.4)] },
    {
      depth: 1.6,
      nodes: METHOD_STOPS.map(([x, y], i) =>
        h("circle", {
          key: `s-${x}`,
          ...drawable,
          cx: x,
          cy: y,
          r: 7,
          ...stroke({ strokeOpacity: 0.55 - i * 0.04 }),
        }),
      ),
    },
    { depth: 2.4, nodes: [mark(EDGE, 190, 3.5, "0s"), mark(60, 460, 3, "1.2s")] },
  ],

  services: [
    { depth: 0.5, nodes: SERVICE_ARCS.slice(4).map((a) => path(a.d, a.opacity)) },
    { depth: 1.1, nodes: SERVICE_ARCS.slice(2, 4).map((a) => path(a.d, a.opacity)) },
    {
      depth: 1.9,
      nodes: [
        ...SERVICE_ARCS.slice(0, 2).map((a) => path(a.d, a.opacity)),
        mark(C, C, 3.5, "0s"),
      ],
    },
  ],

  solutions: [
    {
      depth: 0.5,
      nodes: SOLUTION_FRAMES.slice(2).map((f) =>
        h("rect", {
          key: `f-${f.size}`,
          ...drawable,
          x: C - f.size / 2,
          y: C - f.size / 2,
          width: f.size,
          height: f.size,
          rx: 28,
          transform: `rotate(${f.angle} ${C} ${C})`,
          ...stroke({ strokeOpacity: f.opacity }),
        }),
      ),
    },
    {
      depth: 1.3,
      nodes: SOLUTION_FRAMES.slice(0, 2).map((f) =>
        h("rect", {
          key: `f-${f.size}`,
          ...drawable,
          x: C - f.size / 2,
          y: C - f.size / 2,
          width: f.size,
          height: f.size,
          rx: 24,
          transform: `rotate(${f.angle} ${C} ${C})`,
          ...stroke({ strokeOpacity: f.opacity }),
        }),
      ),
    },
    { depth: 2.2, nodes: [mark(C, C, 3.5, "0s"), mark(C + 92, C - 92, 2.5, "1s")] },
  ],

  work: [
    {
      depth: 0.5,
      nodes: WORK_FRAMES.slice(2).map((f) =>
        h("rect", {
          key: `w-${f.x}`,
          ...drawable,
          x: f.x,
          y: f.y,
          width: 200,
          height: 132,
          rx: 16,
          ...stroke({ strokeOpacity: f.opacity }),
        }),
      ),
    },
    {
      depth: 1.4,
      nodes: WORK_FRAMES.slice(0, 2).map((f) =>
        h("rect", {
          key: `w-${f.x}`,
          ...drawable,
          x: f.x,
          y: f.y,
          width: 200,
          height: 132,
          rx: 16,
          ...stroke({ strokeOpacity: f.opacity }),
        }),
      ),
    },
    { depth: 2.2, nodes: [mark(60, 168, 3, "0s"), mark(416, 456, 2.5, "1.1s")] },
  ],

  contact: [
    { depth: 0.5, nodes: CONTACT_WAVES.slice(3).map((w) => path(w.d, w.opacity)) },
    { depth: 1.2, nodes: CONTACT_WAVES.slice(1, 3).map((w) => path(w.d, w.opacity)) },
    {
      depth: 2,
      nodes: [
        ...CONTACT_WAVES.slice(0, 1).map((w) => path(w.d, w.opacity)),
        mark(...CONTACT_ORIGIN, 4, "0s"),
      ],
    },
  ],
};
