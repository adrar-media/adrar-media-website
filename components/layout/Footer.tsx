import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { activeSocials, contact, whatsappLink } from "@/config/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import {
  FooterContactForm,
  type FooterFormLabels,
} from "@/components/forms/FooterContactForm";
import { sendLeadAction } from "@/lib/leads/actions";
import { FooterContactSection } from "@/components/layout/FooterContactSection";

/**
 * Pied de page.
 *
 * Les coordonnées proviennent de la configuration d'environnement. Tant
 * qu'une valeur n'est pas fournie, le lien correspondant n'est simplement pas
 * rendu — aucune donnée de contact n'est inventée ni simulée.
 *
 * LE FORMULAIRE COURT OUVRE LE PIED DE PAGE, avant les colonnes de liens.
 *
 * Un pied de page est l'endroit où l'on arrive quand on a fini de lire et
 * qu'on n'a pas cliqué. Jusqu'ici il ne proposait que des liens : le visiteur
 * qui avait une question devait ouvrir une nouvelle page, la charger, puis
 * remplir onze champs de devis pour la poser. Trois champs sur place suppriment
 * ces trois étapes, et c'est le seul point de conversion présent sur TOUTES les
 * pages du site.
 *
 * Il est placé au-dessus des colonnes plutôt qu'à côté : glissé dans la grille
 * à quatre colonnes, ses champs auraient fait 260 px de large — une largeur à
 * laquelle personne n'écrit un message. Sur cinq colonnes, avec les
 * coordonnées en vis-à-vis, il se lit comme une invitation et non comme un
 * bloc de service de plus.
 */
