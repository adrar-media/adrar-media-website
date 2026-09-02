import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface BlockProps {
  children: React.ReactNode;
  className?: string;
  /** Décalage en ms — pour révéler une série d'éléments en cascade. */
  delay?: number;
  /**
   * Neutralise la révélation. Réservé aux blocs qui doivent être lisibles
   * quoi qu'il arrive, sans dépendre d'aucun déclencheur.
   */
  still?: boolean;
  /**
   * Joue à la levée de l'écran de chargement plutôt qu'au défilement.
   *
   * C'est ce que veut le premier écran. `still` y répondait avant, en coupant
   * purement et simplement la révélation : le titre se découpait, et tout ce
   * qui l'entourait était déjà là, figé. La composition arrivait en deux
   * temps sans que ce soit voulu. `immediate` la fait arriver en un seul.
   */
  immediate?: boolean;
}

/**
 * Conteneur de composition, révélé à l'entrée dans l'écran.
 *
 * Le site masquait auparavant toute révélation au défilement, et ce fichier
 * documentait ce choix. Il est levé à la demande : les sections se posent
 * désormais au fur et à mesure de la lecture.
 *
 * Les objections d'alors restent traitées, elles ne sont pas ignorées :
 * le texte est présent dans le HTML servi (il n'est que masqué visuellement),
 * l'animation se neutralise sous `prefers-reduced-motion`, et une règle
 * `<noscript>` rend tout visible si le script ne s'exécute pas. Voir
 * `components/motion/Reveal.tsx` pour le détail des garde-fous.
 *
 * `Block` porte les classes de grille des compositions ; `Reveal` n'ajoute
 * qu'un conteneur autour, sans style de mise en page propre.
 */
export function Block({
  children,
  className,
  delay,
  still,
  immediate,
}: BlockProps) {
  if (still) return <div className={cn(className)}>{children}</div>;

  return (
    <Reveal className={cn(className)} delay={delay} immediate={immediate}>
      {children}
    </Reveal>
  );
}

/** Élément d'un `Block`, pour conserver les décalages de colonnes. */
export function BlockItem({
  children,
  className,
  delay,
  still,
  immediate,
}: BlockProps) {
  if (still) return <div className={cn(className)}>{children}</div>;

  return (
    <Reveal className={cn(className)} delay={delay} immediate={immediate}>
      {children}
    </Reveal>
  );
}
