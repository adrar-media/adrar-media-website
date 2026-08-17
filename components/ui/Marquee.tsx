import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  separator?: string;
}

/**
 * Bande éditoriale défilante — animation CSS pure, aucun JavaScript.
 * La liste est lisible une fois par les technologies d'assistance ; le second
 * exemplaire, purement visuel pour boucler le défilement, en est masqué.
 * Le défilement s'interrompt sous `prefers-reduced-motion` (globals.css).
 */
export function Marquee({ items, className, separator = "•" }: MarqueeProps) {
  const sequence = (
    <ul className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-h3 uppercase tracking-tight">{item}</span>
          <span aria-hidden className="text-atlas">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("relative overflow-hidden py-6", className)}
      // La bande est décorative dans son ensemble : on ne veut pas qu'un
      // lecteur d'écran annonce un défilement, seulement la liste de mots.
      role="group"
      aria-label={items.join(", ")}
    >
      <div className="flex w-max animate-marquee">
        {sequence}
        <div aria-hidden>{sequence}</div>
      </div>
    </div>
  );
}
