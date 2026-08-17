import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/buttons/Button";
import { HeroMark } from "@/components/hero/HeroMark";

/**
 * Hero.
 *
 * Le titre occupe la majeure partie de l'écran et se dévoile ligne par ligne :
 * la marque n'annonce pas sa présence, elle occupe l'espace. La composition est
 * asymétrique — titre à gauche sur toute la largeur, accroche et actions
 * décalées à droite — pour éviter l'axe central des pages génériques.
 *
 * Aucune vidéo : le Hero doit tenir sans média lourd, et le premier rendu ne
 * dépend d'aucun fichier de plusieurs mégaoctets.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  return (
    <section className="relative overflow-hidden border-b border-canvas-gray bg-canvas-off">
      <HeroMark />

      <Container className="relative flex min-h-[88svh] flex-col justify-between pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="flex items-start justify-between gap-8">
          <Eyebrow className="text-atlas">{t("hero.eyebrow")}</Eyebrow>
          <p className="hidden text-caption uppercase text-anthracite/40 md:block">
            {t("hero.based")}
          </p>
        </div>

        <div className="my-12 md:my-16">
          <TextReveal
            as="h1"
            lines={t.list("hero.titleLines")}
            className="text-display uppercase text-deep"
          />
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={0.35} className="md:col-span-3">
            <p className="hidden text-caption uppercase text-anthracite/40 md:block">
              {t("hero.since")}
            </p>
            <p className="mt-3 hidden text-caption uppercase text-anthracite/30 md:block">
              {t("hero.scroll")}
            </p>
          </Reveal>

          <Reveal delay={0.45} className="md:col-span-5 md:col-start-8">
            <p className="max-w-prose text-body-lg text-anthracite/75">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={href(locale, "demander-un-devis")} size="lg" arrow>
                {c("cta.talk")}
              </Button>
              <Button
                href={href(locale, "realisations")}
                variant="secondary"
                size="lg"
              >
                {c("cta.work")}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
