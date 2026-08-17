import { notFound } from "next/navigation";
import { isLocale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { TrustSection } from "@/components/statistics/TrustSection";
import { IntroStatement } from "@/components/sections/IntroStatement";
import { ServicesSection } from "@/components/services/ServicesSection";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { ResultsSection } from "@/components/statistics/ResultsSection";
import { WhyAdrar } from "@/components/sections/WhyAdrar";
import { CTASection } from "@/components/layout/CTASection";

/**
 * Homepage.
 *
 * Le rythme des fonds est délibéré : blanc cassé (hero) → blanc → beige →
 * blanc → DEEP BLUE (le travail) → blanc cassé → blanc → beige → DEEP BLUE
 * (l'action). La couleur forte n'apparaît que deux fois, sur les deux sections
 * que le visiteur doit retenir. Partout ailleurs, les fonds neutres tiennent
 * le rôle de ponctuation.
 *
 * Deux sections se masquent seules faute de données vérifiées : la preuve
 * sociale chiffrée et les témoignages.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslator(locale, "home");

  return (
    <>
      <Hero locale={locale} />

      <Marquee
        items={t.list("marquee")}
        className="border-b border-canvas-gray bg-canvas"
      />

      <TrustSection locale={locale} />
      <IntroStatement locale={locale} />
      <ServicesSection locale={locale} />
      <SelectedWork locale={locale} />
      <ResultsSection locale={locale} />
      <WhyAdrar locale={locale} />

      {/*
        Témoignages — CONTENT_REQUIRED : aucun témoignage client validé.
        Section volontairement absente plutôt que remplie de citations fictives.
        Insights / blog — prévu en V2.
      */}

      <CTASection locale={locale} />
    </>
  );
}