export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "common");
  const year = new Date().getFullYear();
  const whatsapp = whatsappLink();
  const socials = activeSocials();

  /**
   * Tant qu'aucune coordonnée n'est publiée, la colonne « Contact » se
   * réduisait à son seul titre : un intitulé suivi de rien, ce qui se lit
   * comme une colonne cassée et non comme une absence assumée. Elle n'est
   * donc rendue que si elle a quelque chose à montrer.
   */
  const hasContactColumn =
    Boolean(contact.email) ||
    Boolean(contact.emailRecruitment) ||
    Boolean(contact.phoneDisplay && contact.phoneE164) ||
    Boolean(contact.landlineDisplay && contact.landlineE164) ||
    Boolean(whatsapp) ||
    Boolean(contact.location) ||
    socials.length > 0;

  const navLinks = [
    { label: t("nav.services"), href: href(locale, "services") },
    { label: t("nav.solutions"), href: href(locale, "solutions") },
    { label: t("nav.work"), href: href(locale, "realisations") },
    { label: t("nav.method"), href: href(locale, "methode") },
    { label: t("nav.about"), href: href(locale, "a-propos") },
    { label: t("nav.blog"), href: href(locale, "blog") },
    { label: t("nav.contact"), href: href(locale, "contact") },
  ];

  const serviceLinks = [
    t("services.strategy"),
    t("services.social"),
    t("services.content"),
    t("services.brand"),
    t("services.production"),
    t("services.performance"),
    t("services.web"),
  ];

  const formLabels: FooterFormLabels = {
    title: t("footer.form.title"),
    intro: t("footer.form.intro"),
    name: t("footer.form.name"),
    email: t("footer.form.email"),
    message: t("footer.form.message"),
    messagePlaceholder: t("footer.form.messagePlaceholder"),
    privacyConsent: t("footer.form.privacyConsent"),
    privacyLink: t("footer.form.privacyLink"),
    submit: t("footer.form.submit"),
    sending: t("footer.form.sending"),
    sentTitle: t("footer.form.sentTitle"),
    sentBody: t("footer.form.sentBody"),
    trapLabel: t("footer.form.trapLabel"),
    errors: {
      name: t("footer.form.errors.name"),
      email: t("footer.form.errors.email"),
      message: t("footer.form.errors.message"),
      consent: t("footer.form.errors.consent"),
    },
    fallbackNotice: t("footer.form.fallbackNotice"),
    fallbackAction: t("footer.form.fallbackAction"),
    rateLimited: t("footer.form.rateLimited"),
  };

  return (
    <footer className="bg-surface text-white">
      <Container className="py-section">
        {/* ------------------------------------------------------------------
            PRISE DE CONTACT — la seule zone active du pied de page.
            ------------------------------------------------------------------ */}
        <FooterContactSection contactHref={href(locale, "contact")}>
          <div
            data-contact-form-location="footer"
            className="grid gap-10 border-b border-white/15 pb-16 md:grid-cols-12 md:gap-grid md:pb-20"
          >
            <div className="md:col-span-5">
              <h2 className="text-h3 text-white">{formLabels.title}</h2>
              <p className="mt-4 max-w-prose text-body text-white/70">
                {formLabels.intro}
              </p>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <FooterContactForm
                labels={formLabels}
                locale={locale}
                action={sendLeadAction}
                email={contact.email}
                subjectPrefix={t("brand.name")}
                privacyHref={href(locale, "politique-confidentialite")}
              />
            </div>
          </div>
        </FooterContactSection>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="text-h3">{t("brand.name")}</p>
            <p className="mt-2 text-body-lg text-beige">{t("brand.tagline")}</p>
          </div>

          <nav className="md:col-span-2" aria-label={t("footer.navigation")}>
            <p className="eyebrow mb-5 text-light">{t("footer.navigation")}</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-small text-white/70 transition-colors duration-fast ease-brand hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5 text-light">{t("footer.services")}</p>
            <ul className="flex flex-col gap-3">
              {serviceLinks.map((service) => (
                <li key={service} className="text-small text-white/70">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {hasContactColumn && (
          <div className="md:col-span-4">
            <p className="eyebrow mb-5 text-light">{t("footer.contact")}</p>

            {/*
              QUATRE CANAUX, CHACUN ÉTIQUETÉ.

              La colonne empilait auparavant des valeurs nues : une adresse,
              un numéro, l'un sous l'autre. Avec deux lignes téléphoniques et
              deux adresses e-mail, une liste sans étiquettes devient une
              devinette — laquelle est le bureau, laquelle reçoit les
              candidatures. Chaque entrée porte donc son intitulé au-dessus de
              sa valeur, en petit ; c'est ce qui permet d'en ajouter sans que
              la colonne cesse d'être lisible.

              `dir="ltr"` sur les numéros : un numéro de téléphone se lit de
              gauche à droite dans toutes les langues, y compris en arabe, où
              l'algorithme bidirectionnel le retournerait autrement.
            */}
            <ul className="flex flex-col gap-5 text-small">
              {contact.phoneDisplay && contact.phoneE164 && (
                <li>
                  <p className="text-caption text-white/70">
                    {t("footer.channels.mobile")}
                  </p>
                  <a
                    href={`tel:${contact.phoneE164}`}
                    dir="ltr"
                    className="link-underline mt-1 inline-block text-white/80 transition-colors duration-fast hover:text-white"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>
              )}

              {contact.landlineDisplay && contact.landlineE164 && (
                <li>
                  <p className="text-caption text-white/70">
                    {t("footer.channels.landline")}
                  </p>
                  <a
                    href={`tel:${contact.landlineE164}`}
                    dir="ltr"
                    className="link-underline mt-1 inline-block text-white/80 transition-colors duration-fast hover:text-white"
                  >
                    {contact.landlineDisplay}
                  </a>
                </li>
              )}

              {contact.email && (
                <li>
                  <p className="text-caption text-white/70">
                    {t("footer.channels.email")}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="link-underline mt-1 inline-block break-all text-white/80 transition-colors duration-fast hover:text-white"
                  >
                    {contact.email}
                  </a>
                </li>
              )}

              {contact.emailRecruitment && (
                <li>
                  <p className="text-caption text-white/70">
                    {t("footer.channels.recruitment")}
                  </p>
                  <a
                    href={`mailto:${contact.emailRecruitment}`}
                    className="link-underline mt-1 inline-block break-all text-white/80 transition-colors duration-fast hover:text-white"
                  >
                    {contact.emailRecruitment}
                  </a>
                </li>
              )}

              {contact.location && (
                <li>
                  <p className="text-caption text-white/70">
                    {t("footer.channels.address")}
                  </p>
                  <p className="mt-1 text-white/80">{contact.location}</p>
                </li>
              )}
            </ul>

            {/*
              LES CANAUX SOCIAUX SONT DES ICÔNES, PLUS DES MOTS.

              La colonne alignait auparavant « WhatsApp », « Instagram »,
              « LinkedIn » en petit texte gris, sous quatre autres lignes de
              petit texte gris. Rien ne les distinguait d'une coordonnée de
              plus à lire. Un logo de réseau se reconnaît sans être lu, ce qui
              est exactement ce qu'on demande à un pied de page.
            */}
            {(whatsapp || socials.length > 0) && (
              <>
                <p className="eyebrow mb-2 mt-8 text-light">
                  {t("footer.follow")}
                </p>
                <SocialLinks
                  label={t("footer.follow")}
                  whatsappLabel={t("cta.whatsapp")}
                  tone="dark"
                />
              </>
            )}
          </div>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-small text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {t("brand.name")}. {t("footer.rights")}
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link
                href={href(locale, "mentions-legales")}
                className="link-underline transition-colors duration-fast hover:text-white"
              >
                {t("footer.legal")}
              </Link>
            </li>
            <li>
              <Link
                href={href(locale, "politique-confidentialite")}
                className="link-underline transition-colors duration-fast hover:text-white"
              >
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
