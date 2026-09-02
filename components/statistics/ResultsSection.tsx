import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import {
  resultSeries,
  resultSeriesIsPlaceholder,
  verifiedResults,
} from "@/data/statistics";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";
import { Counter } from "@/components/statistics/Counter";
import {
  ResultsChart,
  type ChartMetric,
} from "@/components/statistics/ResultsChart";

/**
 * Résultats vérifiés.
 *
 * DEUX REGISTRES, ET LEUR SÉPARATION EST LE SUJET DE LA SECTION.
 *
 * À gauche, LES CHIFFRES SOURCÉS : ceux que la direction a mesurés et dont la
 * provenance s'affiche sous chacun. Ils sont posés en grand, sans mouvement —
 * un résultat prouvé n'a pas besoin d'être mis en scène pour être cru, et
 * `Counter` refuse délibérément de les animer.
 *
 * À droite, LE GRAPHIQUE : la même matière rendue comparable, barre à barre.
 * Il porte la lecture d'ensemble que quatre nombres empilés ne donnent pas.
 *
 * L'IMAGE A ÉTÉ RETIRÉE. Elle fermait la section sur une photographie
 * d'ambiance décalée à droite, et l'ancien commentaire disait déjà pourquoi
 * elle n'avait pas sa place : « un résultat se lit, il ne s'illustre pas ». Ce
 * qui manquait sous les chiffres n'était pas une image, c'était de quoi les
 * comparer.
 *
 * LA MENTION « DONNÉES ILLUSTRATIVES » N'EST PAS UNE PRÉCAUTION DE STYLE.
 * Tant que `resultSeriesIsPlaceholder` vaut `true`, les valeurs du graphique
 * sont inventées, et la section le dit à l'écran. Sans cette ligne, quatre
 * barres de démonstration se lisent exactement comme quatre mesures — et un
 * prospect les citera. Voir `data/statistics.ts` pour la marche à suivre avant
 * publication.
 *
 * La section entière disparaît s'il n'y a ni chiffre sourcé ni série à tracer.
 */
export async function ResultsSection({ locale }: { locale: Locale }) {
  if (verifiedResults.length === 0 && resultSeries.length === 0) return null;

  const t = await getTranslator(locale, "home");

  const metrics: ChartMetric[] = resultSeries.map((metric) => ({
    key: metric.key,
    label: t(`results.series.${metric.key}`),
    value: metric.value,
    suffix: metric.suffix ?? "",
    ratio: metric.ratio,
    source: metric.source
      ? `${t("results.sourceLabel")} — ${metric.source}`
      : "",
  }));

  return (
    <section className="border-b border-canvas-gray bg-canvas-off py-section">
      <Container>
        <SectionHeader
          eyebrow={t("results.eyebrow")}
          titleLines={t.list("results.titleLines")}
          intro={t("results.intro")}
          align="split"
          className="mb-14"
        />

        <div className="grid gap-14 md:grid-cols-12 md:gap-grid">
          {/* ---------------------------------------------------------------
              LES CHIFFRES SOURCÉS — posés, non animés.
              --------------------------------------------------------------- */}
          {verifiedResults.length > 0 && (
            <Stagger className="flex flex-col gap-12 md:col-span-5">
              {verifiedResults.map((result) => (
                <div key={result.label}>
                  <p className="text-display leading-none text-ink">
                    <Counter value={result.value} suffix={result.suffix} />
                  </p>
                  <p className="mt-4 text-body-lg text-anthracite/75">
                    {t(result.label)}
                  </p>
                  <p className="mt-3 text-caption text-anthracite/70">
                    {t("results.sourceLabel")} — {result.source}
                  </p>
                </div>
              ))}
            </Stagger>
          )}

          {/* ---------------------------------------------------------------
              LE GRAPHIQUE — barres qui se remplissent, valeurs qui montent.
              --------------------------------------------------------------- */}
          {metrics.length > 0 && (
            <div className="md:col-span-6 md:col-start-7">
              <ResultsChart metrics={metrics} />

              {resultSeriesIsPlaceholder && (
                <p className="mt-10 border-t border-anthracite/[0.12] pt-5 text-caption text-anthracite/70">
                  {t("results.placeholderNotice")}
                </p>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
