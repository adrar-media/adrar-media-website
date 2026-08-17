import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  /** Pastille verte de tête — marqueur récurrent des ouvertures de section. */
  dot?: boolean;
  tone?: "dark" | "light";
}

/**
 * Étiquette de section, sous forme de pastille posée sur le fond.
 *
 * Remplace la petite capitale espacée : à l'échelle de la page, c'est cet
 * élément qui annonce le registre doux avant même que le titre soit lu.
 */
export function Eyebrow({
  children,
  className,
  dot = true,
  tone = "dark",
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "pill",
        dot && "pill-dot",
        tone === "light" &&
          "border-white/15 bg-white/10 text-white shadow-none backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
