import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

const principles = [
  "strategy",
  "creative",
  "data",
  "local",
  "partner",
  "growth",
] as const;

/**
 * Six principes, en colonnes décalées.
 *
 * Les entrées ne sont pas des cartes : pas de bordure, pas d'ombre, pas de
 * fond. Un numéro, un titre, deux lignes. La lisibilité vient de l'espace et
 * de l'alignement, pas d'un conteneur.
 */
export async function WhyAdrar({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");

  return (
    <section className="border-b border-canvas-gray bg-canvas py-section">
      <Container>
        <SectionHeader
          eyebrow={t("why.eyebrow")}
          titleLines={t.list("why.titleLines")}
          align="split"
          className="mb-20"
        />

        <Reveal staggerChildren className="grid gap-x-gutter gap-y-14 md:grid-cols-3">
          {principles.map((key, index) => (
            <RevealItem key={key} className={index % 3 === 1 ? "md:mt-12" : ""}>
              <p className="text-caption uppercase text-anthracite/30">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-h3 text-deep">
                {t(`why.items.${key}.title`)}
              </h3>
              <p className="mt-3 max-w-prose text-small text-anthracite/65">
                {t(`why.items.${key}.body`)}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
