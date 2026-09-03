import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Block, BlockItem } from "@/components/ui/Block";
import { PageHeader } from "@/components/layout/PageHeader";
import { HeaderField } from "@/components/decor/HeaderField";
import { Button } from "@/components/buttons/Button";
import { CTASection } from "@/components/layout/CTASection";
import { href } from "@/lib/i18n/routing";
import { SectionImage } from "@/components/media/SectionImage";
import { servicesHero } from "@/data/imagery";
import { MobileServiceCTA } from "@/components/services/MobileServiceCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslator(locale, "services");
  return pageMetadata({
    locale,
    route: "services",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

/**
 * Page Services.
 *
 * Chaque expertise reçoit un bloc entier plutôt qu'une carte : un numéro, un
 * nom large, une explication rédigée et le périmètre réel du travail. Le
 * lecteur descend une liste éditoriale, il ne compare pas une grille.
 *
 * Les blocs portent une ancre (#slug) et renvoient vers leur page de détail,
 * désormais publiée : /services/<slug> dans les trois langues.
 */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "services");
  const c = await getTranslator(typedLocale, "common");
  const p = await getTranslator(typedLocale, "pages");

  return (
    <>
      <PageHeader
        eyebrow={t("hero.eyebrow")}
        titleLines={t.list("hero.titleLines")}
        intro={t("hero.description")}
        backdrop={<HeaderField variant="services" />}
      >
        <MobileServiceCTA
          locale={typedLocale}
          quoteLabel={t("mobileCta.quote")}
          whatsappLabel={t("mobileCta.whatsapp")}
          whatsappMessage={`${c("cta.whatsappMessage.language")}: ${locale === "fr" ? "Français" : locale === "en" ? "English" : "العربية"}\n${c("cta.whatsappMessage.page")}: ${t("meta.title")}`}
        />
      </PageHeader>

      <section className="pb-section">
        <Container>
          {/*
            Une seule image pour sept expertises. Illustrer chaque rangée
            transformerait la liste en catalogue : le lecteur comparerait des
            vignettes au lieu de lire des périmètres. L'image ouvre la liste,
            les pages de détail portent le reste.
          */}
          <SectionImage
            slot={servicesHero}
            alt={c("imagery.services-hero")}
            pendingLabel={c("imagery.pending")}
            className="mb-14"
          />

          <ul className="border-t border-anthracite/[0.12]">
            {services.map((service) => (
              <li
                key={service.slug}
                id={service.slug}
                className="scroll-mt-32 border-b border-anthracite/[0.12]"
              >
                <Block
                  className="grid gap-8 py-14 md:grid-cols-12 md:gap-grid md:py-20"
                >
                  <BlockItem className="md:col-span-4">
                    <p className="text-caption text-anthracite/70">
                      {service.index}
                    </p>
                    <h2 className="mt-4 flex items-center gap-3 text-h3 text-ink">
                      {c(service.nameKey)}
                      <span
                        aria-hidden
                        className="block h-2.5 w-2.5 shrink-0 animate-dot-pulse rounded-pill bg-light"
                      />
                    </h2>
                    <p className="mt-2 text-caption text-atlas">
                      {c(`kickers.${service.key}`)}
                    </p>
                  </BlockItem>

                  <BlockItem className="md:col-span-7 md:col-start-6">
                    <p className="max-w-prose text-body-lg text-anthracite/75">
                      {t(`items.${service.key}.summary`)}
                    </p>

                    <p className="mt-8">
                      <Button
                        href={`${href(typedLocale, "services")}/${service.slug}`}
                        variant="link"
                        arrow
                      >
                        {p("serviceDetail.viewLabel")}
                      </Button>
                    </p>

                    <p className="mt-10 text-caption text-anthracite/70">
                      {t("scopeLabel")}
                    </p>
                    <ul className="mt-4 grid gap-x-grid gap-y-3 sm:grid-cols-2">
                      {t.list(`items.${service.key}.scope`).map((entry) => (
                        <li
                          key={entry}
                          className="flex items-start gap-3 text-small text-anthracite/70"
                        >
                          <span
                            aria-hidden
                            className="mt-2 block h-1 w-1 shrink-0 rounded-pill bg-atlas"
                          />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </BlockItem>
                </Block>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-small text-anthracite/70">
            {t("detailNote")}
          </p>
        </Container>
      </section>

      <CTASection locale={typedLocale} originLabel={t("meta.title")} />
    </>
  );
}
