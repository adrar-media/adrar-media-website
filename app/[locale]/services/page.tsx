import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Block, BlockItem } from "@/components/ui/Block";
import { CTASection } from "@/components/layout/CTASection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslator(locale, "services");
  return { title: t("meta.title"), description: t("meta.description") };
}

/**
 * Page Services.
 *
 * Chaque expertise reçoit un bloc entier plutôt qu'une carte : un numéro, un
 * nom large, une explication rédigée et le périmètre réel du travail. Le
 * lecteur descend une liste éditoriale, il ne compare pas une grille.
 *
 * Les blocs portent une ancre (#slug) : les liens de la page d'accueil y
 * mènent directement. Les pages de détail par service viendront lorsque leur
 * contenu approfondi aura été validé — d'ici là, aucun lien ne pointe dans le
 * vide.
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

  return (
    <>
      <section className="pb-section pt-40 md:pt-48">
        <Container>
          <Block>
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </Block>

          <div className="mt-10 md:mt-12">
            <Headline
              as="h1"
              lines={t.list("hero.titleLines")}
              className="text-h1 text-deep"
            />
          </div>

          <Block>
            <p className="mt-10 max-w-prose text-body-lg text-anthracite/75 md:ms-[14%]">
              {t("hero.description")}
            </p>
          </Block>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <ul className="border-t border-anthracite/12">
            {services.map((service) => (
              <li
                key={service.slug}
                id={service.slug}
                className="scroll-mt-32 border-b border-anthracite/12"
              >
                <Block
                  className="grid gap-8 py-14 md:grid-cols-12 md:gap-grid md:py-20"
                >
                  <BlockItem className="md:col-span-4">
                    <p className="text-caption text-anthracite/35">
                      {service.index}
                    </p>
                    <h2 className="mt-4 flex items-center gap-3 text-h3 text-deep">
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

                    <p className="mt-10 text-caption text-anthracite/40">
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

          <p className="mt-10 text-small text-anthracite/50">
            {t("detailNote")}
          </p>
        </Container>
      </section>

      <CTASection locale={typedLocale} />
    </>
  );
}
