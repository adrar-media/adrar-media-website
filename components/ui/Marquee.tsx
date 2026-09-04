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
 *
 * Deux ajouts qui rendent la bande lisible plutôt que seulement mobile :
 *
 * - elle s'arrête au survol et au focus clavier. Un mot qu'on veut lire ne
 *   doit pas fuir sous le curseur, et c'est aussi ce qui permet de le lire
 *   sans dépendre de la vitesse de défilement ;
 * - les deux bords sont fondus au masque. Sans cela les mots sont tranchés
 *   net sur l'arête du conteneur, ce qui donne une coupure franche là où le
 *   reste de la page est tout en angles adoucis.
 */
export function Marquee({ items, className, separator = "•" }: MarqueeProps) {
  const sequence = (
    <ul className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-8 text-h2 text-ink/85">{item}</span>
          <span aria-hidden className="text-atlas">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("marquee group relative overflow-x-clip overflow-y-hidden py-6", className)}
      // La bande est décorative dans son ensemble : on ne veut pas qu'un
      // lecteur d'écran annonce un défilement, seulement la liste de mots.
      role="group"
      aria-label={items.join(", ")}
      tabIndex={0}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused]">
        {sequence}
        <div aria-hidden>{sequence}</div>
      </div>
    </div>
  );
}
