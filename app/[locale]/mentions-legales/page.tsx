import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProseSections, type ProseSection } from "@/components/layout/Prose";
import { legalConfig, legalIdentityComplete } from "@/config/legal";
import { Container } from "@/components/ui/Container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslator(locale, "pages");
  return pageMetadata({
    locale,
    route: "mentions-legales",
    title: t("legal.meta.title"),
    description: t("legal.meta.description"),
  });
}

/** Page réglementaire alimentée par l'identité officielle centralisée. */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const sections = t.entries<ProseSection>("legal.sections");

  if (!legalIdentityComplete()) {
    throw new Error("Official legal identity configuration is incomplete.");
  }

  return (
    <>
      <PageHeader
        eyebrow={t("legal.eyebrow")}
        titleLines={t.list("legal.titleLines")}
        intro={t("legal.intro") || undefined}
      />

      <section className="pb-14">
        <Container>
          <div className="rounded-lg border border-anthracite/[0.12] bg-canvas-raised p-7 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-h3 text-ink">{t("legal.identityTitle")}</h2>
              <span
                className="rounded-pill bg-atlas/15 px-4 py-2 text-caption text-atlas-dark"
              >
                {t("legal.completeStatus")}
              </span>
            </div>

            <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [t("legal.fields.tradeName"), legalConfig.tradeName],
                [t("legal.fields.legalName"), legalConfig.legalName],
                [t("legal.fields.legalForm"), legalConfig.legalForm],
                [t("legal.fields.capital"), legalConfig.capital],
                [t("legal.fields.tradeRegister"), legalConfig.tradeRegister],
                [t("legal.fields.taxId"), legalConfig.taxId],
                [t("legal.fields.ice"), legalConfig.ice],
                [t("legal.fields.professionalTax"), legalConfig.professionalTax],
                [t("legal.fields.headquarters"), legalConfig.headquarters],
                [t("legal.fields.manager"), legalConfig.manager],
                [t("legal.fields.publicationDirector"), legalConfig.publicationDirector],
                [t("legal.fields.email"), legalConfig.dataContact],
                [t("legal.fields.website"), legalConfig.website],
                [t("legal.fields.host"), legalConfig.hostName],
                [t("legal.fields.hostAddress"), legalConfig.hostAddress],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-caption text-anthracite/70">{label}</dt>
                  <dd className="mt-2 text-small text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <ProseSections sections={sections} pendingLabel="" pendingNote="" />
    </>
  );
}
