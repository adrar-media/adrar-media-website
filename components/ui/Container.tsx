import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** `wide` supprime la largeur max pour les compositions full-bleed. */
  width?: "default" | "wide";
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
  /**
   * Étiquette du point de repère quand `as` en produit un (`nav`, `header`…).
   * Sans elle, il fallait poser un élément vide porteur d'`aria-label` à côté
   * du repère — ce qui n'étiquette rien, l'attribut ne s'appliquant qu'à
   * l'élément qui le porte.
   */
  "aria-label"?: string;
}

export function Container({
  children,
  className,
  width = "default",
  as: Tag = "div",
  "aria-label": ariaLabel,
}: ContainerProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={cn(
        "mx-auto w-full px-gutter",
        width === "default" && "max-w-container",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
