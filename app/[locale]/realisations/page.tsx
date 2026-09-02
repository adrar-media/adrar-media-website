import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { href } from "@/lib/i18n/routing";
import { projects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { PageHeader } from "@/components/layout/PageHeader";
import { HeaderField } from "@/components/decor/HeaderField";
import { ProjectVisual } from "@/components/portfolio/ProjectVisual";
import { CTASection } from "@/components/layout/CTASection";
import { cn } from "@/lib/utils";

/**
 * Compositions irrégulières, comme sur la page d'accueil : chaque projet
 * reçoit une largeur et un ratio propres. Une grille homogène invite à
 * comparer, ce qu'on ne veut pas pour des réalisations.
 */
const layouts = [
  { span: "md:col-span-7", start: "", ratio: "16/10" },
  { span: "md:col-span-4", start: "md:col-start-9", ratio: "3/4" },
  { span: "md:col-span-5", start: "md:col-start-2", ratio: "4/5" },
  { span: "md:col-span-6", start: "md:col-start-8", ratio: "1/1" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslator(locale, "pages");
  return pageMetadata({
    locale,
    route: "realisations",
    title: t("work.meta.title"),
    description: t("work.meta.description"),
  });
}

/**
 * Portfolio.
 *
 * Remplace le gabarit de validation de route qui n'affichait que le titre de
 * la page. Tous les projets sont listés, y compris ceux qui ne sont pas mis
 * en avant sur la page d'accueil.
 */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const home = await getTranslator(typedLocale, "home");

  return (
    <>
      <PageHeader
        eyebrow={t("work.eyebrow")}
        titleLines={t.list("work.titleLines")}
        intro={t("work.intro")}
        backdrop={<HeaderField variant="work" />}
      />

      <section className="pb-section">
        <Container>
          <div className="grid gap-y-20 md:grid-cols-12 md:gap-x-grid">
            {projects.map((project, index) => {
              const layout = layouts[index % layouts.length]!;
              const metric = project.headlineMetric;

              return (
                <Block
                  key={project.slug}
                  className={cn(layout.span, layout.start)}
                >
                  <article>
                    <Link
                      href={`${href(typedLocale, "realisations")}/${project.slug}`}
                      className="group block"
                    >
                      <ProjectVisual
                        client={project.client}
                        pendingLabel={home("work.visualPending")}
                        ratio={layout.ratio}
                      />

                      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <h2 className="text-h3 text-ink">{project.client}</h2>
                        <p className="text-caption text-anthracite/70">
                          {home(project.industry)}
                        </p>
                      </div>

                      <p className="mt-3 max-w-prose text-small text-anthracite/70">
                        {home(project.summary)}
                      </p>

                      {metric && (
                        <p className="mt-6 flex items-baseline gap-3">
                          <bdi className="text-h2 text-atlas">
                            {metric.value}
                          </bdi>
                          <span className="text-small text-anthracite/70">
                            {home(metric.label)}
                          </span>
                        </p>
                      )}

                      <span className="mt-6 inline-flex items-center gap-2 text-button text-atlas">
                        {home("work.viewCase")}
                        <span aria-hidden className="arrow-nudge">
                          →
                        </span>
                      </span>
                    </Link>
                  </article>
                </Block>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection locale={typedLocale} />
    </>
  );
}
