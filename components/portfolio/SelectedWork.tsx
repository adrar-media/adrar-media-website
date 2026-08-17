import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { featuredProjects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/buttons/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/portfolio/ProjectVisual";
import { cn } from "@/lib/utils";

/**
 * Compositions du portfolio.
 *
 * Volontairement irrégulières : chaque projet reçoit une largeur, un décalage
 * et un ratio différents. Une grille homogène invite à comparer — ce que l'on
 * veut pour des services, pas pour des réalisations. Ici, chaque projet doit
 * être regardé pour lui-même.
 */
const layouts = [
  { span: "md:col-span-8", start: "", ratio: "16/10" },
  { span: "md:col-span-5", start: "md:col-start-10", ratio: "3/4" },
  { span: "md:col-span-6", start: "md:col-start-2", ratio: "4/5" },
  { span: "md:col-span-7", start: "md:col-start-9", ratio: "1/1" },
] as const;

export async function SelectedWork({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");

  return (
    <section className="border-b border-white/10 bg-deep py-section text-white">
      <Container>
        <SectionHeader
          eyebrow={t("work.eyebrow")}
          titleLines={t.list("work.titleLines")}
          intro={t("work.intro")}
          align="split"
          tone="light"
          className="mb-20"
        />

        <div className="grid gap-y-20 md:grid-cols-12 md:gap-x-grid">
          {featuredProjects.map((project, index) => {
            const layout = layouts[index % layouts.length]!;
            const metric = project.headlineMetric;

            return (
              <article
                key={project.slug}
                className={cn(layout.span, layout.start)}
              >
                <Link
                  href={`${href(locale, "realisations")}/${project.slug}`}
                  className="group block"
                >
                  <ProjectVisual
                    client={project.client}
                    pendingLabel={t("work.visualPending")}
                    ratio={layout.ratio}
                  />

                  <Reveal delay={0.1}>
                    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="text-h3 text-white">{project.client}</h3>
                      <p className="text-caption text-white/40">
                        {t(project.industry)}
                      </p>
                    </div>

                    <p className="mt-3 max-w-prose text-small text-white/60">
                      {t(project.summary)}
                    </p>

                    {metric && (
                      <p className="mt-6 flex items-baseline gap-3">
                        <span className="text-h2 text-light">
                          {metric.value}
                        </span>
                        <span className="text-small text-white/60">
                          {t(metric.label)}
                        </span>
                      </p>
                    )}

                    <span className="mt-6 inline-flex items-center gap-2 text-button text-light">
                      {t("work.viewCase")}
                      <span
                        aria-hidden
                        className="transition-transform duration-fast ease-brand group-hover:translate-x-1 rtl:-scale-x-100"
                      >
                        →
                      </span>
                    </span>
                  </Reveal>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-20">
          <Button href={href(locale, "realisations")} variant="invert" arrow>
            {t("work.all")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
