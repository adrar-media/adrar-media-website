"use client";

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

/**
 * État du thème, partagé par toutes les bascules de la page.
 *
 * POURQUOI UN MAGASIN PLUTÔT QU'UN `useState` DANS LE COMPOSANT
 *
 * `ThemeToggle` est monté DEUX FOIS : une fois dans la barre de navigation,
 * une fois dans le panneau mobile. Avec un état local, chaque copie ne
 * connaissait que ses propres clics. Choisir « Système » dans l'en-tête laissait
 * la copie du panneau afficher « Sombre » comme réglage actif — le thème
 * appliqué était pourtant le bon, mais l'interface annonçait autre chose que la
 * réalité, ce qui est la seule chose qu'un réglage ne doit jamais faire.
 *
 * Le magasin tient la vérité une seule fois et prévient tous ses abonnés. Peu
 * importe désormais combien de bascules la page contient, ni laquelle est
 * utilisée.
 *
 * IL PORTE AUSSI L'ABONNEMENT AU SYSTÈME, pour la même raison : deux
 * composants abonnés séparément à `matchMedia` réappliqueraient le même
 * attribut chacun de leur côté. Ici l'abonnement est ouvert quand le choix vaut
 * « system », fermé sinon, et il n'existe qu'en un exemplaire.
 */

let choice: Theme = DEFAULT_THEME;
let hydrated = false;

const listeners = new Set<() => void>();
let mediaQuery: MediaQueryList | null = null;

/** Traduit un choix en couleur effective. « system » interroge le navigateur. */
function resolve(value: Theme): ResolvedTheme {
  if (value !== "system") return value;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Écrit le résultat sur `<html>`. C'est la seule sortie visible du magasin. */
function paint() {
  document.documentElement.dataset.theme = resolve(choice);
}

function onSystemChange() {
  paint();
}

/**
 * Ouvre l'abonnement système quand il sert, le ferme sinon. Appelé à chaque
 * changement de choix : sans la fermeture, passer de « système » à « clair »
 * laisserait le navigateur repeindre la page au prochain coucher de soleil.
 */
function syncSystemSubscription() {
  if (choice === "system") {
    if (!mediaQuery) {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", onSystemChange);
    }
    return;
  }

  if (mediaQuery) {
    mediaQuery.removeEventListener("change", onSystemChange);
    mediaQuery = null;
  }
}

/**
 * Relit le choix enregistré. Exécuté une seule fois, au premier abonnement :
 * le rendu serveur ne peut pas connaître le stockage local, et lire pendant le
 * rendu ferait diverger le premier affichage.
 */
function hydrate() {
  if (hydrated) return;
  hydrated = true;

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      choice = stored;
    }
  } catch {
    /* Stockage indisponible (navigation privée stricte) : le défaut tient. */
  }

  syncSystemSubscription();
}

export function subscribeTheme(listener: () => void): () => void {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeChoice(): Theme {
  return choice;
}

/** Le serveur ne connaît que le thème officiel. */
export function getServerThemeChoice(): Theme {
  return DEFAULT_THEME;
}

export function setThemeChoice(next: Theme) {
  choice = next;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* Le thème s'applique quand même ; il ne survivra simplement pas. */
  }

  syncSystemSubscription();
  paint();
  listeners.forEach((listener) => listener());
}
