import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { verifiedResults } from "@/data/statistics";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Block } from "@/components/ui/Block";
import { Counter } from "@/components/statistics/Counter";

/**
 * Résultats vérifiés.
 *
 * La section ne s'affiche pas si aucun résultat sourcé n'existe. Chaque chiffre
 * porte sa provenance à l'écran : un prospect doit pouvoir demander d'où il
 * vient et obtenir une réponse. La mise en page s'adapte à une seule métrique
 * comme à plusieurs — pas de grille à remplir.
 */
export async function ResultsSection({ locale }: { locale: Locale }) {
  if (verifiedResults.length === 0) return null;

  const t = await getTranslator(locale, "home");
  const single = verifiedResults.length === 1;

  return (
    <section className="border-b border-canvas-gray bg-canvas-off py-section">
      <Container>
        <SectionHeader
          eyebrow={t("results.eyebrow")}
          titleLines={t.list("results.titleLines")}
          intro={t("results.intro")}
          align="split"
          className="mb-20"
        />

        <div
          className={
            single
              ? "grid gap-10 md:grid-cols-12 md:items-end"
              : "grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {verifiedResults.map((result) => (
            <Block
              key={result.label}
              className={single ? "md:col-span-7" : undefined}
            >
              <p className="text-display leading-none text-deep">
                <Counter value={result.value} suffix={result.suffix} />
              </p>
              <p className="mt-4 text-body-lg text-anthracite/75">
                {t(result.label)}
              </p>
              <p className="mt-3 text-caption text-anthracite/40">
                {t("results.sourceLabel")} — {result.source}
              </p>
            </Block>
          ))}
        </div>
      </Container>
    </section>
  );
}
