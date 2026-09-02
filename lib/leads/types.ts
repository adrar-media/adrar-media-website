import type { Locale } from "@/config/i18n";

/**
 * Une demande de devis, telle qu'elle circule entre le formulaire, l'envoi
 * d'email et l'intégration CRM. Un seul type partagé : le jour où Adrar OS
 * expose un modèle `Lead`, c'est ce type qui s'y projette, pas le formulaire.
 */
export interface QuoteRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
  /** Consentement explicite au traitement de la demande décrite par la politique. */
  consent: boolean;
  locale: Locale;
  /**
   * Formulaire d'origine.
   *
   * LES DEUX FORMULAIRES ARRIVENT DÉSORMAIS DANS LA MÊME BOÎTE, et sans ce
   * champ ils y arrivent sous le même objet. Or ils ne demandent pas la même
   * chose : le devis apporte un périmètre, un budget et une échéance et se
   * traite comme une affaire ; le formulaire du pied de page apporte trois
   * lignes et se traite comme une question. Les distinguer dans l'objet du
   * message, c'est ce qui permet de trier la boîte sans l'ouvrir.
   */
  source: "quote" | "contact";
  /** Champ piège : rempli uniquement par un robot. Jamais transmis plus loin. */
  trap?: string;
}

/** Métadonnées calculées côté serveur, jamais acceptées depuis le navigateur. */
export interface LeadRequestContext {
  receivedAt: string;
  sourcePage?: string;
}

export type QuoteFieldError =
  | "name"
  | "email"
  | "contact"
  | "message"
  | "consent";

export type QuoteResult =
  /** Reçue et transmise à la boîte de réception d'Adrar Media. */
  | { status: "sent" }
  /**
   * Aucun service d'envoi n'est configuré sur ce déploiement. Ce n'est pas une
   * panne : le formulaire bascule alors sur l'envoi manuel (email/WhatsApp),
   * qui fonctionne sans serveur.
   */
  | { status: "unconfigured" }
  /** Validation serveur en échec — le client n'est jamais la seule barrière. */
  | { status: "invalid"; errors: Partial<Record<QuoteFieldError, true>> }
  /** Trop de tentatives depuis la même origine. */
  | { status: "rate-limited" }
  /** Le service d'envoi a répondu en erreur. */
  | { status: "error" };
