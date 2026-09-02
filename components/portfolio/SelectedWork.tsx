import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { featuredProjects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/buttons/Button";
import { Block } from "@/components/ui/Block";
import { Reveal } from "@/components/motion/Reveal";
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
    <section className="border-b border-white/10 bg-surface py-section text-white">
      <Container>
        <SectionHeader
          eyebrow={t("work.eyebrow")}
          titleLines={t.list("work.titleLines")}
          intro={t("work.intro")}
          align="split"
          tone="light"
          className="mb-14"
        />

        <div className="grid gap-y-16 md:grid-cols-12 md:gap-x-grid">
          {featuredProjects.map((project, index) => {
            const layout = layouts[index % layouts.length]!;
            const metric = project.headlineMetric;

            return (
              <Reveal
                key={project.slug}
                className={cn(layout.span, layout.start)}
              >
                <article>
                <Link
                  href={`${href(locale, "realisations")}/${project.slug}`}
                  className="group block"
                >
                  <ProjectVisual
                    client={project.client}
                    pendingLabel={t("work.visualPending")}
                    ratio={layout.ratio}
                  />

                  <Block>
                    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="text-h3 text-white">{project.client}</h3>
                      <p className="text-caption text-white/70">
                        {t(project.industry)}
                      </p>
                    </div>

                    <p className="mt-3 max-w-prose text-small text-white/70">
                      {t(project.summary)}
                    </p>

                    {metric && (
                      <p className="mt-6 flex items-baseline gap-3">
                        <bdi className="text-h2 text-light">
                          {metric.value}
                        </bdi>
                        <span className="text-small text-white/70">
                          {t(metric.label)}
                        </span>
                      </p>
                    )}

                    <span className="mt-6 inline-flex items-center gap-2 text-button text-light">
                      {t("work.viewCase")}
                      <span aria-hidden className="arrow-nudge">
                        →
                      </span>
                    </span>
                  </Block>
                </Link>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16">
          <Button href={href(locale, "realisations")} variant="invert" arrow>
            {t("work.all")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
