import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { projects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { Block, BlockItem } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/layout/CTASection";

/**
 * Page locale Kénitra.
 *
 * Même statut que `app/[locale]/fes/page.tsx` et `app/[locale]/meknes/page.tsx` :
 * hors du registre multilingue, route autonome, contenu exclusivement
 * français. Voir la note de ces fichiers pour le raisonnement complet.
 *
 * Contrairement à Fès et Meknès, cette page dispose d'une preuve locale
 * réelle (Bricodi Pro). La métrique affichée n'est jamais ressaisie en texte
 * libre : elle est lue depuis `project.headlineMetric` (data/projects.ts),
 * comme sur la page d'étude de cas elle-même, pour ne jamais désynchroniser
 * les deux affichages du même chiffre.
 */

export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "fr") return {};

  const t = await getTranslator("fr", "pages");
  const url = absoluteUrl("/fr/kenitra");
  const image = absoluteUrl("/images/sections/contact-azrou.webp");
  const title = t("kenitra.meta.title");
  const description = t("kenitra.meta.description");

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "fr_FR",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

interface Sector {
  title: string;
  body: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default async function KenitraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const home = await getTranslator(typedLocale, "home");
  const sectors = t.entries<Sector>("kenitra.sectors");
  const faq = t.entries<FaqItem>("kenitra.faq");

  const bricodiPro = projects.find((project) => project.slug === "bricodi-pro");
  const metric = bricodiPro?.headlineMetric;

  const pageUrl = absoluteUrl("/fr/kenitra");
  const home_ = absoluteUrl("/fr");

  const breadcrumb = pageUrl
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c("brand.name"), item: home_ },
          { "@type": "ListItem", position: 2, name: "Kénitra", item: pageUrl },
        ],
      }
    : null;

  const faqSchema =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={[breadcrumb, faqSchema]} />

      <PageHeader
        eyebrow={t("kenitra.eyebrow")}
        titleLines={t.list("kenitra.titleLines")}
        intro={t("kenitra.intro")}
      />

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("kenitra.proximityTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("kenitra.proximityBody")}
              </p>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("kenitra.proofBoxTitle")}</h2>
              <p className="mt-4 max-w-prose text-body text-anthracite/75">
                {t("kenitra.proofBoxBody")}
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
              <p className="mt-4 text-small text-anthracite/60">
                {t("kenitra.proofBoxSourceNote")}
              </p>
              <div className="mt-6">
                <Button
                  href={href(typedLocale, "realisations", "bricodi-pro")}
                  variant="secondary"
                  size="md"
                >
                  {t("kenitra.proofBoxLinkLabel")}
                </Button>
              </div>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <Block>
            <h2 className="text-h2 text-ink">{t("kenitra.offerTitle")}</h2>
            <p className="mt-4 max-w-prose text-body-lg text-anthracite/75">
              {t("kenitra.offerIntro")}
            </p>
          </Block>

          <Block className="mt-14 grid gap-x-grid gap-y-12 md:grid-cols-3">
            {sectors.map((sector, index) => (
              <BlockItem key={sector.title} delay={index * 90}>
                <h3 className="text-h3 text-ink">{sector.title}</h3>
                <p className="mt-3 text-body text-anthracite/70">
                  {sector.body}
                </p>
              </BlockItem>
            ))}
          </Block>
        </Container>
      </section>

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("kenitra.howTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("kenitra.howBody")}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                <li>
                  <Button href="/fr/fes" variant="secondary" size="md">
                    Notre page Fès
                  </Button>
                </li>
                <li>
                  <Button href="/fr/meknes" variant="secondary" size="md">
                    Notre page Meknès
                  </Button>
                </li>
              </ul>
            </Block>
          </div>
        </Container>
      </section>

      {faq.length > 0 && (
        <section className="border-b border-canvas-gray py-section">
          <Container>
            <Block>
              <h2 className="text-h2 text-ink">{t("kenitra.faqTitle")}</h2>
            </Block>
            <Block delay={100} className="mt-12 grid gap-3">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-md border border-anthracite/15 bg-canvas-raised px-6 py-5"
                >
                  <h3 className="text-body-lg font-medium text-ink">
                    {item.question}
                  </h3>
                  <p className="mt-2 max-w-prose text-small text-anthracite/75">
                    {item.answer}
                  </p>
                </div>
              ))}
            </Block>
          </Container>
        </section>
      )}

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <Block className="rounded-lg bg-surface p-8 text-center text-white md:p-14">
            <h2 className="text-h2 text-white">{t("kenitra.ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-prose text-body-lg text-white/75">
              {t("kenitra.ctaBody")}
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                href={href(typedLocale, "demander-un-devis")}
                variant="invert"
                size="lg"
                arrow
              >
                {c("cta.quote")}
              </Button>
            </div>
          </Block>
        </Container>
      </section>

      <CTASection locale={typedLocale} originLabel="Kénitra" />
    </>
  );
}
