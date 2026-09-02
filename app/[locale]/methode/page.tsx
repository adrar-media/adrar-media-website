import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { href } from "@/lib/i18n/routing";
import { SectionImage } from "@/components/media/SectionImage";
import { methodHero, methodImagery } from "@/data/imagery";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { HeaderField } from "@/components/decor/HeaderField";
import { CTASection } from "@/components/layout/CTASection";
import { MethodRail } from "@/components/process/MethodRail";
import { StepGlyph, type StepKey } from "@/components/process/StepGlyph";

const steps: readonly StepKey[] = [
  "discover",
  "strategize",
  "create",
  "distribute",
  "optimize",
  "scale",
] as const;

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
    route: "methode",
    title: t("method.meta.title"),
    description: t("method.meta.description"),
  });
}

/**
 * Page « Comment nous travaillons ».
 *
 * ELLE S'APPELAIT « MÉTHODE », ET C'ÉTAIT LE MOT DE L'AGENCE, PAS CELUI DU
 * CLIENT. Personne ne cherche « la méthode » d'un prestataire ; on cherche
 * comment il va s'y prendre. Le titre pose désormais la question du visiteur.
 * L'adresse, elle, n'a pas bougé — /methode reste servie, et les liens déjà
 * partagés continuent de fonctionner.
 *
 * LA PAGE EST UNE FRISE, PLUS UNE LISTE.
 *
 * Les six étapes étaient posées les unes sous les autres, séparées par un
 * filet. Rien, dans cette forme, ne disait qu'elles s'enchaînent : on pouvait
 * les lire dans n'importe quel ordre sans rien perdre. Or c'est précisément la
 * promesse de la page — un ordre, toujours le même. Un rail qui les traverse et
 * se trace au fil de la lecture (`MethodRail`) le dit par la forme, et le
 * médaillon de chaque étape marque où l'on en est.
 *
 * CHAQUE ÉTAPE PORTE UN PICTOGRAMME EN PLUS DE SA PHOTOGRAPHIE. Les deux ne
 * font pas double emploi : la photographie montre le geste, le pictogramme sert
 * de repère qu'on reconnaît en survolant la page sans lire. Voir `StepGlyph`.
 *
 * Les titres courts et les intitulés viennent du dictionnaire `home`, pour
 * qu'une reformulation reste faite à un seul endroit.
 */
