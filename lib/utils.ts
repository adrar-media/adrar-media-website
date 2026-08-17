/**
 * Concaténation conditionnelle de classes.
 * Volontairement écrit à la main : clsx/tailwind-merge n'apporteraient rien
 * ici et ajouteraient deux dépendances au bundle.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
