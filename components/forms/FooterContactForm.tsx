"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import type { Locale } from "@/config/i18n";
import type { QuoteResult } from "@/lib/leads/types";
import { Button } from "@/components/buttons/Button";
import { cn } from "@/lib/utils";

export interface FooterFormLabels {
  title: string;
  intro: string;
  name: string;
  email: string;
  message: string;
  messagePlaceholder: string;
  privacyConsent: string;
  privacyLink: string;
  submit: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
  trapLabel: string;
  errors: {
    name: string;
    email: string;
    message: string;
    consent: string;
  };
  /** Aucun service d'envoi configuré, ou envoi en échec. */
  fallbackNotice: string;
  fallbackAction: string;
  rateLimited: string;
}

interface FooterContactFormProps {
  labels: FooterFormLabels;
  locale: Locale;
  /** Action serveur. Reçue en propriété : le formulaire reste de l'interface. */
  action: (input: unknown) => Promise<QuoteResult>;
  /** Adresse de repli, si la direction l'a publiée. Peut être vide. */
  email: string;
  /** Objet du message de repli. */
  subjectPrefix: string;
  privacyHref: string;
}

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field | "consent", string>>;

/**
 * Formulaire de contact du pied de page.
 *
 * POURQUOI UNE VERSION COURTE PLUTÔT QUE LE FORMULAIRE DE DEVIS
 *
 * Le devis demande onze champs — budget, échéance, expertises — parce qu'il
 * s'adresse à quelqu'un qui a DÉJÀ décidé de consulter. Le pied de page attrape
 * l'autre moitié : celui qui a fini de lire une page, qui a une question, et
 * qui ne la posera pas s'il faut d'abord choisir une fourchette budgétaire. Les
 * trois champs ici sont le minimum que le serveur exige pour qu'une demande
 * soit exploitable — un nom, un moyen de rappeler, et de quoi il s'agit.
 *
 * C'EST LE MÊME TUYAU. La saisie part vers la même action serveur, revalidée
 * par les mêmes règles, limitée par le même compteur de débit et transmise à la
 * même boîte de réception que le devis. Un second circuit d'envoi serait un
 * second endroit où une demande peut se perdre sans que personne le remarque.
 *
 * ET IL NE FAIT JAMAIS SEMBLANT. Si aucun service d'envoi n'est configuré sur
 * le déploiement, ou si l'envoi échoue, le formulaire le dit et propose au
 * visiteur de transmettre lui-même son message — la saisie est reportée dans un
 * brouillon d'e-mail prérempli. Afficher un « merci » à quelqu'un dont le
 * message n'est arrivé nulle part est la pire issue possible pour le seul
 * élément commercial présent sur toutes les pages du site.
 */
