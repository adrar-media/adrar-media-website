import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionImage } from "@/components/media/SectionImage";
import { blogImage } from "@/data/imagery";
import { articles } from "@/data/articles";

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
    route: "blog",
    title: t("blog.meta.title"),
    description: t("blog.meta.description"),
  });
}

/**
 * Centre éditorial. Les articles sont localisés intégralement : aucune page
 * ne mélange une interface traduite avec un corps laissé dans une autre langue.
 */
export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");

  return (
    <>
      <PageHeader
        eyebrow={t("blog.eyebrow")}
        titleLines={t.list("blog.titleLines")}
        intro={t("blog.intro")}
      />

      <section className="pb-section">
        <Container>
          <SectionImage
            slot={blogImage}
            alt={c("imagery.blog")}
            pendingLabel={c("imagery.pending")}
            className="mb-14"
          />

          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {articles.map((article, index) => {
                const content = article.content[typedLocale];
                return (
                  <Block key={article.slug} delay={index * 80}>
                    <article className="card-sweep flex h-full flex-col rounded-lg border border-anthracite/[0.12] bg-canvas-raised p-7 md:p-8">
                      <p className="text-caption text-atlas">{content.category}</p>
                      <h2 className="mt-4 text-h4 text-ink">{content.title}</h2>
                      <p className="mt-4 flex-1 text-small text-anthracite/80">
                        {content.excerpt}
                      </p>
                      <p className="mt-6 text-caption text-anthracite/70">
                        {article.readingMinutes} {t("blog.readingMinutes")}
                      </p>
                      <Link
                        href={href(typedLocale, "blog", article.slug)}
                        className="group mt-6 inline-flex items-center gap-2 text-button text-atlas hover:text-atlas-dark"
                      >
                        {t("blog.readArticle")}
                        <span aria-hidden className="arrow-nudge">→</span>
                      </Link>
                    </article>
                  </Block>
                );
              })}
            </div>
          ) : (
            <Block className="card-sweep max-w-prose rounded-lg border border-anthracite/[0.12] bg-canvas-raised p-10 md:p-14">
              <h2 className="text-h3 text-ink">{t("blog.emptyTitle")}</h2>
              <p className="mt-4 text-body text-anthracite/70">
                {t("blog.emptyBody")}
              </p>
              <div className="mt-8">
                <Button
                  href={href(typedLocale, "realisations")}
                  variant="secondary"
                  arrow
                >
                  {t("blog.emptyCta")}
                </Button>
              </div>
            </Block>
          )}
        </Container>
      </section>
    </>
  );
}
