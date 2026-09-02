import type { QuoteRequest } from "@/lib/leads/types";

/**
 * PASSERELLE ADRAR OS / CRM
 *
 * Le README décrit la chaîne visée : Site → Devis → API → Adrar OS → Lead.
 * Adrar OS n'expose aujourd'hui aucun modèle `Lead` ni `QuoteRequest` ; le
 * point d'entrée est donc configurable et inactif par défaut.
 *
 * L'appel est délibérément accessoire : si le CRM ne répond pas, la demande
 * a déjà été transmise par email et ne doit pas être perdue pour autant. On
 * journalise et on continue — jamais l'inverse.
 */
export async function forwardToCrm(quote: QuoteRequest): Promise<void> {
  const url = process.env.ADRAR_OS_API_URL?.trim();
  const key = process.env.ADRAR_OS_API_KEY?.trim();
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      /*
       * DEUX SENS DU MOT « SOURCE », ET ILS SE MARCHAIENT DESSUS.
       *
       * Le CRM appelle `source` le CANAL d'où vient la demande — ici le site
       * web, par opposition à un appel ou à un salon. La demande, elle, porte
       * depuis peu un `source` qui désigne le FORMULAIRE d'origine (devis ou
       * message court). L'étalement de `quote` écrasait donc silencieusement
       * le canal par le nom du formulaire, et le CRM recevait « quote » comme
       * canal d'acquisition.
       *
       * `source` est réaffirmé APRÈS l'étalement pour reprendre la main, et le
       * formulaire part sous son propre nom, `form`.
       */
      body: JSON.stringify({
        receivedAt: new Date().toISOString(),
        ...quote,
        source: "site-web",
        form: quote.source,
        trap: undefined,
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      console.error("[adrar] CRM a refusé la demande", response.status);
    }
  } catch (error) {
    console.error("[adrar] CRM injoignable", error);
  }
}
