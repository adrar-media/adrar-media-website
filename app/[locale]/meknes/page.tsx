import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Block, BlockItem } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/layout/CTASection";

/**
 * Page locale Meknès.
 *
 * Même statut que `app/[locale]/fes/page.tsx` : hors du registre multilingue
 * (`config/i18n.ts`), route autonome sous `app/[locale]/meknes/`, contenu
 * exclusivement français. Voir la note de ce fichier pour le raisonnement
 * complet — il s'applique à l'identique ici.
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
  const url = absoluteUrl("/fr/meknes");

  return {
    title: t("meknes.meta.title"),
    description: t("meknes.meta.description"),
    alternates: url ? { canonical: url } : undefined,
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

export default async function MeknesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const sectors = t.entries<Sector>("meknes.sectors");
  const faq = t.entries<FaqItem>("meknes.faq");

  const pageUrl = absoluteUrl("/fr/meknes");
  const home = absoluteUrl("/fr");

  const breadcrumb = pageUrl
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c("brand.name"), item: home },
          { "@type": "ListItem", position: 2, name: "Meknès", item: pageUrl },
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
        eyebrow={t("meknes.eyebrow")}
        titleLines={t.list("meknes.titleLines")}
        intro={t("meknes.intro")}
      />

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("meknes.proximityTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("meknes.proximityBody")}
              </p>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <Block>
            <h2 className="text-h2 text-ink">{t("meknes.offerTitle")}</h2>
            <p className="mt-4 max-w-prose text-body-lg text-anthracite/75">
              {t("meknes.offerIntro")}
            </p>
          </Block>

          <Block className="mt-14 grid gap-x-grid gap-y-12 sm:grid-cols-2">
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

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <Block className="rounded-lg border border-atlas/30 bg-atlas/10 px-6 py-8 md:px-10 md:py-10">
            <h2 className="text-h3 text-ink">{t("meknes.disclosureTitle")}</h2>
            <p className="mt-3 max-w-prose text-body text-anthracite/85">
              {t("meknes.disclosureBody")}
            </p>
          </Block>
        </Container>
      </section>

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("meknes.howTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("meknes.howBody")}
              </p>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("meknes.proofTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("meknes.proofBody")}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {[
                  { label: "Bricodi Pro", route: "bricodi-pro" },
                  { label: "The Big Family", route: "the-big-family" },
                  { label: "Zenori Café", route: "zenori-cafe" },
                  { label: "Wlidatna", route: "wlidatna" },
                ].map((project) => (
                  <li key={project.route}>
                    <Button
                      href={href(typedLocale, "realisations", project.route)}
                      variant="secondary"
                      size="md"
                    >
                      {project.label}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button href="/fr/fes" variant="secondary" size="md">
                    Notre page Fès
                  </Button>
                </li>
              </ul>
            </Block>
          </div>
        </Container>
      </section>

      {faq.length > 0 && (
        <section className="border-b border-canvas-gray bg-beige-soft py-section">
          <Container>
            <Block>
              <h2 className="text-h2 text-ink">{t("meknes.faqTitle")}</h2>
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

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <Block className="rounded-lg bg-surface p-8 text-center text-white md:p-14">
            <h2 className="text-h2 text-white">{t("meknes.ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-prose text-body-lg text-white/75">
              {t("meknes.ctaBody")}
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

      <CTASection locale={typedLocale} originLabel="Meknès" />
    </>
  );
}
