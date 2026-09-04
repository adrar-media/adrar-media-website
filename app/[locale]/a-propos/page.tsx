import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { team } from "@/data/team";
import { SectionImage } from "@/components/media/SectionImage";
import { aboutImagery } from "@/data/imagery";
import { pageMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/Container";
import { Block, BlockItem } from "@/components/ui/Block";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/layout/CTASection";
import { StepGlyph } from "@/components/process/StepGlyph";
import { TeamChart } from "@/components/team/TeamChart";
import { HeaderField } from "@/components/decor/HeaderField";
import { Button } from "@/components/buttons/Button";

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
    route: "a-propos",
    title: t("about.meta.title"),
    description: t("about.meta.description"),
  });
}

interface Value {
  title: string;
  body: string;
}

interface Fact {
  label: string;
  value: string;
}

/** Page À propos, avec les profils confirmés dans `data/team.ts`. */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  const values = t.entries<Value>("about.values");
  const facts = t.entries<Fact>("about.facts");

  return (
    <>
      <PageHeader
        eyebrow={t("about.eyebrow")}
        titleLines={t.list("about.titleLines")}
        intro={t("about.intro")}
        backdrop={<HeaderField variant="about" />}
      />

      {/* ------------------------------------------------------------------
          L'AGENCE EN BREF, AVANT LE RÉCIT.

          Les quatre pages « à propos » d'agence se ressemblent toutes : trois
          paragraphes avant d'apprendre où elles sont et ce qu'elles couvrent.
          Ce bandeau donne d'emblée les quatre faits qu'on vient vérifier —
          d'où, en quelles langues, sur quels domaines, sous quelle forme. Le
          récit vient après, pour qui veut le lire.

          Aucun de ces faits n'est décoratif : ils sont tous vérifiables
          ailleurs sur le site — l'adresse en pied de page, les langues dans le
          sélecteur, les sept domaines sur la page Services.
          ------------------------------------------------------------------ */}
      {facts.length > 0 && (
        <section className="border-b border-canvas-gray py-14">
          <Container>
            <Block>
              <p className="eyebrow text-anthracite/70">
                {t("about.briefLabel")}
              </p>
              {/*
                LES QUATRE FAITS ARRIVENT EN CASCADE, pas d'un bloc.

                Rendus par un seul `Block`, ils apparaissaient ensemble : le
                bandeau se lisait alors comme une image, et l'œil ne savait pas
                par où l'attaquer. Décalés de 80 ms, ils se lisent de gauche à
                droite, dans l'ordre où ils sont écrits. Le décalage reste court
                — au-delà, quatre faits mettent une seconde à s'afficher, et
                l'attente se remarque plus que le rythme.
              */}
              <dl className="mt-8 grid gap-x-grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {facts.map((fact, index) => (
                  <BlockItem
                    key={fact.label}
                    delay={index * 80}
                    className="border-t border-atlas/25 pt-4"
                  >
                    <dt className="text-caption text-anthracite/70">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 text-body-lg text-ink">{fact.value}</dd>
                  </BlockItem>
                ))}
              </dl>
            </Block>
          </Container>
        </section>
      )}

      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("about.nameTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("about.nameBody")}
              </p>

              {/*
                « Adrar » est le mot amazigh pour la montagne. Le paragraphe
                l'explique, l'image le montre : c'est le seul endroit du site où
                une photographie de paysage se justifie autrement que comme
                décor.
              */}
              <SectionImage
                slot={aboutImagery.name}
                alt={c("imagery.about-name")}
                pendingLabel={c("imagery.pending")}
                className="mt-12"
              />
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12">
            <Block className="md:col-span-4">
              <h2 className="text-h3 text-ink">{t("about.storyTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-7 md:col-start-6">
              {t.list("about.storyBody").map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className={
                    index === 0
                      ? "max-w-prose text-body-lg text-anthracite/80"
                      : "mt-6 max-w-prose text-body-lg text-anthracite/80"
                  }
                >
                  {paragraph}
                </p>
              ))}

              <SectionImage
                slot={aboutImagery.story}
                alt={c("imagery.about-story")}
                pendingLabel={c("imagery.pending")}
                className="mt-12"
              />
            </Block>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------
          MISSION ET VISION, CÔTE À CÔTE ET NON L'UNE SOUS L'AUTRE.

          Les deux mots sont interchangeables dans la plupart des pages
          d'agence, ce qui est exactement le problème : empilés en deux
          paragraphes, personne ne voit ce qui les sépare. En vis-à-vis, la
          différence devient une question de temps — la mission est ce que nous
          faisons cette semaine, la vision ce vers quoi elle tend.

          LE CONTRASTE PORTE CETTE DIFFÉRENCE. La mission est posée sur le fond
          de la page, comme le reste du travail courant ; la vision est sur le
          bloc sombre, qui est le registre réservé aux prises de position sur ce
          site. Ce n'est pas une alternance décorative : inversées, les deux
          cartes diraient le contraire de leur texte.
          ------------------------------------------------------------------ */}
      <section className="border-b border-canvas-gray bg-beige-soft py-section">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-grid">
            <Block className="flex flex-col rounded-lg border border-anthracite/[0.12] bg-canvas p-8 md:p-12">
              <span aria-hidden className="mb-8 block text-atlas">
                <StepGlyph step="strategize" className="h-12 w-12" />
              </span>
              <h2 className="text-h3 text-ink">{t("about.missionTitle")}</h2>
              <p className="mt-4 max-w-prose text-body-lg text-anthracite/75">
                {t("about.missionBody")}
              </p>
              <ul className="mt-8 flex flex-col gap-3 border-t border-anthracite/10 pt-6">
                {t.list("about.missionPoints").map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-small text-anthracite/70"
                  >
                    <span
                      aria-hidden
                      className="mt-2 block h-1 w-1 shrink-0 rounded-pill bg-atlas"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Block>

            <Block
              delay={120}
              className="card-sweep flex flex-col rounded-lg bg-surface p-8 text-white md:p-12"
            >
              <span aria-hidden className="mb-8 block text-beige">
                <StepGlyph step="scale" className="h-12 w-12" />
              </span>
              <h2 className="text-h3 text-white">{t("about.visionTitle")}</h2>
              <p className="mt-4 max-w-prose text-body-lg text-white/75">
                {t("about.visionBody")}
              </p>
              <ul className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6">
                {t.list("about.visionPoints").map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-small text-white/70"
                  >
                    <span
                      aria-hidden
                      className="mt-2 block h-1 w-1 shrink-0 rounded-pill bg-beige"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </Container>
      </section>

      <section className="border-b border-canvas-gray bg-canvas-off py-section">
        <Container>
          <Block>
            <h2 className="text-h2 text-ink">{t("about.valuesTitle")}</h2>
          </Block>

          <SectionImage
            slot={aboutImagery.values}
            alt={c("imagery.about-values")}
            pendingLabel={c("imagery.pending")}
            className="mt-14"
          />

          <Block className="mt-16 grid gap-x-grid gap-y-14 md:grid-cols-2">
            {values.map((value, index) => (
              <BlockItem key={value.title} delay={(index % 2) * 90}>
                <h3 className="flex items-center gap-3 text-h3 text-ink">
                  {value.title}
                  <span
                    aria-hidden
                    className="block h-2 w-2 shrink-0 rounded-pill bg-light"
                  />
                </h3>
                <p className="mt-3 max-w-prose text-body text-anthracite/70">
                  {value.body}
                </p>
              </BlockItem>
            ))}
          </Block>
        </Container>
      </section>

      {/* ------------------------------------------------------------------
          L'ÉQUIPE.

          Les profils viennent de `data/team.ts`, dans l'ordre de
          l'organigramme. Aucun nom n'est écrit ici : la page ne fait que rendre
          ce que la direction a communiqué, et une entrée retirée du fichier
          disparaît sans toucher à ce composant.

          LE REPLI VIDE RESTE EN PLACE, et il n'est pas mort. Il servait quand
          la liste était vide et resservira à toute nouvelle langue ou tout
          nouveau déploiement dont l'équipe n'est pas encore renseignée : un
          vide sans motif se lit comme un oubli, une grille de silhouettes
          génériques serait pire.

          L'INTRODUCTION EST AFFICHÉE DANS LES DEUX CAS. Elle ne décrit
          personne en particulier : elle dit comment l'équipe est organisée, ce
          qui restait vrai avant les portraits et le reste après.
          ------------------------------------------------------------------ */}
      <section className="border-b border-canvas-gray py-section">
        <Container>
          <div className="grid gap-6 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-4">
              <h2 className="text-h2 text-ink">{t("about.teamTitle")}</h2>
            </Block>
            <Block delay={100} className="md:col-span-6 md:col-start-6">
              <p className="max-w-prose text-body-lg text-anthracite/75">
                {t("about.teamIntro")}
              </p>
            </Block>
          </div>

          {/*
            LE SCHÉMA PREND TOUTE LA LARGEUR, pas la colonne de droite.

            Un organigramme se lit en largeur : c'est l'écartement des branches
            qui dit combien de personnes dépendent de qui. Enfermé dans sept
            colonnes sur douze, il se replierait en une pile où toutes les
            cartes seraient alignées — un schéma qui ne montre plus de
            structure n'est plus qu'une liste avec des traits.
          */}
          {team.length > 0 ? (
            <div className="mt-16 md:mt-20">
              <TeamChart
                members={team}
                locale={typedLocale}
                label={t("about.teamTitle")}
              />
            </div>
          ) : (
            <p className="mt-14 max-w-prose text-body text-anthracite/70">
              {t("about.teamPending")}
            </p>
          )}
        </Container>
      </section>

      {typedLocale === "fr" && (
        <section className="border-b border-canvas-gray bg-beige-soft py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-grid">
              <Block className="md:col-span-4">
                <h2 className="text-h3 text-ink">{t("about.areasTitle")}</h2>
              </Block>
              <Block delay={100} className="md:col-span-7 md:col-start-6">
                <p className="max-w-prose text-body-lg text-anthracite/80">
                  {t("about.areasBody")}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/fr/fes" variant="secondary" size="md">
                    {t("about.areasLinkFesLabel")}
                  </Button>
                  <Button href="/fr/meknes" variant="secondary" size="md">
                    {t("about.areasLinkMeknesLabel")}
                  </Button>
                </div>
              </Block>
            </div>
          </Container>
        </section>
      )}

      <CTASection locale={typedLocale} />
    </>
  );
}
