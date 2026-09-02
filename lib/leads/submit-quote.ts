import { forwardToCrm } from "@/lib/leads/adrar-os";
import { emailTransport, sendQuoteEmail } from "@/lib/leads/email";
import { allowRequest } from "@/lib/leads/rate-limit";
import { parseQuote } from "@/lib/leads/validate";
import type { QuoteResult } from "@/lib/leads/types";

/**
 * Traitement d'une demande de devis.
 *
 * L'ordre compte : on écarte d'abord ce qui ne doit pas consommer de quota
 * (robots, abus, saisies invalides), puis on transmet.
 *
 * `unconfigured` n'est pas une erreur. Sur un déploiement sans service
 * d'envoi, l'interface reprend la main et propose au visiteur d'envoyer sa
 * demande lui-même, par email ou WhatsApp. Le pire résultat possible serait un
 * « merci » affiché à quelqu'un dont la demande n'est arrivée nulle part.
 */
export async function submitQuote(
  input: unknown,
  clientKey: string,
): Promise<QuoteResult> {
  const { data, errors } = parseQuote(input);

  /*
   * Champ piège rempli : un robot. On répond « envoyé » sans rien envoyer —
   * signaler le rejet lui apprendrait quel champ éviter au tour suivant.
   */
  if (data.trap) return { status: "sent" };

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const transport = emailTransport();
  if (!transport) return { status: "unconfigured" };

  if (!allowRequest(clientKey)) return { status: "rate-limited" };

  const delivered = await sendQuoteEmail(transport, data);
  if (!delivered) return { status: "error" };

  // Le CRM est accessoire : la demande est déjà arrivée, on n'attend rien de lui.
  await forwardToCrm(data);

  return { status: "sent" };
}
