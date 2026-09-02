import "server-only";

import { Resend } from "resend";
import type { LeadRequestContext, QuoteRequest } from "@/lib/leads/types";

/**
 * ENVOI DE LA DEMANDE PAR EMAIL
 *
 * Le SDK officiel Resend est instancié uniquement après lecture des deux
 * variables serveur requises. Ce module est explicitement server-only : la clé
 * ne peut pas entrer dans un bundle navigateur.
 *
 * LE DESTINATAIRE EST LA BOÎTE COMMERCIALE CONFIRMÉE DE L'AGENCE, ET IL N'EST
 * PLUS À CONFIGURER.
 *
 * Les deux formulaires du site — le devis et le formulaire court du pied de
 * page — arrivent sans exception à `contact@adrar.media`. Cette destination
 * est volontairement fixée côté serveur : une variable d'environnement mal
 * renseignée ne peut donc pas détourner silencieusement les demandes vers une
 * autre boîte.
 *
 * L'EXPÉDITEUR, LUI, N'A PAS DE REPLI, et c'est délibéré. Resend refuse
 * d'envoyer depuis un domaine qu'il n'a pas vérifié : une valeur devinée ici
 * ferait échouer chaque envoi avec une erreur de service, là où l'absence de
 * configuration fait proprement basculer le formulaire sur l'envoi manuel. Un
 * repli inventé transformerait donc un repli qui marche en panne silencieuse.
 *
 * Le transport automatique exige deux variables serveur :
 * `EMAIL_API_KEY` et `QUOTE_NOTIFICATION_FROM`. Tant que l'une manque, le
 * formulaire propose au visiteur d'écrire lui-même — jamais un « merci »
 * affiché à quelqu'un dont la demande n'est arrivée nulle part.
 */

export const notificationRecipient = "contact@adrar.media";

interface Transport {
  resend: Resend;
  to: string;
  from: string;
}

export function emailTransport(): Transport | null {
  const apiKey = process.env.EMAIL_API_KEY?.trim();
  const from = process.env.QUOTE_NOTIFICATION_FROM?.trim();
  if (!apiKey || !from) return null;
  if (/[\r\n]/.test(apiKey) || /[\r\n]/.test(from)) {
    console.error("[adrar] configuration Resend invalide");
    return null;
  }
  return { resend: new Resend(apiKey), to: notificationRecipient, from };
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const optionalValue = (value: string): string => value || "Non renseigné";

const safeSubjectPart = (value: string): string =>
  value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const receivedAt = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Africa/Casablanca",
  }).format(date)} (${date.toISOString()})`;
};

/**
 * Tous les champs réellement présentés dans le formulaire d'origine.
 *
 * Le formulaire court ne demande ni société, ni budget, ni échéance : les
 * ajouter comme valeurs vides ferait croire à une saisie incomplète. Le devis,
 * lui, transmet chaque champ affiché, y compris les champs facultatifs et le
 * consentement. Le champ anti-robot est une mesure technique et n'est jamais
 * une donnée métier à envoyer.
 */
const rows = (
  quote: QuoteRequest,
  context: LeadRequestContext,
): [string, string][] => {
  const common: [string, string][] = [
    ["Type de demande", origin(quote)],
    ["Nom", quote.name],
    ["Email", optionalValue(quote.email)],
  ];

  const quoteFields: [string, string][] =
    quote.source === "quote"
      ? [
          ["Société", optionalValue(quote.company)],
          ["Téléphone", optionalValue(quote.phone)],
          ["Prestations", optionalValue(quote.services.join(", "))],
          ["Budget", optionalValue(quote.budget)],
          ["Échéance", optionalValue(quote.timeline)],
        ]
      : [];

  return [
    ...common,
    ...quoteFields,
    ["Langue du site", quote.locale.toUpperCase()],
    ...(context.sourcePage
      ? ([["Page d'origine", context.sourcePage]] as [string, string][])
      : []),
    ["Date/heure de réception", receivedAt(context.receivedAt)],
    ["Consentement au traitement", quote.consent ? "Oui" : "Non"],
  ];
};

const messageLabel = (quote: QuoteRequest): string =>
  quote.source === "contact"
    ? "Message"
    : "Description du projet / informations complémentaires";

/** Version texte : certaines boîtes professionnelles bloquent le HTML. */
export const plainText = (
  quote: QuoteRequest,
  context: LeadRequestContext,
): string =>
  `${rows(quote, context)
    .map(([label, value]) => `${label} : ${value}`)
    .join("\n")}\n\n${messageLabel(quote)} :\n${quote.message}`;

/**
 * Intitulé du formulaire d'origine, en français.
 *
 * Il n'est PAS traduit dans la langue du visiteur : ce message n'est pas lu
 * par lui, il est lu par l'agence. La langue du site est déjà transmise en
 * ligne dans le tableau, ce qui est l'information utile — savoir dans quelle
 * langue répondre.
 */
const origin = (quote: QuoteRequest): string =>
  quote.source === "contact"
    ? "formulaire de contact / pied de page"
    : "formulaire de demande de devis";

const html = (quote: QuoteRequest, context: LeadRequestContext): string => `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#2B2B2B;line-height:1.6">
  <p style="margin:0 0 24px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#1F7A63">
    Adrar Media — nouveau ${escapeHtml(origin(quote))}
  </p>
  <table style="border-collapse:collapse;width:100%;max-width:640px">
    ${rows(quote, context)
      .map(
        ([label, value]) => `<tr>
      <td style="padding:8px 16px 8px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:#0A2540">${escapeHtml(value)}</td>
    </tr>`,
      )
      .join("")}
  </table>
  <p style="margin:28px 0 8px;color:#6b6b6b">${escapeHtml(messageLabel(quote))}</p>
  <div style="white-space:pre-wrap;padding:16px 20px;background:#F4F2EE;border-radius:12px;color:#0A2540">${escapeHtml(
    quote.message,
  )}</div>
</div>`;

export async function sendQuoteEmail(
  transport: Transport,
  quote: QuoteRequest,
  context: LeadRequestContext,
): Promise<boolean> {
  /*
   * L'OBJET DIT D'OÙ VIENT LE MESSAGE, parce que les deux formulaires
   * aboutissent maintenant dans la même boîte. La société n'est ajoutée que
   * pour le devis : le formulaire court ne la demande pas, et un objet qui se
   * termine par une parenthèse vide se lit comme un bogue.
   */
  const name = safeSubjectPart(quote.name);
  const company = safeSubjectPart(quote.company);
  const subject =
    quote.source === "contact"
      ? `[Nouveau contact Adrar Media] ${name}`
      : `[Nouvelle demande de devis] ${name}${company ? ` / ${company}` : ""}`;

  try {
    const { error } = await transport.resend.emails.send({
      from: transport.from,
      to: [transport.to],
      subject,
      text: plainText(quote, context),
      html: html(quote, context),
      /*
       * Répondre au message dans la boîte de réception écrit directement au
       * prospect, sans recopier son adresse. Sans cet en-tête, la réponse
       * part vers l'expéditeur technique et se perd.
       */
      ...(quote.email ? { replyTo: quote.email } : {}),
    });

    if (error) {
      console.error("[adrar] envoi Resend refusé", { type: error.name });
      return false;
    }
    return true;
  } catch {
    console.error("[adrar] requête Resend en échec");
    return false;
  }
}
