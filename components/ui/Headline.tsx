import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { cn } from "@/lib/utils";

interface HeadlineProps {
  /** Une entrée par ligne : la découpe reste un choix éditorial, pas automatique. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  /**
   * Joue au montage plutôt qu'à l'entrée dans l'écran. Réservé au premier
   * écran, déjà visible au chargement.
   */
  immediate?: boolean;
  /** Retard au démarrage, en secondes. */
  delay?: number;
}

/**
 * Grand titre, découpé en lignes maîtrisées.
 *
 * Point d'entrée unique de tous les grands titres du site. Il ne fait plus que
 * choisir la composition : le mouvement, lui, appartient entièrement à
 * `SplitHeadline`.
 *
 * CE QUI A REMPLACÉ LE VOLET
 *
 * Les titres se découvraient par `clip-path`, ligne par ligne — un volet qui
 * descend. C'était juste, mais uniforme : la ligne se dévoilait d'un bloc, et
 * la seule variable était le retard entre deux lignes. Le titre apparaissait
 * sans jamais bouger.
 *
 * La découpe par caractères donne au titre une matière. Les lettres montent
 * depuis sous leur ligne de base en pivotant, décalées les unes des autres :
 * pendant une demi-seconde la ligne ondule, puis se range. C'est le mouvement
 * signature du site, et il est désormais le même partout — premier écran,
 * en-têtes de section, pages intérieures — au lieu d'un volet réservé au Hero
 * et d'un fondu pour tout le reste.
 *
 * Les garde-fous n'ont pas changé et sont détaillés dans `SplitHeadline` :
 * l'arabe est découpé par mots et jamais par lettres — c'est une écriture
 * liée ; le mouvement réduit pose le titre net, sans découpe ; sans
 * JavaScript, le texte reste lisible.
 */
export function Headline({
  lines,
  className,
  as = "h2",
  immediate = false,
  delay = 0,
}: HeadlineProps) {
  return (
    <SplitHeadline
      as={as}
      lines={lines}
      className={cn(className)}
      immediate={immediate}
      delay={delay}
    />
  );
}
