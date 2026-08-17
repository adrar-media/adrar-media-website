import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** `wide` supprime la largeur max pour les compositions full-bleed. */
  width?: "default" | "wide";
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
}

export function Container({
  children,
  className,
  width = "default",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
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
