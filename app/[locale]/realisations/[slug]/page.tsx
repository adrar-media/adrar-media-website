import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectVisual } from "@/components/portfolio/ProjectVisual";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectVideoGrid } from "@/components/portfolio/ProjectVideoGrid";
import { CTASection } from "@/components/layout/CTASection";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return {};

  const home = await getTranslator(locale, "home");
  return pageMetadata({
    locale,
    route: "realisations",
    slug: project.slug,
    title: project.client,
    description: home(project.summary),
  });
}

/**
 * Page d'un projet.
 *
 * Étude de cas factuelle : contexte, méthode, livrables et niveau de preuve.
 * Aucun résultat n'est déduit d'un périmètre de travail et aucune donnée
 * sensible n'est nécessaire pour expliquer la collaboration.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const index = projects.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();
  const project = projects[index]!;
  const next = projects[(index + 1) % projects.length]!;

  const t = await getTranslator(typedLocale, "pages");
  const home = await getTranslator(typedLocale, "home");
  const c = await getTranslator(typedLocale, "common");

  const metric = project.headlineMetric;
  const involved = services.filter((service) =>
    project.services.includes(service.key),
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(typedLocale, [
            { name: c("brand.name") },
            { name: t("work.meta.title"), route: "realisations" },
            { name: project.client, route: "realisations", slug: project.slug },
          ]),
        ]}
      />

      <PageHeader
        eyebrow={home(project.industry)}
        titleLines={[project.client]}
        intro={home(project.summary)}
      >
        <div className="mt-10 md:ms-[14%]">
          <Button href={href(typedLocale, "realisations")} variant="link">
            ← {t("work.backLabel")}
          </Button>
        </div>
      </PageHeader>

      <section className="pb-section">
        <Container>
          <Block>
            <ProjectVisual
              client={project.client}
              pendingLabel={home("work.visualPending")}
              ratio="16/9"
              logoSrc={project.logo?.src}
              logoAlt={project.logo?.alt}
            />
          </Block>

          <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-caption text-anthracite/70">
                {t("work.servicesLabel")}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {involved.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`${href(typedLocale, "services")}/${service.slug}`}
                      className="inline-flex rounded-pill border border-anthracite/15 bg-canvas-raised px-4 py-2 text-small text-anthracite transition-colors duration-fast ease-standard hover:border-atlas hover:text-atlas"
                    >
                      {c(service.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 text-caption text-anthracite/70">
                {t("work.industryLabel")}
              </h2>
              <p className="mt-3 text-body text-anthracite/75">
                {home(project.industry)}
              </p>
            </Block>

            <Block delay={100} className="md:col-span-7 md:col-start-6">
              {metric && (
                <div className="rounded-lg bg-surface p-8 text-white md:p-10">
                  <p className="text-caption text-white/70">
                    {t("work.metricLabel")}
                  </p>
                  <p className="mt-4 flex flex-wrap items-baseline gap-4">
                    <bdi className="text-display leading-none text-light">
                      {metric.value}
                    </bdi>
                    <span className="text-body-lg text-white/70">
                      {home(metric.label)}
                    </span>
                  </p>
                  <p className="mt-6 text-caption text-white/70">
                    {t("work.sourceLabel")} — {metric.source}
                  </p>
                </div>
              )}

              <div className={metric ? "mt-10" : ""}>
                <h2 className="text-caption text-anthracite/70">
                  {t("work.caseContextLabel")}
                </h2>
                <p className="mt-3 max-w-prose text-body text-anthracite/80">
                  {home(project.caseStudy.context)}
                </p>

                <h2 className="mt-10 text-caption text-anthracite/70">
                  {t("work.caseApproachLabel")}
                </h2>
                <p className="mt-3 max-w-prose text-body text-anthracite/80">
                  {home(project.caseStudy.approach)}
                </p>

                <h2 className="mt-10 text-caption text-anthracite/70">
                  {t("work.caseDeliverablesLabel")}
                </h2>
                <ul className="mt-4 grid gap-3">
                  {project.caseStudy.deliverables.map((key) => (
                    <li
                      key={key}
                      className="flex gap-3 rounded-md border border-anthracite/15 bg-canvas-raised px-5 py-4 text-small text-anthracite/80"
                    >
                      <span aria-hidden className="text-atlas">✓</span>
                      {home(key)}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 rounded-md border border-atlas/30 bg-atlas/10 px-5 py-5">
                  <h2 className="text-caption text-ink">
                    {t("work.transparencyLabel")}
                  </h2>
                  <p className="mt-2 text-small text-anthracite/80">
                    {home(project.caseStudy.disclosure)}
                  </p>
                </div>
              </div>
            </Block>
          </div>

          {project.gallery && (
            <Block className="mt-4">
              <ProjectGallery
                items={project.gallery}
                label={t("work.galleryLabel")}
              />
            </Block>
          )}

          {project.videos && (
            <Block className="mt-4">
              <ProjectVideoGrid
                items={project.videos}
                label={t("work.videosLabel")}
              />
            </Block>
          )}

          <Block className="mt-20 border-t border-anthracite/[0.12] pt-10">
            <Link
              href={`${href(typedLocale, "realisations")}/${next.slug}`}
              className="group flex flex-wrap items-baseline justify-between gap-4"
            >
              <span className="text-caption text-anthracite/70">
                {t("work.nextLabel")}
              </span>
              <span className="flex items-center gap-3 text-h3 text-ink transition-colors duration-base ease-brand group-hover:text-atlas">
                {next.client}
                <span aria-hidden className="arrow-nudge text-atlas">
                  →
                </span>
              </span>
            </Link>
          </Block>
        </Container>
      </section>

      <CTASection locale={typedLocale} />
    </>
  );
}
