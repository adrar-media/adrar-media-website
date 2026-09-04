import { isLocale, defaultLocale } from "@/config/i18n";
import type { QuoteFieldError, QuoteRequest } from "@/lib/leads/types";

/** Coupe les chaînes trop longues : rien d'utile au-delà, et cela borne la charge. */
const clamp = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Formats marocains locaux (05/06/07) et internationaux (+212/00212). */
const PHONE = /^(?:0[5-7]\d{8}|(?:\+212|00212)[5-7]\d{8})$/;

export const isValidPhone = (value: string): boolean =>
  PHONE.test(value.trim().replace(/[\s().-]/g, ""));

/**
 * Nettoyage et validation côté serveur.
 *
 * La validation du navigateur est une commodité d'usage, pas une barrière :
 * n'importe qui peut appeler l'action directement. Les mêmes règles sont donc
 * rejouées ici, sur une entrée traitée comme inconnue.
 */
export function parseQuote(input: unknown): {
  data: QuoteRequest;
  errors: Partial<Record<QuoteFieldError, true>>;
} {
  const raw = (input ?? {}) as Record<string, unknown>;
  const locale = typeof raw.locale === "string" && isLocale(raw.locale)
    ? raw.locale
    : defaultLocale;

  const data: QuoteRequest = {
    name: clamp(raw.name, 120),
    company: clamp(raw.company, 120),
    email: clamp(raw.email, 160),
    phone: clamp(raw.phone, 40),
    services: Array.isArray(raw.services)
      ? raw.services
          .filter((entry): entry is string => typeof entry === "string")
          .slice(0, 12)
          .map((entry) => entry.trim().slice(0, 80))
      : [],
    budget: clamp(raw.budget, 80),
    timeline: clamp(raw.timeline, 80),
    message: clamp(raw.message, 5000),
    consent: raw.consent === true,
    locale,
    /*
     * Repli sur « quote » : c'est le formulaire long, celui dont l'objet est
     * le plus explicite. Une valeur inconnue vaut donc « demande de devis »
     * plutôt qu'une catégorie inventée — un objet trop précis sur une donnée
     * non fiable trie mal.
     */
    source: raw.source === "contact" ? "contact" : "quote",
    trap: clamp(raw.trap, 200),
  };

  const errors: Partial<Record<QuoteFieldError, true>> = {};
  if (data.name.length < 2) errors.name = true;
  // Un numéro suffit à rappeler quelqu'un : on n'exige pas les deux canaux.
  if (!data.email && !data.phone) errors.contact = true;
  if (data.email && !EMAIL.test(data.email)) errors.email = true;
  if (data.phone && !isValidPhone(data.phone)) errors.phone = true;
  if (data.message.length < 10) errors.message = true;
  if (!data.consent) errors.consent = true;

  return { data, errors };
}
