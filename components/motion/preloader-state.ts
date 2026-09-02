"use client";

/**
 * État de l'écran de chargement, partagé.
 *
 * POURQUOI CE MODULE PLUTÔT QU'UN SIMPLE ÉVÉNEMENT
 *
 * Le premier écran doit jouer son entrée quand le voile se retire, pas avant
 * — sinon le titre se découpe DERRIÈRE le voile, et le visiteur découvre une
 * page déjà animée, c'est-à-dire rien du tout.
 *
 * Un événement seul ne suffit pas : il ne garde pas de mémoire. Un composant
 * monté après la levée du voile — une navigation interne, une hydratation
 * lente — écouterait un événement déjà passé et resterait masqué pour
 * toujours. Le drapeau règle ce cas : il répond « c'est fait » à ceux qui
 * arrivent en retard.
 *
 * FILET DE SÉCURITÉ. Si rien n'a levé le voile au bout de cinq secondes — un
 * écran de chargement retiré du site, une erreur de script avant sa fin — les
 * rappels sont exécutés quand même. Aucun titre du site ne peut donc rester
 * invisible parce qu'un composant SANS RAPPORT AVEC LUI n'a pas fait son
 * travail.
 */

const EVENT = "adrar:preloader-done";
const FALLBACK_MS = 2500;

let done = false;
let fallback: ReturnType<typeof setTimeout> | null = null;

/** Signale que le voile est levé. Idempotent. */
export function markPreloaderDone() {
  if (done) return;
  done = true;
  if (fallback) {
    clearTimeout(fallback);
    fallback = null;
  }
  document.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * Exécute `callback` à la levée du voile — ou tout de suite s'il est déjà
 * levé. Renvoie la fonction de désabonnement.
 */
export function whenPreloaderDone(callback: () => void): () => void {
  /*
   * Le voile est optionnel. Lorsqu'il n'est pas monté par le layout, les
   * révélations du premier écran démarrent immédiatement au lieu d'attendre
   * le filet de sécurité prévu pour une animation en panne.
   */
  if (!done && !document.querySelector(".preloader")) markPreloaderDone();

  if (done) {
    callback();
    return () => {};
  }

  if (fallback === null) {
    fallback = setTimeout(markPreloaderDone, FALLBACK_MS);
  }

  document.addEventListener(EVENT, callback, { once: true });
  return () => document.removeEventListener(EVENT, callback);
}
