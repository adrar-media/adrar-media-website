import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";
import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { TrustSection } from "@/components/statistics/TrustSection";
import { IntroStatement } from "@/components/sections/IntroStatement";
import { ServicesSection } from "@/components/services/ServicesSection";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { ResultsSection } from "@/components/statistics/ResultsSection";
import { WhyAdrar } from "@/components/sections/WhyAdrar";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { CTASection } from "@/components/layout/CTASection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslator(locale, "home");
  return pageMetadata({
    locale,
    title: t("meta.title"),
    description: t("meta.description"),
    absoluteTitle: true,
  });
}

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
      {/*
        Identité de l'organisation et du site, déclarées une seule fois sur la
        page d'accueil : c'est la page que les moteurs rattachent à l'entité.
      */}
      <JsonLd data={[organizationSchema(locale), websiteSchema(locale)]} />

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
      {/*
        Témoignages — la section est écrite mais reste invisible tant qu'aucun
        client n'a validé sa citation par écrit (data/testimonials.ts). Aucune
        citation n'est inventée pour remplir la page.
      */}
      <TestimonialsSection locale={locale} />
      <WhyAdrar locale={locale} />

      <CTASection locale={locale} />
    </>
  );
}
