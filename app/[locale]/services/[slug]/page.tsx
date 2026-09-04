import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localeNames, locales, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/structured-data";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { SectionImage } from "@/components/media/SectionImage";
import { serviceImagery } from "@/data/imagery";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/layout/CTASection";
import { MobileServiceCTA } from "@/components/services/MobileServiceCTA";
import { ProjectVisual } from "@/components/portfolio/ProjectVisual";
import { whatsappLink } from "@/config/site";

/**
 * Une route dynamique plutôt que sept dossiers.
 *
 * Sept répertoires vides existaient, un par service, sans page : les rangées
 * de la page d'accueil pointaient donc vers autant de 404. Les sept pages
 * partagent la même structure et la même source de données ; les décliner en
 * fichiers séparés reviendrait à recopier sept fois la même mise en page pour
 * ne changer qu'une clé de traduction.
 *
 * Le slug reste identique dans les trois langues — seul le segment parent est
 * traduit (/fr/services/branding, /ar/khadamat/branding). Un slug traduit
 * imposerait une table de correspondance supplémentaire pour un gain de
 * référencement marginal sur un segment de second niveau.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = services.find((entry) => entry.slug === slug);
  if (!service) return {};

  const c = await getTranslator(locale, "common");
  const s = await getTranslator(locale, "services");
  const description =
    locale === "en" && service.key === "strategy"
      ? s("items.strategy.metaDescription")
      : s(`items.${service.key}.summary`);
  return pageMetadata({
    locale,
    route: "services",
    slug: service.slug,
    title: c(service.nameKey),
    description,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const service = services.find((entry) => entry.slug === slug);
  if (!service) notFound();

  const t = await getTranslator(typedLocale, "pages");
  const s = await getTranslator(typedLocale, "services");
  const c = await getTranslator(typedLocale, "common");
  const home = await getTranslator(typedLocale, "home");

  const others = services.filter((entry) => entry.slug !== service.slug);
  const relatedProject = projects.find((project) =>
    project.services.includes(service.key),
  );
  const whatsappMessage = `${c("cta.whatsappMessage.language")}: ${localeNames[typedLocale]}\n${c("cta.whatsappMessage.service")}: ${c(service.nameKey)}`;
  const whatsapp = whatsappLink(whatsappMessage);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(typedLocale, {
            name: c(service.nameKey),
            description: s(`items.${service.key}.summary`),
            slug: service.slug,
          }),
          breadcrumbSchema(typedLocale, [
            { name: c("brand.name") },
            { name: s("meta.title"), route: "services" },
            { name: c(service.nameKey), route: "services", slug: service.slug },
          ]),
        ]}
      />

      <PageHeader
        eyebrow={c(`kickers.${service.key}`)}
        titleLines={[c(service.nameKey)]}
        intro={s(`items.${service.key}.summary`)}
      >
        <MobileServiceCTA
          locale={typedLocale}
          quoteLabel={s("mobileCta.quote")}
          whatsappLabel={s("mobileCta.whatsapp")}
          whatsappMessage={`${c("cta.whatsappMessage.language")}: ${typedLocale === "fr" ? "Français" : typedLocale === "en" ? "English" : "العربية"}\n${c("cta.whatsappMessage.service")}: ${c(service.nameKey)}`}
        />

        <div className="mt-10 md:ms-[14%]">
          <Button
            href={href(typedLocale, "services")}
            variant="link"
            className="rtl:flex-row-reverse"
          >
            ← {t("serviceDetail.backLabel")}
          </Button>
        </div>
      </PageHeader>

      <section className="border-b border-canvas-gray pb-section">
        <Container>
          {/*
            L'image du service ouvre la page avant le périmètre : elle montre
            le geste, la liste dit ce qu'on livre. Chaque service a la sienne,
            décrite dans le manifeste — aucune n'est réutilisée d'un service à
            l'autre, sans quoi les sept pages se ressembleraient.
          */}
          <SectionImage
            slot={serviceImagery[service.slug]}
            alt={c(`imagery.service-${service.slug}`)}
            pendingLabel={c("imagery.pending")}
            className="mb-14"
          />

          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <p className="text-caption text-anthracite/70">
                {service.index}
              </p>
              <h2 className="mt-4 text-h3 text-ink">
                {t("serviceDetail.scopeLabel")}
              </h2>
            </Block>

            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <ul className="grid gap-x-grid gap-y-4 sm:grid-cols-2">
                {s.list(`items.${service.key}.scope`).map((entry) => (
                  <li
                    key={entry}
                    className="flex items-start gap-3 text-body text-anthracite/75"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 block h-1.5 w-1.5 shrink-0 rounded-pill bg-atlas"
                    />
                    {entry}
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-small text-anthracite/70">
                {s("detailNote")}
              </p>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <p className="eyebrow text-atlas">{t("serviceDetail.buyingEyebrow")}</p>
              <h2 className="mt-4 text-h3 text-ink">
                {t("serviceDetail.buyingTitle")}
              </h2>
            </Block>
            <Block className="grid gap-8 md:col-span-7 md:col-start-6 sm:grid-cols-2">
              <div>
                <h3 className="text-caption text-anthracite/70">
                  {t("serviceDetail.forWhoLabel")}
                </h3>
                <p className="mt-3 text-body text-anthracite/80">
                  {s(`items.${service.key}.summary`)}
                </p>
              </div>
              <div>
                <h3 className="text-caption text-anthracite/70">
                  {t("serviceDetail.processLabel")}
                </h3>
                <p className="mt-3 text-body text-anthracite/80">
                  {t("serviceDetail.timelineBody")}
                </p>
              </div>
              <div>
                <h3 className="text-caption text-anthracite/70">
                  {t("serviceDetail.deliverablesLabel")}
                </h3>
                <ul className="mt-3 grid gap-2 text-body text-anthracite/80">
                  {s.list(`items.${service.key}.scope`).map((entry) => (
                    <li key={entry} className="flex gap-3">
                      <span aria-hidden className="text-atlas">✓</span>
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-caption text-anthracite/70">
                  {t("serviceDetail.timelineLabel")}
                </h3>
                <p className="mt-3 text-body text-anthracite/80">
                  {s("detailNote")}
                </p>
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                <Button href={href(typedLocale, "demander-un-devis")} variant="invert" arrow>
                  {c("cta.quote")}
                </Button>
                {whatsapp && (
                  <Button href={whatsapp} external variant="secondary">
                    {c("cta.whatsapp")}
                  </Button>
                )}
              </div>
            </Block>
          </div>
        </Container>
      </section>

      {relatedProject && (
        <section className="border-b border-canvas-gray py-section">
          <Container>
            <Block>
              <p className="eyebrow text-atlas">{t("serviceDetail.proofEyebrow")}</p>
              <h2 className="mt-4 text-h3 text-ink">
                {t("serviceDetail.proofTitle")}
              </h2>
            </Block>
            <Block className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-5">
                <ProjectVisual
                  client={relatedProject.client}
                  pendingLabel={home("work.visualPending")}
                  ratio="16/10"
                  logoSrc={relatedProject.logo?.src}
                  logoAlt={relatedProject.logo?.alt}
                />
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="text-caption text-atlas">{relatedProject.client}</p>
                <p className="mt-4 max-w-prose text-body-lg text-anthracite/75">
                  {home(relatedProject.summary)}
                </p>
                <p className="mt-8">
                  <Button
                    href={`${href(typedLocale, "realisations")}/${relatedProject.slug}`}
                    variant="link"
                    arrow
                  >
                    {t("serviceDetail.proofLink")}
                  </Button>
                </p>
              </div>
            </Block>
          </Container>
        </section>
      )}

      <section className="py-section">
        <Container>
          <Block>
            <h2 className="text-h3 text-ink">
              {t("serviceDetail.othersTitle")}
            </h2>
          </Block>

          <Block className="mt-10 grid gap-x-grid gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((entry) => (
              <Link
                key={entry.slug}
                href={`${href(typedLocale, "services")}/${entry.slug}`}
                className="group flex items-baseline justify-between gap-4 border-b border-anthracite/[0.12] pb-4"
              >
                <span className="text-body-lg text-ink transition-colors duration-base ease-brand group-hover:text-atlas">
                  {c(entry.nameKey)}
                </span>
                <span aria-hidden className="arrow-nudge text-atlas">
                  →
                </span>
              </Link>
            ))}
          </Block>
        </Container>
      </section>

      <CTASection
        locale={typedLocale}
        originLabel={c(service.nameKey)}
        originKind="service"
      />
    </>
  );
}
