import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { SectionImage } from "@/components/media/SectionImage";
import { homeImagery } from "@/data/imagery";

/**
 * Déclaration éditoriale.
 *
 * Aucune carte, aucune donnée : une phrase et une image. C'est une respiration
 * volontaire entre deux sections denses — le rythme compte autant que le
 * contenu, et l'œil a besoin d'un point de repos avant d'aborder le portfolio.
 *
 * L'image est cadrée en plongée sur une table de travail plutôt que sur un
 * résultat : la section parle de méthode, pas de livrable.
 */
export async function IntroStatement({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  return (
    <section className="border-b border-canvas-gray bg-beige-soft py-section">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-2">
            <Eyebrow className="text-atlas">{t("intro.eyebrow")}</Eyebrow>
          </Reveal>

          <div className="md:col-span-9 md:col-start-4">
            {/* Le titre porte sa propre découpe — pas de révélation par-dessus. */}
            <Headline
              as="h2"
              lines={t.list("intro.titleLines")}
              className="text-h2 text-ink"
            />
            <Block delay={120}>
              <p className="mt-10 max-w-prose text-body-lg text-anthracite/75">
                {t("intro.body")}
              </p>
              <Button
                href={href(locale, "methode")}
                variant="link"
                arrow
                className="mt-8"
              >
                {t("intro.cta")}
              </Button>

              <SectionImage
                slot={homeImagery.intro}
                alt={c("imagery.home-intro")}
                pendingLabel={c("imagery.pending")}
                className="mt-12 max-w-[46rem]"
              />
            </Block>
          </div>
        </div>
      </Container>
    </section>
  );
}
