import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { activeSocials, contact, whatsappLink } from "@/config/site";

/**
 * Pied de page.
 *
 * Les coordonnées proviennent de la configuration d'environnement. Tant
 * qu'une valeur n'est pas fournie, le lien correspondant n'est simplement pas
 * rendu — aucune donnée de contact n'est inventée ni simulée.
 */
export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "common");
  const year = new Date().getFullYear();
  const whatsapp = whatsappLink();
  const socials = activeSocials();

  const navLinks = [
    { label: t("nav.services"), href: href(locale, "services") },
    { label: t("nav.work"), href: href(locale, "realisations") },
    { label: t("nav.method"), href: href(locale, "methode") },
    { label: t("nav.about"), href: href(locale, "a-propos") },
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

  return (
    <footer className="bg-deep text-white">
      <Container className="py-section">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-h3">{t("brand.name")}</p>
            <p className="mt-2 text-body-lg text-beige">{t("brand.tagline")}</p>
          </div>

          <nav className="md:col-span-3" aria-label={t("footer.navigation")}>
            <p className="eyebrow mb-5 text-light">{t("footer.navigation")}</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-white/70 transition-colors duration-fast ease-brand hover:text-white"
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

          <div className="md:col-span-2">
            <p className="eyebrow mb-5 text-light">{t("footer.contact")}</p>
            <ul className="flex flex-col gap-3 text-small text-white/70">
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors duration-fast hover:text-white"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phoneDisplay && contact.phoneE164 && (
                <li>
                  <a
                    href={`tel:${contact.phoneE164}`}
                    dir="ltr"
                    className="transition-colors duration-fast hover:text-white"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-fast hover:text-white"
                  >
                    {t("cta.whatsapp")}
                  </a>
                </li>
              )}
              {contact.location && <li>{contact.location}</li>}
            </ul>

            {socials.length > 0 && (
              <>
                <p className="eyebrow mb-3 mt-8 text-light">
                  {t("footer.follow")}
                </p>
                <ul className="flex flex-wrap gap-4 text-small text-white/70">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-fast hover:text-white"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-small text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {t("brand.name")}. {t("footer.rights")}
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link
                href={href(locale, "mentions-legales")}
                className="transition-colors duration-fast hover:text-white"
              >
                {t("footer.legal")}
              </Link>
            </li>
            <li>
              <Link
                href={href(locale, "politique-confidentialite")}
                className="transition-colors duration-fast hover:text-white"
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
