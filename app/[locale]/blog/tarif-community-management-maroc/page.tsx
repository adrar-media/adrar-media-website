import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/layout/CTASection";

/**
 * Article « Tarif Community Management au Maroc en 2026 ».
 *
 * Même statut que `fes`, `meknes`, `kenitra` et `azrou-ifrane` : hors du
 * registre multilingue, route autonome sous `app/[locale]/blog/`, contenu
 * exclusivement français. `data/articles.ts` exige `content: Record<Locale,
 * LocalizedArticle>` — un article n'y existe qu'avec ses trois langues déjà
 * écrites. Publier ce contenu par ce système aurait exigé d'inventer des
 * versions anglaise et arabe qui n'ont pas été rédigées, ou de le laisser
 * hors ligne. Cette route dédiée coexiste avec `app/[locale]/blog/[slug]/`
 * sans conflit : Next.js sert toujours le segment statique le plus précis
 * avant la route dynamique.
 *
 * PUBLISHED_AT est la date réelle de mise en ligne de cette page, pas une
 * donnée éditoriale reprise du pack.
 */

const PUBLISHED_AT = "2026-09-04";
const READING_MINUTES = 5;

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
  const url = absoluteUrl("/fr/blog/tarif-community-management-maroc");

  return {
    title: t("tarifCommunityManagement.meta.title"),
    description: t("tarifCommunityManagement.meta.description"),
    alternates: url ? { canonical: url } : undefined,
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

interface TableRow {
  formule: string;
  prix: string;
  contenu: string;
}

interface Source {
  name: string;
  url: string;
  note: string;
}

export default async function TarifCommunityManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const faq = t.entries<FaqItem>("tarifCommunityManagement.faq");
  const freelanceTable = t.entries<TableRow>(
    "tarifCommunityManagement.freelanceTable",
  );
  const section4Items = t.list("tarifCommunityManagement.section4Items");
  const section5Items = t.list("tarifCommunityManagement.section5Items");
  const sources = t.entries<Source>("tarifCommunityManagement.sources");

  const pageUrl = absoluteUrl("/fr/blog/tarif-community-management-maroc");
  const home = absoluteUrl("/fr");
  const title = t("tarifCommunityManagement.title");

  const article = pageUrl
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: t("tarifCommunityManagement.meta.description"),
        datePublished: PUBLISHED_AT,
        dateModified: PUBLISHED_AT,
        inLanguage: "fr",
        mainEntityOfPage: pageUrl,
        author: {
          "@type": "Organization",
          name: c("brand.name"),
          ...(home ? { "@id": `${home}#organization` } : {}),
        },
        publisher: home ? { "@id": `${home}#organization` } : undefined,
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
      <JsonLd
        data={[
          breadcrumbSchema(typedLocale, [
            { name: c("brand.name") },
            { name: t("blog.meta.title"), route: "blog" },
            {
              name: title,
              route: "blog",
              slug: "tarif-community-management-maroc",
            },
          ]),
          article,
          faqSchema,
        ]}
      />

      <PageHeader
        eyebrow={t("tarifCommunityManagement.category")}
        titleLines={[title]}
        intro={t("tarifCommunityManagement.intro")}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-anthracite/70 md:ms-[14%]">
          <time dateTime={PUBLISHED_AT}>
            {new Intl.DateTimeFormat("fr-MA", { dateStyle: "long" }).format(
              new Date(`${PUBLISHED_AT}T12:00:00Z`),
            )}
          </time>
          <span aria-hidden>•</span>
          <span>
            {READING_MINUTES} {t("blog.readingMinutes")}
          </span>
        </div>
      </PageHeader>

      <article className="pb-section">
        <Container>
          <div className="mx-auto max-w-reading">
            <Block>
              <h2 className="text-h3 text-ink">
                {t("tarifCommunityManagement.section1Title")}
              </h2>
              <p className="mt-6 text-body text-anthracite/85">
                {t("tarifCommunityManagement.section1Body")}
              </p>
            </Block>

            <Block className="mt-14">
              <h2 className="text-h3 text-ink">
                {t("tarifCommunityManagement.section2Title")}
              </h2>
              <p className="mt-6 text-body text-anthracite/85">
                {t("tarifCommunityManagement.section2Body")}
              </p>

              <div className="mt-8 overflow-x-auto rounded-lg border border-canvas-gray">
                <table className="w-full min-w-[480px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-canvas-gray bg-beige-soft">
                      <th className="px-5 py-3 text-caption uppercase tracking-wide text-anthracite/60">
                        Formule
                      </th>
                      <th className="px-5 py-3 text-caption uppercase tracking-wide text-anthracite/60">
                        Prix
                      </th>
                      <th className="px-5 py-3 text-caption uppercase tracking-wide text-anthracite/60">
                        Contenu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {freelanceTable.map((row) => (
                      <tr key={row.formule} className="border-b border-canvas-gray last:border-b-0">
                        <td className="px-5 py-4 text-body text-ink">{row.formule}</td>
                        <td className="px-5 py-4 text-body font-medium text-ink">
                          {row.prix}
                        </td>
                        <td className="px-5 py-4 text-small text-anthracite/75">
                          {row.contenu}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-caption text-anthracite/60">
                {t("tarifCommunityManagement.freelanceTableNote")}
              </p>
            </Block>

            <Block className="mt-14">
              <h2 className="text-h3 text-ink">
                {t("tarifCommunityManagement.section3Title")}
              </h2>
              <p className="mt-6 text-body text-anthracite/85">
                {t("tarifCommunityManagement.section3Body")}
              </p>
            </Block>

            <Block className="mt-14">
              <h2 className="text-h3 text-ink">
                {t("tarifCommunityManagement.section4Title")}
              </h2>
              <ul className="mt-6 space-y-3">
                {section4Items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-body text-anthracite/85"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 block h-1 w-1 shrink-0 rounded-pill bg-atlas"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Block>

            <Block className="mt-14">
              <h2 className="text-h3 text-ink">
                {t("tarifCommunityManagement.section5Title")}
              </h2>
              <ul className="mt-6 space-y-3">
                {section5Items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-body text-anthracite/85"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 block h-1 w-1 shrink-0 rounded-pill bg-atlas"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Block>

            <Block className="mt-14">
              <h2 className="text-h3 text-ink">
                {t("tarifCommunityManagement.section6Title")}
              </h2>
              <p className="mt-6 text-body text-anthracite/85">
                {t("tarifCommunityManagement.section6Body")}
              </p>
              <div className="mt-6">
                <Button
                  href={href(typedLocale, "realisations", "bricodi-pro")}
                  variant="secondary"
                  size="md"
                >
                  {t("tarifCommunityManagement.section6KenitraLinkLabel")}
                </Button>
              </div>
            </Block>

            {faq.length > 0 && (
              <Block className="mt-16">
                <h2 className="text-h3 text-ink">
                  {t("tarifCommunityManagement.faqTitle")}
                </h2>
                <div className="mt-6 grid gap-3">
                  {faq.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-md border border-anthracite/15 bg-canvas-raised px-6 py-5"
                    >
                      <h3 className="text-body-lg font-medium text-ink">
                        {item.question}
                      </h3>
                      <p className="mt-2 text-small text-anthracite/75">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {sources.length > 0 && (
              <Block className="mt-16">
                <h2 className="text-h4 text-ink">
                  {t("tarifCommunityManagement.sourcesTitle")}
                </h2>
                <ul className="mt-4 divide-y divide-canvas-gray rounded-lg border border-canvas-gray">
                  {sources.map((source) => (
                    <li key={source.name} className="px-5 py-3 text-small">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="font-medium text-atlas hover:text-atlas-dark"
                      >
                        {source.name}
                      </a>
                      <span className="text-anthracite/60"> — {source.note}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            <Block className="mt-16 rounded-lg bg-surface p-8 text-white md:p-10">
              <h2 className="text-h3 text-white">
                {t("tarifCommunityManagement.ctaTitle")}
              </h2>
              <p className="mt-4 max-w-prose text-body text-white/80">
                {t("tarifCommunityManagement.ctaBody")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={href(typedLocale, "services", "social-media")}
                  variant="invert"
                  arrow
                >
                  {t("tarifCommunityManagement.ctaServiceLabel")}
                </Button>
                <Button
                  href={href(typedLocale, "demander-un-devis")}
                  variant="outline"
                >
                  {c("cta.quote")}
                </Button>
              </div>
            </Block>

            <div className="mt-12">
              <Button href={href(typedLocale, "blog")} variant="secondary">
                ← {t("blog.backToBlog")}
              </Button>
            </div>
          </div>
        </Container>
      </article>

      <CTASection locale={typedLocale} />
    </>
  );
}
