interface CounterProps {
  value: number;
  suffix?: string;
}

/**
 * Valeur chiffrée.
 *
 * Affichée telle quelle, sans décompte animé : un chiffre est une
 * information, il n'a pas à être attendu pour être lu. Le décompte imposait
 * aussi du JavaScript et une lecture instable aux technologies d'assistance.
 *
 * `tabular-nums` fige la largeur des chiffres, pour que les valeurs alignées
 * ne dansent pas d'une ligne à l'autre.
 */
export function Counter({ value, suffix = "" }: CounterProps) {
  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
