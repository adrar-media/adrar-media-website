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
 * Page locale Azrou / Ifrane.
 *
 * Même statut que `fes`, `meknes` et `kenitra` : hors du registre
 * multilingue, route autonome, contenu exclusivement français.
 *
 * Seule différence de fond : Azrou est le siège réel d'Adrar Media, pas une
 * zone couverte à distance. Le schema WebPage référence donc l'Organization
 * déjà émise ailleurs sur le site par son `@id` (même adresse, pas de
 * doublon) plutôt que de rester muet comme sur les pages Fès/Meknès/Kénitra,
 * qui n'ont pas d'établissement réel à documenter.
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
  const url = absoluteUrl("/fr/azrou-ifrane");

  return {
    title: t("azrouIfrane.meta.title"),
    description: t("azrouIfrane.meta.description"),
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

interface Work {
  client: string;
  type: string;
  verified: string;
  slug: string;
}

export default async function AzrouIfranePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const sectors = t.entries<Sector>("azrouIfrane.sectors");
  const faq = t.entries<FaqItem>("azrouIfrane.faq");
  const works = t.entries<Work>("azrouIfrane.works");

  const pageUrl = absoluteUrl("/fr/azrou-ifrane");
  const home = absoluteUrl("/fr");

  const webpage = pageUrl
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: pageUrl,
        about: home ? { "@id": `${home}#organization` } : undefined,
      }
    : null;

  const breadcrumb = pageUrl
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c("brand.name"), item: home },
          { "@type": "ListItem", position: 2, name: "Azrou / Ifrane", item: pageUrl },
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
      <JsonLd data={[webpage, breadcrumb, faqSchema]} />

      <PageHeader
        eyebrow={t("azrouIfrane.eyebrow")}
        titleLines={t.list("azrouIfrane.titleLines")}
        intro={t("azrouIfrane.intro")}
      />

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">
                {t("azrouIfrane.proximityTitle")}
              </h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("azrouIfrane.proximityBody")}
              </p>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <Block>
            <h2 className="text-h2 text-ink">{t("azrouIfrane.workTitle")}</h2>
            <p className="mt-4 max-w-prose text-body-lg text-anthracite/75">
              {t("azrouIfrane.workIntro")}
            </p>
          </Block>

          <Block className="mt-14 grid gap-x-grid gap-y-8 md:grid-cols-3">
            {works.map((work, index) => (
              <BlockItem
                key={work.client}
                delay={index * 90}
                className="flex flex-col rounded-lg border border-anthracite/[0.12] bg-canvas p-6"
              >
                <h3 className="text-h3 text-ink">{work.client}</h3>
                <p className="mt-1 text-caption text-anthracite/60">
                  {work.type}
                </p>
                <p className="mt-4 text-small text-anthracite/75">
                  {work.verified}
                </p>
                <div className="mt-6">
                  <Button
                    href={href(typedLocale, "realisations", work.slug)}
                    variant="secondary"
                    size="md"
                  >
                    {t("azrouIfrane.worksLinkLabel")}
                  </Button>
                </div>
              </BlockItem>
            ))}
          </Block>
        </Container>
      </section>

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <Block>
            <h2 className="text-h2 text-ink">{t("azrouIfrane.offerTitle")}</h2>
            <p className="mt-4 max-w-prose text-body-lg text-anthracite/75">
              {t("azrouIfrane.offerIntro")}
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

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("azrouIfrane.whyTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("azrouIfrane.whyBody")}
              </p>
              <div className="mt-6">
                <Button
                  href={href(typedLocale, "a-propos")}
                  variant="secondary"
                  size="md"
                >
                  {t("azrouIfrane.whyLinkLabel")}
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2.5">
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
                <li>
                  <Button href="/fr/kenitra" variant="secondary" size="md">
                    Notre page Kénitra
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
              <h2 className="text-h2 text-ink">{t("azrouIfrane.faqTitle")}</h2>
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
            <h2 className="text-h2 text-white">{t("azrouIfrane.ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-prose text-body-lg text-white/75">
              {t("azrouIfrane.ctaBody")}
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

      <CTASection locale={typedLocale} originLabel="Azrou" />
    </>
  );
}
