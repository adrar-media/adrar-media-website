import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { HeaderField } from "@/components/decor/HeaderField";
import { SectionImage } from "@/components/media/SectionImage";
import { Stagger } from "@/components/motion/Stagger";
import {
  SolutionCard,
  SolutionCardHeader,
  SolutionCardFooter,
} from "@/components/solutions/SolutionCard";
import { solutionsHero, solutionsImagery } from "@/data/imagery";

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
    route: "solutions",
    title: t("solutions.meta.title"),
    description: t("solutions.meta.description"),
  });
}

interface Pack {
  key: string;
  name: string;
  tagline: string;
  forWho: string;
  includes: string[];
}

/**
 * Page Solutions.
 *
 * Aucun prix n'est affiché. Les trois formules décrivent un périmètre, pas un
 * tarif : le chiffrage dépend du volume réel et l'annoncer à l'avance
 * reviendrait soit à surévaluer les petits projets, soit à sous-évaluer les
 * gros. Chaque formule mène donc au devis.
 */
export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const packs = t.entries<Pack>("solutions.packs");

  return (
    <>
      <PageHeader
        eyebrow={t("solutions.eyebrow")}
        titleLines={t.list("solutions.titleLines")}
        intro={t("solutions.intro")}
        backdrop={<HeaderField variant="solutions" />}
      />

      <section className="pb-section">
        <Container>
          <SectionImage
            slot={solutionsHero}
            alt={c("imagery.solutions-hero")}
            pendingLabel={c("imagery.pending")}
            className="mb-14"
          />

          {/*
            La cascade est portée par `Stagger` plutôt que par un retard écrit
            sur chaque carte : le rythme d'une liste appartient à la liste.
          */}
          <Stagger className="grid gap-grid md:grid-cols-3">
            {packs.map((pack, index) => (
              <SolutionCard key={pack.key}>
                {/*
                  L'image ouvre la carte et dit le volume avant les mots : une
                  feuille seule, un planning aux deux tiers rempli, une valise
                  de production. Aucun prix n'étant affiché, c'est le seul
                  repère d'échelle que la page puisse donner honnêtement.
                */}
                {solutionsImagery[pack.key] && (
                  <SectionImage
                    slot={solutionsImagery[pack.key]!}
                    alt={c(`imagery.solutions-pack-${pack.key}`)}
                    pendingLabel={c("imagery.pending")}
                    className="mb-8"
                  />
                )}

                <SolutionCardHeader
                  index={String(index + 1).padStart(2, "0")}
                  name={pack.name}
                  tagline={pack.tagline}
                />

                <p className="mt-8 text-caption text-anthracite/70">
                  {t("solutions.forWhoLabel")}
                </p>
                <p className="mt-2 text-small text-anthracite/70">
                  {pack.forWho}
                </p>

                <p className="mt-8 text-caption text-anthracite/70">
                  {t("solutions.includesLabel")}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {pack.includes.map((entry) => (
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

                <SolutionCardFooter>
                  <Button
                    href={href(typedLocale, "demander-un-devis")}
                    variant="secondary"
                    arrow
                    className="w-full sm:w-auto md:w-full lg:w-auto"
                  >
                    {c("cta.quote")}
                  </Button>
                </SolutionCardFooter>
              </SolutionCard>
            ))}
          </Stagger>

          <Block className="mt-20 max-w-prose">
            <h2 className="text-h3 text-ink">{t("solutions.customTitle")}</h2>
            <p className="mt-3 text-body text-anthracite/70">
              {t("solutions.customBody")}
            </p>
            <div className="mt-8">
              <Button href={href(typedLocale, "contact")} variant="link" arrow>
                {c("cta.contact")}
              </Button>
            </div>
          </Block>
        </Container>
      </section>
    </>
  );
}
