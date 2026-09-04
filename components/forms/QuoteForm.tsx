"use client";

import { useId, useMemo, useRef, useState, useTransition } from "react";
import type { Locale } from "@/config/i18n";
import { href } from "@/lib/i18n/routing";
import type { QuoteResult } from "@/lib/leads/types";
import { isValidPhone } from "@/lib/leads/validate";
import { trackEvent } from "@/lib/analytics/events";
import { Button } from "@/components/buttons/Button";
import { cn } from "@/lib/utils";

export interface QuoteFormLabels {
  legendProject: string;
  legendContact: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  services: string;
  servicesHint: string;
  budget: string;
  timeline: string;
  message: string;
  messagePlaceholder: string;
  privacyConsent: string;
  privacyLink: string;
  optional: string;
  required: string;
  contactRequirement: string;
  step: string;
  continueToProject: string;
  backToContact: string;
  choose: string;
  submit: string;
  budgets: string[];
  timelines: string[];
  errors: {
    name: string;
    email: string;
    phone: string;
    contact: string;
    message: string;
    consent: string;
  };
  sending: string;
  trapLabel: string;
  sentTitle: string;
  sentBody: string;
  sentHome: string;
  sentWork: string;
  failedNotice: string;
  rateLimitedNotice: string;
  summaryTitle: string;
  summaryHint: string;
  sendEmail: string;
  sendWhatsapp: string;
  edit: string;
  noChannel: string;
  copy: string;
  copied: string;
}

interface QuoteFormProps {
  labels: QuoteFormLabels;
  locale: Locale;
  /**
   * Action serveur de traitement. Reçue en propriété plutôt qu'importée : le
   * formulaire reste un composant d'interface, indépendant du point d'entrée
   * qui l'exploite.
   */
  action: (input: unknown) => Promise<QuoteResult>;
  /** Intitulés traduits des sept expertises. */
  serviceOptions: string[];
  /** Adresse de destination, si la direction l'a publiée. */
  email: string;
  /** Numéro WhatsApp au format international, sans « + ». */
  whatsapp: string;
  subjectPrefix: string;
}

type Errors = Partial<
  Record<"name" | "email" | "phone" | "contact" | "message" | "consent", string>
>;

const fieldBase =
  "w-full rounded-md border bg-canvas-raised px-4 py-3.5 text-body text-anthracite transition-colors duration-fast ease-standard placeholder:text-anthracite/70 focus:border-atlas focus:outline-none";

/**
 * Formulaire de demande de devis.
 *
 * Deux chemins, dans cet ordre :
 *
 * 1. ENVOI RÉEL. La saisie part vers une action serveur qui revalide tout,
 *    limite le débit et transmet la demande à la boîte de réception d'Adrar
 *    Media. C'est le chemin normal dès qu'un service d'envoi est configuré.
 *
 * 2. ENVOI MANUEL. Si aucun service n'est configuré sur le déploiement, ou si
 *    l'envoi échoue, le formulaire ne fait pas semblant : il compose le
 *    message mis en forme et le visiteur le transmet lui-même, par e-mail ou
 *    WhatsApp. Afficher un « merci » à quelqu'un dont la demande n'est arrivée
 *    nulle part serait la pire issue possible pour un formulaire dont tout
 *    l'objet est commercial.
 *
 * La validation du navigateur est une commodité de saisie, jamais une
 * barrière : les mêmes règles sont rejouées côté serveur, où elles ne peuvent
 * pas être contournées.
 */
