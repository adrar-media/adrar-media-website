import { cn } from "@/lib/utils";

interface HeadlineProps {
  /** Une entrée par ligne : la découpe reste un choix éditorial, pas automatique. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

/**
 * Grand titre, découpé en lignes maîtrisées.
 *
 * La composition typographique est conservée — c'est elle qui donne sa
 * présence au titre — mais sans aucune animation d'apparition : le titre est
 * lisible dès la première image peinte.
 *
 * Le texte reste dans une seule balise sémantique, donc lu normalement par
 * les lecteurs d'écran et les moteurs.
 */
export function Headline({ lines, className, as: Tag = "h2" }: HeadlineProps) {
  return (
    <Tag className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </Tag>
  );
}
