import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";

/**
 * Déclaration éditoriale.
 *
 * Aucune image, aucune carte, aucune donnée : uniquement de la typographie.
 * C'est une respiration volontaire entre deux sections denses — le rythme
 * compte autant que le contenu, et l'œil a besoin d'un point de repos avant
 * d'aborder le portfolio.
 */
export async function IntroStatement({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");

  return (
    <section className="border-b border-canvas-gray bg-beige-soft py-section">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-2">
            <Eyebrow className="text-atlas">{t("intro.eyebrow")}</Eyebrow>
          </div>

          <div className="md:col-span-9 md:col-start-4">
            <Headline
              as="h2"
              lines={t.list("intro.titleLines")}
              className="text-h2 text-deep"
            />
            <Block>
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
            </Block>
          </div>
        </div>
      </Container>
    </section>
  );
}