export function FooterContactForm({
  labels,
  locale,
  action,
  email,
  subjectPrefix,
  privacyHref,
}: FooterContactFormProps) {
  const id = useId();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<"form" | "sent">("form");
  const [notice, setNotice] = useState<"fallback" | "rate-limited" | null>(null);
  const [pending, startTransition] = useTransition();
  /**
   * Champ piège. Invisible et hors du parcours au clavier : un humain ne peut
   * pas le remplir, un robot qui complète tout le fera. Le serveur écarte alors
   * la demande sans consommer de quota d'envoi.
   */
  const [trap, setTrap] = useState("");

  const set =
    (key: Field) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      /* L'erreur disparaît à la correction, pas au prochain envoi : garder un
         champ en rouge pendant qu'on le répare est une punition, pas une aide. */
      setErrors((current) =>
        current[key] ? { ...current, [key]: undefined } : current,
      );
    };

  /**
   * Mêmes règles que `lib/leads/validate.ts`. Rejouées ici pour éviter un
   * aller-retour réseau sur une saisie qu'on sait déjà incomplète — jamais
   * comme barrière, le serveur reste seul juge.
   */
  const validate = (): Errors => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = labels.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = labels.errors.email;
    }
    if (values.message.trim().length < 10) next.message = labels.errors.message;
    if (!consent) next.consent = labels.errors.consent;
    return next;
  };

  /** Brouillon de repli — la saisie n'est jamais perdue, seulement redirigée. */
  const mailtoHref = () => {
    const body = `${values.name}\n${values.email}\n\n${values.message}`;
    return `mailto:${email}?subject=${encodeURIComponent(
      subjectPrefix,
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setNotice(null);
    startTransition(async () => {
      const result = await action({
        name: values.name,
        email: values.email,
        message: values.message,
        company: "",
        phone: "",
        services: [],
        budget: "",
        timeline: "",
        consent,
        locale,
        /*
         * Le formulaire court se déclare : il aboutit dans la même boîte que
         * le devis, et sans cela les deux y arrivent sous le même objet.
         */
        source: "contact",
        trap,
      });

      if (result.status === "sent") {
        setPhase("sent");
        return;
      }
      if (result.status === "invalid") {
        setErrors({
          ...(result.errors.name && { name: labels.errors.name }),
          ...(result.errors.email && { email: labels.errors.email }),
          ...(result.errors.message && { message: labels.errors.message }),
          ...(result.errors.consent && { consent: labels.errors.consent }),
        });
        return;
      }
      setNotice(result.status === "rate-limited" ? "rate-limited" : "fallback");
    });
  };

  /*
   * Champ sur fond sombre. Le pied de page est en Deep Blue : les champs du
   * formulaire de devis, réglés pour le fond crème, y donneraient des boîtes
   * blanches qui trouent la composition.
   */
  const field =
    "w-full rounded-md border bg-white/[0.06] px-4 py-3 text-body text-white transition-colors duration-fast ease-standard placeholder:text-white/70 focus:border-light focus:outline-none";

  if (phase === "sent") {
    return (
      <div role="status" className="rounded-lg border border-white/15 p-6">
        <p className="text-h4 text-white">{labels.sentTitle}</p>
        <p className="mt-2 text-small text-white/70">{labels.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor={`${id}-name`} className="sr-only">
          {labels.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder={labels.name}
          value={values.name}
          onChange={set("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          className={cn(field, errors.name ? "border-red-300" : "border-white/15")}
        />
        {errors.name && (
          <p id={`${id}-name-error`} className="mt-1.5 text-caption text-red-300">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="sr-only">
          {labels.email}
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          placeholder={labels.email}
          value={values.email}
          onChange={set("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          className={cn(field, errors.email ? "border-red-300" : "border-white/15")}
        />
        {errors.email && (
          <p id={`${id}-email-error`} className="mt-1.5 text-caption text-red-300">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="sr-only">
          {labels.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          placeholder={labels.messagePlaceholder}
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          className={cn(
            field,
            "resize-y",
            errors.message ? "border-red-300" : "border-white/15",
          )}
        />
        {errors.message && (
          <p
            id={`${id}-message-error`}
            className="mt-1.5 text-caption text-red-300"
          >
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${id}-consent`}
          className="flex cursor-pointer items-start gap-3 text-caption text-white/85"
        >
          <input
            id={`${id}-consent`}
            name="privacy-consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (event.target.checked) {
                setErrors((current) => ({ ...current, consent: undefined }));
              }
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-light"
          />
          <span>
            {labels.privacyConsent}{" "}
            <Link
              href={privacyHref}
              className="text-light underline decoration-1 underline-offset-4 hover:text-white"
            >
              {labels.privacyLink}
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p id={`${id}-consent-error`} role="alert" className="mt-1.5 text-caption text-red-300">
            {errors.consent}
          </p>
        )}
      </div>

      {/*
        Piège à robots. `aria-hidden` et `tabIndex={-1}` le retirent du parcours
        au clavier comme de la restitution vocale ; `hidden` seul suffirait à le
        masquer mais certains robots ignorent l'attribut, d'où le retrait
        visuel ET l'exclusion sémantique.
      */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden">
        <label htmlFor={`${id}-trap`}>{labels.trapLabel}</label>
        <input
          id={`${id}-trap`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
        />
      </div>

      {notice && (
        <p role="status" className="text-caption text-white/70">
          {notice === "rate-limited" ? labels.rateLimited : labels.fallbackNotice}{" "}
          {notice === "fallback" && email && (
            <a
              href={mailtoHref()}
              className="link-underline text-light transition-colors duration-fast hover:text-white"
            >
              {labels.fallbackAction}
            </a>
          )}
        </p>
      )}

      <Button type="submit" variant="invert" disabled={pending} className="self-start">
        {pending ? labels.sending : labels.submit}
      </Button>
    </form>
  );
}
