"use server";

import { headers } from "next/headers";
import { submitQuote } from "@/lib/leads/submit-quote";
import type { QuoteResult } from "@/lib/leads/types";

/**
 * Action serveur des formulaires de prise de contact.
 *
 * Elle est la seule frontière de confiance : le formulaire du navigateur peut
 * être contourné, cette fonction ne le peut pas. Elle revalide tout, applique
 * la limitation de débit, puis délègue à `lib/leads` — qui ne connaît ni React
 * ni la requête HTTP et reste donc réutilisable par un futur point d'entrée.
 *
 * ELLE VIT DANS `lib/` ET NON DANS UN DOSSIER DE ROUTE, parce qu'elle a
 * désormais DEUX appelants : la page de devis, et le formulaire court du pied
 * de page — présent sur toutes les pages du site, donc rattaché à aucune. La
 * copier au second endroit dupliquerait la dérivation de la clé de débit, et
 * deux limiteurs indépendants sur le même visiteur ne limitent plus rien.
 */
export async function sendLeadAction(input: unknown): Promise<QuoteResult> {
  const headerList = await headers();

  /*
   * `x-forwarded-for` porte la chaîne des relais : la première adresse est
   * celle du client. Sans en-tête (exécution locale), une clé fixe s'applique
   * — la limite vaut alors pour la machine, ce qui est le comportement voulu.
   */
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey =
    forwarded || headerList.get("x-real-ip")?.trim() || "origine-inconnue";

  return submitQuote(input, clientKey);
}