export default async function MethodPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const home = await getTranslator(typedLocale, "home");
  const c = await getTranslator(typedLocale, "common");

  return (
    <>
      <PageHeader
        eyebrow={t("method.eyebrow")}
        titleLines={t.list("method.titleLines")}
        intro={t("method.intro")}
        backdrop={<HeaderField variant="method" />}
      />

      <section className="pb-section">
        <Container>
          <SectionImage
            slot={methodHero}
            alt={c("imagery.method-hero")}
            pendingLabel={c("imagery.pending")}
            className="mb-16"
          />

          {/* ----------------------------------------------------------------
              SOMMAIRE EN SIX REPÈRES.

              Six étapes détaillées font une page longue : sans vue d'ensemble,
              le visiteur découvre la troisième sans savoir combien il en reste.
              Cette rangée donne la longueur du parcours d'un coup d'œil, et les
              pictogrammes qu'on y voit sont ceux qu'on retrouvera plus bas.

              Elle est purement indicative — pas de lien, pas d'ancre : six
              ancres pour six blocs situés juste en dessous ajouteraient six
              cibles à parcourir au clavier pour économiser un mouvement de
              molette.
              ---------------------------------------------------------------- */}
          <Block className="mb-20 md:mb-24">
            <p className="eyebrow text-anthracite/70">
              {t("method.overviewLabel")}
            </p>
            <ol className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
              {/* Le fil qui relie les six repères, sur une seule ligne. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-6 hidden h-px bg-anthracite/[0.12] md:block"
              />
              {steps.map((step, index) => (
                <li key={step} className="relative">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-pill border border-anthracite/[0.12] bg-canvas text-atlas"
                  >
                    <StepGlyph step={step} className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-caption text-anthracite/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-small text-ink">
                    {home(`method.steps.${step}.title`)}
                  </p>
                </li>
              ))}
            </ol>
          </Block>

          {/* ----------------------------------------------------------------
              LA FRISE.

              `ps-16` / `md:ps-24` réserve la gouttière du rail et des
              médaillons : le contenu commence après, jamais dessous.
              ---------------------------------------------------------------- */}
          <ol className="relative">
            <MethodRail />

            {steps.map((step, index) => (
              <li key={step} className="relative ps-16 md:ps-24">
                {/*
                  Médaillon posé sur le rail. Le fond est plein — et non
                  transparent — pour que le trait passe derrière et non au
                  travers.
                */}
                <span
                  aria-hidden
                  className="absolute start-0 top-0 z-10 flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-pill border border-atlas/30 bg-canvas text-atlas md:h-[72px] md:w-[72px]"
                >
                  <StepGlyph step={step} className="h-7 w-7 md:h-8 md:w-8" />
                  <span className="text-[10px] leading-none tracking-[0.12em] text-atlas/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>

                <Block
                  delay={Math.min(index, 4) * 60}
                  className="grid gap-8 pb-16 md:grid-cols-11 md:gap-grid md:pb-24"
                >
                  <div className="md:col-span-4">
                    <h2 className="text-h3 text-ink">
                      {home(`method.steps.${step}.title`)}
                    </h2>
                    <p className="mt-3 max-w-prose text-small text-anthracite/70">
                      {home(`method.steps.${step}.body`)}
                    </p>

                    {/*
                      La durée est une pastille et non une ligne de texte : sur
                      six étapes, c'est la seule information qu'on compare d'une
                      étape à l'autre, et on ne compare pas ce qu'il faut
                      d'abord retrouver dans un paragraphe.
                    */}
                    <p className="mt-6 inline-flex items-center gap-2 rounded-pill bg-beige-soft px-3.5 py-1.5 text-caption text-anthracite/70">
                      <span aria-hidden className="text-atlas">
                        ◷
                      </span>
                      <span className="sr-only">
                        {t("method.durationLabel")} :{" "}
                      </span>
                      {t(`method.steps.${step}.duration`)}
                    </p>
                  </div>

                  <div className="md:col-span-6 md:col-start-6">
                    <p className="max-w-prose text-body-lg text-anthracite/75">
                      {t(`method.steps.${step}.detail`)}
                    </p>

                    <p className="mt-10 text-caption text-anthracite/70">
                      {t("method.outputsLabel")}
                    </p>
                    <ul className="mt-4 grid gap-x-grid gap-y-3 sm:grid-cols-2">
                      {t.list(`method.steps.${step}.outputs`).map((entry) => (
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

                    {/*
                      Une image par étape, dans la colonne du détail. Chacune
                      montre un geste et un seul — un entretien, une feuille
                      raturée, un écran d'étalonnage — pour que la liste des
                      six se parcoure comme une progression et non comme six
                      variantes du même bureau.
                    */}
                    <SectionImage
                      slot={methodImagery[step]!}
                      alt={c(`imagery.method-${step}`)}
                      pendingLabel={c("imagery.pending")}
                      className="mt-12"
                    />
                  </div>
                </Block>
              </li>
            ))}
          </ol>

          <Block className="mt-4">
            <h2 className="max-w-prose text-h3 text-ink">
              {t("method.ctaTitle")}
            </h2>
            <p className="mt-3 max-w-prose text-body text-anthracite/70">
              {t("method.ctaBody")}
            </p>
            <div className="mt-8">
              <Button
                href={href(typedLocale, "demander-un-devis")}
                size="lg"
                arrow
              >
                {c("cta.quote")}
              </Button>
            </div>
          </Block>
        </Container>
      </section>

      <CTASection locale={typedLocale} />
    </>
  );
}
