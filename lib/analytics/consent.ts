/**
 * MÉMOIRE DU CONSENTEMENT
 *
 * Un cookie plutôt que `localStorage` : la décision doit pouvoir être lue par
 * le serveur le jour où une page dépendra du consentement, et elle expire
 * d'elle-même. Six mois — au-delà, un accord donné n'engage plus grand-chose
 * et il est normal de reposer la question.
 *
 * Aucune donnée personnelle n'y transite : la valeur vaut « granted » ou
 * « denied », rien d'autre.
 */
export const consentCookie = {
  name: "adrar_consent",
  maxAgeSeconds: 60 * 60 * 24 * 180,
} as const;

export type ConsentValue = "granted" | "denied";

/** Événement interne : la bannière prévient les scripts sans rechargement. */
export const CONSENT_EVENT = "adrar:consent";

export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${consentCookie.name}=([^;]*)`),
  );
  const value = match?.[1];
  return value === "granted" || value === "denied" ? value : null;
}

export function writeConsent(value: ConsentValue): void {
  document.cookie = `${consentCookie.name}=${value}; path=/; max-age=${consentCookie.maxAgeSeconds}; samesite=lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
