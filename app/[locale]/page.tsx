import { isLocale } from "@/config/i18n";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { Marquee } from "@/components/ui/Marquee";
import { Button } from "@/components/buttons/Button";

/**
 * Hero provisoire — valide la chaîne i18n, le RTL et les tokens typographiques.
 * La homepage complète (Hero → Trust → … → Footer) est construite en PHASE 08.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  return (
    <>
      <section className="py-section">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Eyebrow className="mb-8 text-atlas">{t("hero.eyebrow")}</Eyebrow>
              <TextReveal
                as="h1"
                lines={t.list("hero.titleLines")}
                className="text-display uppercase text-deep"
              />
            </div>
            <div className="md:col-span-4">
              <p className="max-w-prose text-body-lg text-anthracite/75">
                {t("hero.description")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={href(locale, "demander-un-devis")} arrow>
                  {c("cta.talk")}
                </Button>
                <Button href={href(locale, "realisations")} variant="secondary">
                  {c("cta.work")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Marquee items={t.list("marquee")} className="bg-canvas-off" />
    </>
  );
}
