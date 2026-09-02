import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProseSections, type ProseSection } from "@/components/layout/Prose";
import { legalConfig } from "@/config/legal";
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
    route: "politique-confidentialite",
    title: t("privacy.meta.title"),
    description: t("privacy.meta.description"),
  });
}

/**
 * Page réglementaire.
 *
 * Les informations officielles qui n'ont pas été communiquées (immatriculation,
 * siège, directeur de publication, hébergeur) ne sont ni inventées ni passées
 * sous silence : chaque section liste nommément ce qui manque. C'est la seule
 * forme honnête tant que la direction n'a pas fourni ces éléments, et cela
 * garde la liste des manques sous les yeux au lieu de l'enterrer.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const rawSections = t.entries<ProseSection>("privacy.sections");
  const sections = rawSections.map((section, index) =>
    index === rawSections.length - 1 && legalConfig.cndpReceipt
      ? { ...section, pending: [] }
      : section,
  );

  return (
    <>
      <PageHeader
        eyebrow={t("privacy.eyebrow")}
        titleLines={t.list("privacy.titleLines")}
        intro={t("privacy.intro") || undefined}
      />

      <section className="pb-14">
        <Container>
          <div className="grid gap-6 rounded-lg border border-atlas/25 bg-atlas/10 p-7 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="text-caption text-anthracite/70">
                {t("privacy.dataContactLabel")}
              </h2>
              <p className="mt-2 text-body text-ink">
                {legalConfig.dataContact || t("privacy.notConfigured")}
              </p>
            </div>
            <div>
              <h2 className="text-caption text-anthracite/70">
                {t("privacy.cndpLabel")}
              </h2>
              <p className="mt-2 text-body text-ink">
                {legalConfig.cndpReceipt || t("privacy.notConfigured")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <ProseSections
        sections={sections}
        pendingLabel={t("privacy.pendingLabel")}
        pendingNote={t("privacy.pendingNote")}
      />
    </>
  );
}
