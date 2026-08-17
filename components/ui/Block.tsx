import { cn } from "@/lib/utils";

interface BlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Conteneur de composition, sans mouvement.
 *
 * Le site ne pratique aucune révélation au scroll : le contenu est peint
 * visible et le reste. Ce choix suit la référence UX retenue, dont la mesure
 * au navigateur a montré qu'aucun élément n'est masqué avant son entrée dans
 * l'écran (opacité 1, aucune transformation, avant comme après défilement).
 *
 * Les bénéfices sont concrets : rien à attendre, rien qui saute, aucun texte
 * invisible pour un lecteur d'écran ou un moteur, et aucun JavaScript
 * d'animation à charger. `Block` ne subsiste que pour porter les classes de
 * grille des compositions.
 */
export function Block({ children, className }: BlockProps) {
  return <div className={cn(className)}>{children}</div>;
}

/** Élément d'un `Block`, pour conserver les décalages de colonnes. */
export function BlockItem({ children, className }: BlockProps) {
  return <div className={cn(className)}>{children}</div>;
}
