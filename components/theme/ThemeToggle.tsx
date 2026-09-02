"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { type Theme } from "@/lib/theme";
import {
  getServerThemeChoice,
  getThemeChoice,
  setThemeChoice,
  subscribeTheme,
} from "@/lib/theme-store";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  labels: { label: string; light: string; dark: string; system: string };
  className?: string;
  /** `stacked` : libellés en clair, pour le panneau mobile. */
  variant?: "inline" | "stacked";
}

const order: Theme[] = ["light", "dark", "system"];

/**
 * Bascule de thème.
 *
 * TROIS ÉTATS ET NON DEUX. Un interrupteur clair/sombre force un visiteur à
 * choisir une valeur figée alors que son système en exprime déjà une : s'il
 * bascule son ordinateur en sombre le soir, un site coincé sur « clair »
 * restera clair. `system` reste donc offert, mais il n'est plus le défaut —
 * le sombre est le thème officiel du site (voir `DEFAULT_THEME`), et c'est lui
 * qui s'affiche tant que personne n'a rien demandé.
 *
 * DEUX VALEURS DISTINCTES, ET LES CONFONDRE EST LE PIÈGE DE CE COMPOSANT :
 *
 *   — LE CHOIX, écrit dans le stockage local. Il peut valoir « system », qui
 *     n'est pas une couleur mais une délégation. C'est lui qui doit survivre
 *     au rechargement, sans quoi le réglage cesserait de suivre le système le
 *     jour où celui-ci change.
 *   — LE RÉSULTAT, écrit sur `<html>`. Il ne vaut JAMAIS « system » : la
 *     feuille de style et les utilitaires `dark:` de Tailwind ne savent lire
 *     qu'un attribut concret. « system » y est donc résolu avant d'être écrit.
 *
 * L'ancienne version n'écrivait rien pour « system » — ni dans le stockage, ni
 * sur le document — et laissait la requête média de la feuille faire le
 * travail. Cela peignait la bonne palette mais laissait les utilitaires `dark:`
 * en arrière : logo non inversé, formes du Hero calées pour un fond clair.
 *
 * L'attribut `data-theme` sur `<html>` est la seule sortie du composant. Tout
 * le reste — couleurs, contrastes, ombres — en découle par les variables CSS
 * (globals.css). Aucun composant du site ne connaît le thème courant.
 *
 * Rendu inerte jusqu'au montage : le serveur ne peut pas connaître le choix
 * du visiteur, et annoncer « clair » sur une page qui s'affiche en sombre
 * serait pire que de ne rien annoncer pendant une image. Le script en tête de
 * document (app/[locale]/layout.tsx) a déjà posé le bon thème à ce stade.
 */
export function ThemeToggle({
  labels,
  className,
  variant = "inline",
}: ThemeToggleProps) {
  /*
   * L'ÉTAT VIENT DU MAGASIN PARTAGÉ, PAS DU COMPOSANT.
   *
   * `useSyncExternalStore` abonne cette bascule à la source unique : toutes les
   * copies montées dans la page — en-tête et panneau mobile — affichent donc le
   * même réglage actif, quelle que soit celle par laquelle il a été changé.
   * L'instantané serveur vaut le thème officiel, ce que le document porte déjà.
   */
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeChoice,
    getServerThemeChoice,
  );

  /*
   * Rendu inerte jusqu'au montage : le serveur ne peut pas connaître le choix du
   * visiteur, et annoncer un réglage actif qui ne correspond pas à l'écran
   * serait pire que de n'en annoncer aucun pendant une image.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const apply = setThemeChoice;

  const names: Record<Theme, string> = {
    light: labels.light,
    dark: labels.dark,
    system: labels.system,
  };

  return (
    <div
      className={cn(
        "flex items-center",
        variant === "inline" ? "gap-1" : "gap-2",
        className,
      )}
      role="group"
      aria-label={labels.label}
    >
      {order.map((value) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => apply(value)}
            aria-pressed={active}
            title={names[value]}
            className={cn(
              /*
                Cible tactile d'au moins 44 px en pile — c'est la variante du
                panneau mobile, donc celle qu'on atteint au doigt. À
                `px-3 py-2`, le bouton mesurait 39 px de haut : assez pour être
                vu, pas pour être visé de façon fiable. La variante en ligne
                reste compacte mais monte à 32 px, un pictogramme de 26 px de
                côté étant une cible étroite même à la souris.
              */
              "inline-flex items-center justify-center rounded-pill transition duration-base ease-brand",
              variant === "inline"
                ? "min-h-8 px-2.5 py-1 text-caption"
                : "min-h-11 px-4 py-2.5 text-small",
              active
                ? "bg-anthracite/10 text-ink"
                : "text-anthracite/70 hover:text-ink",
            )}
          >
            <span aria-hidden>{icon(value)}</span>
            <span className={variant === "stacked" ? "ms-2" : "sr-only"}>
              {names[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Pictogrammes en caractères plutôt qu'en SVG : trois glyphes contre trois
 * tracés à charger, pour des cibles de 24 px où le dessin n'apporte rien.
 */
function icon(theme: Theme): string {
  if (theme === "light") return "☀";
  if (theme === "dark") return "☾";
  return "◐";
}
