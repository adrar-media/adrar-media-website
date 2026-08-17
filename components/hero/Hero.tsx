import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { verifiedResults } from "@/data/statistics";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/buttons/Button";
import { AmbientShapes } from "@/components/hero/AmbientShapes";

/**
 * Hero.
 *
 * Le titre occupe la quasi-totalité de l'écran et se dévoile ligne par ligne.
 * La deuxième ligne est décalée vers l'intérieur : ce décrochage crée un vide
 * dans lequel viennent se loger l'accroche et les actions, plutôt que de les
 * empiler sous le titre. C'est ce qui remplace la composition centrée.
 *
 * Aucune vidéo, aucune image : le premier écran ne dépend d'aucun fichier
 * lourd, seulement de typographie et de formes peintes par le navigateur.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  const lines = t.list("hero.titleLines");
  // Seule métrique vérifiée et sourcée : rien d'autre ne flotte sur le Hero.
  const badge = verifiedResults[0];

  return (
    <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
      <AmbientShapes />

      <Container className="relative">
        <Reveal>
          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
        </Reveal>

        <div className="mt-10 md:mt-14">
          {/* Ligne 1 pleine largeur. */}
          <TextReveal
            as="h1"
            lines={lines.slice(0, 1)}
            className="text-display text-deep"
          />

          {/* Ligne 2 décalée — le décrochage ouvre la place de l'accroche. */}
          <div className="md:ps-[14%]">
            <TextReveal
              as="p"
              lines={lines.slice(1)}
              className="text-display text-deep"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <Reveal delay={0.3} className="md:col-span-5 md:col-start-2">
            <p className="max-w-prose text-body-lg text-anthracite/80">
              {t("hero.description")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
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

          {badge && (
            <Reveal delay={0.45} className="md:col-span-4 md:col-start-9">
              <div className="inline-flex flex-col gap-1 rounded-lg bg-light px-7 py-6 shadow-glow">
                <span className="text-h3 leading-none text-deep">
                  {badge.value}
                  {badge.suffix}
                </span>
                <span className="text-small text-deep/70">
                  {t(badge.label)}
                </span>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
