import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { whatsappLink } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/buttons/Button";

/**
 * Section de conversion finale.
 *
 * Deuxième et dernier passage en Deep Blue de la page, après le portfolio :
 * la couleur forte est réservée à ce qu'il faut retenir — le travail, puis
 * l'action. Le bouton WhatsApp n'apparaît que si un numéro est configuré.
 */
export async function CTASection({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");
  const whatsapp = whatsappLink();

  return (
    <section className="bg-deep py-section text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <TextReveal
              as="h2"
              lines={t.list("cta.titleLines")}
              className="text-h1 uppercase text-white"
            />
          </div>

          <Reveal delay={0.2} className="md:col-span-4">
            <p className="max-w-prose text-body-lg text-white/70">
              {t("cta.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={href(locale, "demander-un-devis")}
                variant="invert"
                size="lg"
                arrow
              >
                {c("cta.quote")}
              </Button>
              {whatsapp ? (
                <Button
                  href={whatsapp}
                  external
                  variant="secondary"
                  size="lg"
                  className="border-white/30 text-white hover:border-white hover:bg-white hover:text-deep"
                >
                  {c("cta.whatsapp")}
                </Button>
              ) : (
                <Button
                  href={href(locale, "contact")}
                  variant="secondary"
                  size="lg"
                  className="border-white/30 text-white hover:border-white hover:bg-white hover:text-deep"
                >
                  {c("cta.contact")}
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
