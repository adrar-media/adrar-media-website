export type StepKey =
  | "discover"
  | "strategize"
  | "create"
  | "distribute"
  | "optimize"
  | "scale";

/**
 * Pictogrammes des six étapes.
 *
 * SIX DESSINS, PAS SIX ILLUSTRATIONS.
 *
 * La page portait déjà une photographie par étape. Une seconde image par étape
 * n'aurait rien ajouté : ce qui manquait, c'était un repère qu'on reconnaisse
 * de loin, en survolant la page, pour savoir où l'on en est sans relire le
 * titre. D'où des tracés au trait, tous construits sur la même grille 48 × 48
 * et la même épaisseur — ce sont six variantes d'un même signe, pas six
 * dessins différents.
 *
 * ILS SONT DÉCRITS PAR LEUR FORME ET NON PAR LEUR SUJET :
 *
 *   discover    une loupe posée sur l'horizon — regarder ce qui existe déjà
 *   strategize  trois points reliés par un chemin — un cap choisi entre options
 *   create      des calques qui se superposent — la production qui s'empile
 *   distribute  des ondes depuis un point — la diffusion qui porte
 *   optimize    une courbe qui monte, un repère dessus — les chiffres décident
 *   scale       une silhouette de massif qui s'élargit — la montée en charge
 *
 * Le massif de `scale` reprend la ligne d'horizon du logo. C'est la dernière
 * étape : elle boucle sur la marque plutôt que d'inventer un septième signe.
 *
 * `stroke-current` : la couleur vient du parent. Sur le rail, la pastille est
 * vert Atlas ; en attente, elle est grise. Le tracé n'a pas à le savoir.
 */

const GLYPHS: Record<StepKey, React.ReactNode> = {
  discover: (
    <>
      <circle cx="21" cy="20" r="10" />
      <path d="M28.5 27.5 38 37" />
      <path d="M11 24c3-3.5 17-3.5 20 0" />
    </>
  ),
  strategize: (
    <>
      <path d="M8 34c6-2 8-10 14-12s10 4 16-8" />
      <circle cx="8" cy="34" r="3" />
      <circle cx="22" cy="22" r="3" />
      <circle cx="38" cy="14" r="3" />
    </>
  ),
  create: (
    <>
      <path d="M24 8 40 17 24 26 8 17z" />
      <path d="M8 24.5 24 33.5 40 24.5" />
      <path d="M8 32 24 41 40 32" />
    </>
  ),
  distribute: (
    <>
      <circle cx="24" cy="24" r="3.5" />
      <path d="M16.5 31.5a10.6 10.6 0 0 1 0-15" />
      <path d="M31.5 16.5a10.6 10.6 0 0 1 0 15" />
      <path d="M11 37a18.4 18.4 0 0 1 0-26" />
      <path d="M37 11a18.4 18.4 0 0 1 0 26" />
    </>
  ),
  optimize: (
    <>
      <path d="M8 38h32" />
      <path d="M11 32c6 0 9-14 15-16s7 8 11 4" />
      <circle cx="26" cy="16" r="3.5" />
    </>
  ),
  scale: (
    <>
      <path d="M6 38h36" />
      <path d="M6 33c8-14 12-21 18-21s10 7 18 21" />
      <path d="M18 21c3 2 9 2 12 0" />
    </>
  ),
};

interface StepGlyphProps {
  step: StepKey;
  className?: string;
}

export function StepGlyph({ step, className }: StepGlyphProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {GLYPHS[step]}
    </svg>
  );
}
