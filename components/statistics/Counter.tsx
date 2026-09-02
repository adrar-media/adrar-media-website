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
 *
 * `<bdi>` isole la valeur de son contexte : en arabe, un suffixe comme « K+ »
 * ou « % » est un caractère neutre pour l'algorithme bidirectionnel et passe
 * de l'autre côté du nombre — « 516K+ » devient « +516K ». L'isolation le
 * rattache au chiffre qu'il qualifie.
 */
export function Counter({ value, suffix = "" }: CounterProps) {
  return (
    <bdi className="tabular-nums">
      {value}
      {suffix}
    </bdi>
  );
}
