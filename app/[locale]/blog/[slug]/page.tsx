import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localeTags, type Locale } from "@/config/i18n";
import { articles, findArticle } from "@/data/articles";
import { href } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { CTASection } from "@/components/layout/CTASection";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    articles.map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = findArticle(slug);
  if (!article) return {};
  const content = article.content[locale];
  return pageMetadata({
    locale,
    route: "blog",
    slug,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const article = findArticle(slug);
  if (!article) notFound();

  const content = article.content[typedLocale];
  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const date = new Intl.DateTimeFormat(localeTags[typedLocale], {
    dateStyle: "long",
  }).format(new Date(`${article.publishedAt}T12:00:00Z`));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(typedLocale, [
            { name: c("brand.name") },
            { name: t("blog.meta.title"), route: "blog" },
            { name: content.title, route: "blog", slug: article.slug },
          ]),
          articleSchema(typedLocale, article, content),
        ]}
      />

      <PageHeader
        eyebrow={content.category}
        titleLines={[content.title]}
        intro={content.intro}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-anthracite/70 md:ms-[14%]">
          <time dateTime={article.publishedAt}>{date}</time>
          <span aria-hidden>•</span>
          <span>{article.readingMinutes} {t("blog.readingMinutes")}</span>
        </div>
      </PageHeader>

      <article className="pb-section">
        <Container>
          <div className="mx-auto max-w-reading">
            {content.sections.map((section, index) => (
              <Block key={section.heading} className={index === 0 ? "" : "mt-14"}>
                <section>
                  <h2 className="text-h3 text-ink">{section.heading}</h2>
                  <div className="mt-6 space-y-5">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-body text-anthracite/85">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              </Block>
            ))}

            <Block className="mt-16 rounded-lg bg-surface p-8 text-white md:p-10">
              <h2 className="text-h3 text-white">{t("blog.takeawaysTitle")}</h2>
              <ul className="mt-6 grid gap-4">
                {content.takeaways.map((takeaway) => (
                  <li key={takeaway} className="flex gap-3 text-body text-white/85">
                    <span aria-hidden className="text-light">✓</span>
                    {takeaway}
                  </li>
                ))}
              </ul>
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