export function QuoteForm({
  labels,
  locale,
  action,
  serviceOptions,
  email,
  whatsapp,
  subjectPrefix,
}: QuoteFormProps) {
  const id = useId();
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [services, setServices] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [mobileStep, setMobileStep] = useState<1 | 2>(1);
  /**
   * `form` — saisie ; `review` — envoi manuel proposé ; `sent` — demande
   * transmise. Un seul état plutôt que trois booléens : deux écrans ne peuvent
   * jamais s'afficher ensemble, et l'ordre des mises à jour ne peut pas
   * produire un état intermédiaire incohérent.
   */
  const [phase, setPhase] = useState<"form" | "review" | "sent">("form");
  /** Raison affichée au-dessus de l'envoi manuel, quand il fait suite à un échec. */
  const [notice, setNotice] = useState<"failed" | "rate-limited" | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  /**
   * Champ piège. Invisible et hors du parcours au clavier : un humain ne peut
   * pas le remplir, un robot qui complète tout le fera. Le serveur écarte
   * alors la demande sans consommer de quota d'envoi.
   */
  const [trap, setTrap] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const contactStepRef = useRef<HTMLFieldSetElement>(null);
  const projectStepRef = useRef<HTMLFieldSetElement>(null);

  const set = (key: keyof typeof values) => (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const toggleService = (label: string) =>
    setServices((prev) =>
      prev.includes(label)
        ? prev.filter((entry) => entry !== label)
        : [...prev, label],
    );

  /** Message final, lisible tel quel par un humain dans une boîte mail. */
  const summary = useMemo(() => {
    /*
     * Les champs facultatifs non remplis sont retirés, et non rendus vides :
     * une ligne « Téléphone : » sans valeur, ou pire une ligne blanche à sa
     * place, donne un message troué à la lecture.
     *
     * Le corps est assemblé séparément de l'en-tête pour que la seule ligne
     * vide du message soit celle qui les sépare — un filtre unique sur les
     * chaînes vides supprimerait aussi ce séparateur voulu.
     */
    const fields: [string, string][] = [
      [labels.name, values.name],
      [labels.company, values.company],
      [labels.email, values.email],
      [labels.phone, values.phone],
      [labels.services, services.join(", ")],
      [labels.budget, values.budget],
      [labels.timeline, values.timeline],
    ];

    const filled = fields
      .filter(([, value]) => value.trim().length > 0)
      .map(([label, value]) => `${label} : ${value}`)
      .join("\n");

    return `${filled}\n\n${labels.message} :\n${values.message}`;
  }, [labels, values, services]);

  const validateContact = (): Errors => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = labels.errors.name;
    // On n'exige pas les deux : un numéro suffit à rappeler quelqu'un.
    if (!values.email.trim() && !values.phone.trim()) {
      next.contact = labels.errors.contact;
    }
    if (values.email.trim() && !/^\S+@\S+\.\S{2,}$/.test(values.email)) {
      next.email = labels.errors.email;
    }
    if (values.phone.trim() && !isValidPhone(values.phone)) {
      next.phone = labels.errors.phone;
    }
    return next;
  };

  const validate = (): Errors => {
    const next = validateContact();
    if (values.message.trim().length < 10) next.message = labels.errors.message;
    if (!consent) next.consent = labels.errors.consent;
    return next;
  };

  /** Place le curseur sur le premier champ en défaut. */
  const focusFirstError = (found: Errors) => {
    const first = Object.keys(found)[0];
    if (!first) return;
    const field = first === "contact" ? "email" : first;
    setMobileStep(
      field === "name" || field === "email" || field === "phone" ? 1 : 2,
    );
    // Le premier champ en défaut reçoit le focus : sans cela l'erreur peut se
    // produire hors de l'écran et le formulaire paraît ne rien faire.
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-field="${field}"]`)?.focus();
    });
  };

  const continueToProject = () => {
    const found = validateContact();
    setErrors((current) => ({
      ...current,
      name: found.name,
      email: found.email,
      phone: found.phone,
      contact: found.contact,
    }));
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setMobileStep(2);
    requestAnimationFrame(() => projectStepRef.current?.focus());
  };

  const backToContact = () => {
    setMobileStep(1);
    requestAnimationFrame(() => contactStepRef.current?.focus());
  };

  /** Bascule vers l'envoi manuel, en annonçant le cas échéant pourquoi. */
  const fallBackToManual = (reason: "failed" | "rate-limited" | null) => {
    setNotice(reason);
    setPhase("review");
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    startTransition(async () => {
      let result: QuoteResult;
      try {
        result = await action({
          ...values,
          services,
          consent,
          locale,
          source: "quote",
          trap,
        });
      } catch {
        // Coupure réseau, action indisponible : la demande n'est pas perdue,
        // elle repart par le canal manuel.
        result = { status: "error" };
      }

      switch (result.status) {
        case "sent":
          setNotice(null);
          trackEvent("quote_form_submit", {
            page_path: window.location.pathname,
          });
          setPhase("sent");
          requestAnimationFrame(() => sentRef.current?.focus());
          return;
        case "invalid": {
          // Le serveur a refusé ce que le navigateur avait laissé passer :
          // on rejoue ses verdicts sur les mêmes champs.
          const serverErrors: Errors = {};
          if (result.errors.name) serverErrors.name = labels.errors.name;
          if (result.errors.email) serverErrors.email = labels.errors.email;
          if (result.errors.phone) serverErrors.phone = labels.errors.phone;
          if (result.errors.contact) serverErrors.contact = labels.errors.contact;
          if (result.errors.message) serverErrors.message = labels.errors.message;
          if (result.errors.consent) serverErrors.consent = labels.errors.consent;
          setErrors(serverErrors);
          focusFirstError(serverErrors);
          return;
        }
        case "rate-limited":
          fallBackToManual("rate-limited");
          return;
        case "error":
          fallBackToManual("failed");
          return;
        case "unconfigured":
        default:
          // Aucun service d'envoi sur ce déploiement : ce n'est pas un échec,
          // on ne l'annonce donc pas comme tel.
          fallBackToManual(null);
      }
    });
  };

  const subject = `${subjectPrefix}${values.name ? ` — ${values.name}` : ""}`;
  const mailHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`
    : null;
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`${subject}\n\n${summary}`)}`
    : null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission) : le texte
      // reste sélectionnable à l'écran, on n'annonce simplement pas la copie.
      setCopied(false);
    }
  };

  if (phase === "sent") {
    return (
      <div
        ref={sentRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-atlas/25 bg-canvas-raised p-8 focus:outline-none md:p-10"
      >
        <span
          aria-hidden
          className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-atlas text-canvas"
        >
          ✓
        </span>
        <h2 className="mt-6 text-h3 text-ink">{labels.sentTitle}</h2>
        <p className="mt-4 max-w-prose text-body text-anthracite/70">
          {labels.sentBody}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={href(locale)} size="lg" arrow>
            {labels.sentHome}
          </Button>
          <Button
            href={href(locale, "realisations")}
            variant="secondary"
            size="lg"
          >
            {labels.sentWork}
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div
        ref={summaryRef}
        tabIndex={-1}
        className="rounded-lg border border-anthracite/[0.12] bg-canvas-raised p-8 focus:outline-none md:p-10"
      >
        {notice && (
          <p
            role="alert"
            className="mb-8 rounded-md border border-beige bg-beige-soft/60 px-5 py-4 text-small text-anthracite/80"
          >
            {notice === "failed"
              ? labels.failedNotice
              : labels.rateLimitedNotice}
          </p>
        )}

        <h2 className="text-h3 text-ink">{labels.summaryTitle}</h2>
        <p className="mt-3 text-small text-anthracite/70">
          {labels.summaryHint}
        </p>

        <pre className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-md bg-canvas p-6 text-small text-anthracite/80">
          {summary}
        </pre>

        <div className="mt-8 flex flex-wrap gap-3">
          {mailHref && (
            <Button href={mailHref} external size="lg" arrow>
              {labels.sendEmail}
            </Button>
          )}
          {whatsappHref && (
            <Button
              href={whatsappHref}
              external
              variant={mailHref ? "secondary" : "primary"}
              size="lg"
            >
              {labels.sendWhatsapp}
            </Button>
          )}
          <Button variant="secondary" size="lg" onClick={copy}>
            {copied ? labels.copied : labels.copy}
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setPhase("form");
              setNotice(null);
              setCopied(false);
            }}
          >
            {labels.edit}
          </Button>
        </div>

        {!mailHref && !whatsappHref && (
          <p className="mt-6 text-small text-anthracite/70">
            {labels.noChannel}
          </p>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-12">
      <div className="md:hidden" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <p className="text-caption text-atlas">
            {labels.step} <span dir="ltr">{mobileStep}/2</span>
          </p>
          <p className="text-small text-anthracite/70">
            {mobileStep === 1 ? labels.legendContact : labels.legendProject}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2" aria-hidden>
          <span className="h-1 rounded-pill bg-atlas" />
          <span
            className={cn(
              "h-1 rounded-pill",
              mobileStep === 2 ? "bg-atlas" : "bg-anthracite/15",
            )}
          />
        </div>
      </div>

      <fieldset
        ref={contactStepRef}
        tabIndex={-1}
        className={cn(
          "border-0 p-0 focus:outline-none",
          mobileStep !== 1 && "hidden md:block",
        )}
      >
        <legend className="text-caption text-atlas">
          {labels.legendContact}
        </legend>

        <p
          id={`${id}-contact-requirement`}
          className="mt-4 rounded-md bg-beige-soft/60 px-4 py-3 text-small text-anthracite/80"
        >
          {labels.contactRequirement}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field
            id={`${id}-name`}
            field="name"
            label={labels.name}
            hint={labels.required}
            error={errors.name}
          >
            <input
              id={`${id}-name`}
              data-field="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
              className={cn(
                fieldBase,
                errors.name ? "border-red-600" : "border-anthracite/15",
              )}
            />
          </Field>

          <Field
            id={`${id}-company`}
            field="company"
            label={labels.company}
            hint={labels.optional}
          >
            <input
              id={`${id}-company`}
              data-field="company"
              name="organization"
              autoComplete="organization"
              value={values.company}
              onChange={set("company")}
              className={cn(fieldBase, "border-anthracite/15")}
            />
          </Field>

          <Field
            id={`${id}-email`}
            field="email"
            label={labels.email}
            error={errors.email ?? errors.contact}
          >
            <input
              id={`${id}-email`}
              data-field="email"
              type="email"
              inputMode="email"
              name="email"
              autoComplete="email"
              dir="ltr"
              value={values.email}
              onChange={set("email")}
              aria-invalid={Boolean(errors.email ?? errors.contact)}
              aria-describedby={[
                `${id}-contact-requirement`,
                errors.email ?? errors.contact ? `${id}-email-error` : null,
              ]
                .filter(Boolean)
                .join(" ")}
              className={cn(
                fieldBase,
                errors.email ?? errors.contact
                  ? "border-red-600"
                  : "border-anthracite/15",
              )}
            />
          </Field>

          <Field
            id={`${id}-phone`}
            field="phone"
            label={labels.phone}
            error={errors.phone}
          >
            <input
              id={`${id}-phone`}
              data-field="phone"
              type="tel"
              inputMode="tel"
              name="tel"
              autoComplete="tel"
              dir="ltr"
              value={values.phone}
              onChange={set("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={[
                `${id}-contact-requirement`,
                errors.phone ? `${id}-phone-error` : null,
              ]
                .filter(Boolean)
                .join(" ")}
              className={cn(
                fieldBase,
                errors.phone ? "border-red-600" : "border-anthracite/15",
              )}
            />
          </Field>
        </div>

        <div className="mt-8 md:hidden">
          <Button
            type="button"
            size="lg"
            arrow
            className="w-full"
            onClick={continueToProject}
          >
            {labels.continueToProject}
          </Button>
        </div>
      </fieldset>

      <fieldset
        ref={projectStepRef}
        tabIndex={-1}
        className={cn(
          "border-0 p-0 focus:outline-none",
          mobileStep !== 2 && "hidden md:block",
        )}
      >
        <legend className="text-caption text-atlas">
          {labels.legendProject}
        </legend>

        <div className="mt-6 flex items-baseline justify-between gap-3">
          <p className="text-small text-anthracite/70">{labels.services}</p>
          <span className="text-caption text-anthracite/70">
            {labels.optional}
          </span>
        </div>
        <p className="mt-1 text-caption text-anthracite/70">
          {labels.servicesHint}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {serviceOptions.map((option) => {
            const checked = services.includes(option);
            return (
              <label
                key={option}
                className={cn(
                  "cursor-pointer rounded-pill border px-4 py-2.5 text-small transition-colors duration-fast ease-standard",
                  checked
                    ? "border-atlas bg-atlas text-canvas"
                    : "border-anthracite/15 bg-canvas-raised text-anthracite hover:border-anthracite/35",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleService(option)}
                />
                {option}
              </label>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Field
            id={`${id}-budget`}
            field="budget"
            label={labels.budget}
            hint={labels.optional}
          >
            <select
              id={`${id}-budget`}
              data-field="budget"
              value={values.budget}
              onChange={set("budget")}
              className={cn(fieldBase, "border-anthracite/15")}
            >
              <option value="">{labels.choose}</option>
              {labels.budgets.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`${id}-timeline`}
            field="timeline"
            label={labels.timeline}
            hint={labels.optional}
          >
            <select
              id={`${id}-timeline`}
              data-field="timeline"
              value={values.timeline}
              onChange={set("timeline")}
              className={cn(fieldBase, "border-anthracite/15")}
            >
              <option value="">{labels.choose}</option>
              {labels.timelines.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6">
          <Field
            id={`${id}-message`}
            field="message"
            label={labels.message}
            hint={labels.required}
            error={errors.message}
          >
            <textarea
              id={`${id}-message`}
              data-field="message"
              rows={6}
              value={values.message}
              onChange={set("message")}
              placeholder={labels.messagePlaceholder}
              aria-invalid={Boolean(errors.message)}
              className={cn(
                fieldBase,
                "resize-y",
                errors.message ? "border-red-600" : "border-anthracite/15",
              )}
            />
          </Field>
        </div>
      </fieldset>

      {/*
        Champ piège. `sr-only` le retire de l'écran sans le retirer du DOM —
        `display:none` serait ignoré par une partie des robots, qui remplissent
        alors tout ce qu'ils trouvent. `tabIndex={-1}` et `aria-hidden` le
        sortent du parcours clavier et des lecteurs d'écran : un visiteur ne
        peut pas l'atteindre par accident.
      */}
      <div className="sr-only" aria-hidden>
        <label htmlFor={`${id}-website`}>{labels.trapLabel}</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
        />
      </div>

      <div className={cn(mobileStep === 1 && "hidden md:block")}>
        <label
          htmlFor={`${id}-consent`}
          className="flex max-w-prose cursor-pointer items-start gap-3 text-small text-anthracite/80"
        >
          <input
            id={`${id}-consent`}
            data-field="consent"
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
            className="mt-1 h-5 w-5 shrink-0 accent-atlas"
          />
          <span>
            {labels.privacyConsent}{" "}
            <a
              href={href(locale, "politique-confidentialite")}
              className="text-atlas-dark underline decoration-1 underline-offset-4 dark:text-light"
            >
              {labels.privacyLink}
            </a>
          </span>
        </label>
        {errors.consent && (
          <p
            id={`${id}-consent-error`}
            role="alert"
            className="mt-2 text-caption text-red-700 dark:text-red-300"
          >
            {errors.consent}
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 md:block",
          mobileStep === 1 && "hidden md:block",
        )}
      >
        <Button
          type="submit"
          size="lg"
          arrow
          disabled={pending}
          aria-busy={pending}
          className="w-full md:w-auto"
        >
          {pending ? labels.sending : labels.submit}
        </Button>
        <Button
          type="button"
          variant="link"
          className="min-h-11 md:hidden"
          onClick={backToContact}
        >
          {labels.backToContact}
        </Button>
      </div>
    </form>
  );
}

/** Étiquette, indication et message d'erreur d'un champ. */
function Field({
  id,
  field,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  field: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-small text-anthracite/75"
      >
        {label}
        {hint && <span className="text-caption text-anthracite/70">{hint}</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          data-error-for={field}
          role="alert"
          className="mt-2 text-small text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
