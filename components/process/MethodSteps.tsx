import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/buttons/Button";

const steps = [
  "discover",
  "strategize",
  "create",
  "distribute",
  "optimize",
  "scale",
] as const;

/**
 * Méthode en six étapes.
 *
 * Sur desktop, les étapes se lisent horizontalement le long d'une ligne
 * continue : la progression est visible d'un coup d'œil. Sur mobile, la même
 * ligne devient verticale — la métaphore du parcours est conservée au lieu
 * d'être abandonnée au profit d'une pile de blocs.
 */
export async function MethodSteps({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");

  return (
    <section className="border-b border-canvas-gray bg-beige-soft py-section">
      <Container>
        <SectionHeader
          eyebrow={t("method.eyebrow")}
          titleLines={t.list("method.titleLines")}
          intro={t("method.intro")}
          align="split"
          className="mb-14"
        />

        <Stagger className="relative grid gap-y-10 md:grid-cols-6 md:gap-x-8">
          {/* Ligne de progression : verticale sur mobile, horizontale sur desktop. */}
          <span
            aria-hidden
            className="absolute start-[7px] top-2 h-[calc(100%-1rem)] w-px bg-anthracite/20 md:start-0 md:top-[7px] md:h-px md:w-full"
          />

          {steps.map((step, index) => (
            <div
              key={step}
              className="relative ps-8 md:ps-0 md:pt-8"
            >
              <span
                aria-hidden
                className="absolute start-0 top-1 block h-[15px] w-[15px] rounded-full border border-anthracite/30 bg-beige-soft md:top-0"
              />
              <p className="text-caption text-atlas">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-h3 text-ink">
                {t(`method.steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-small text-anthracite/70">
                {t(`method.steps.${step}.body`)}
              </p>
            </div>
          ))}
        </Stagger>

        <div className="mt-16">
          <Button href={href(locale, "methode")} variant="secondary" arrow>
            {t("method.cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
