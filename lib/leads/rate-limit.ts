/**
 * LIMITATION DE DÉBIT
 *
 * Un formulaire public branché sur un service d'envoi payant est une cible :
 * sans garde-fou, une boucle suffit à saturer la boîte de réception et à
 * consommer le quota.
 *
 * La fenêtre est tenue en mémoire du processus. C'est volontairement modeste :
 * sur plusieurs instances, chacune compte pour elle, et un redémarrage remet
 * le compteur à zéro. Cela arrête les envois répétés depuis un même poste —
 * le cas réel — sans introduire Redis ni aucune infrastructure supplémentaire
 * pour un site qui n'en a pas d'autre usage.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function allowRequest(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Purge opportuniste : sans elle, la table grossit indéfiniment avec le
  // nombre d'adresses vues depuis le démarrage du processus.
  if (hits.size > 500) {
    for (const [entry, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(entry);
    }
  }

  return true;
}
