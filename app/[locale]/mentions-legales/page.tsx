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
  const rawSections = t.entries<ProseSection>("legal.sections");
  const publisherFlags = [
    Boolean(legalConfig.legalForm && legalConfig.capital),
    Boolean(legalConfig.tradeRegister),
    Boolean(legalConfig.taxId && legalConfig.ice),
    Boolean(legalConfig.headquarters),
    Boolean(legalConfig.publicationDirector),
  ];
  const sections = rawSections.map((section, index) => {
    if (index === 0) {
      return {
        ...section,
        pending: (section.pending ?? []).filter((_, itemIndex) =>
          !publisherFlags[itemIndex]
        ),
      };
    }
    if (index === 1 && legalConfig.hostName && legalConfig.hostAddress) {
      return { ...section, pending: [] };
    }
    return section;
  });

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
                className={
                  legalIdentityComplete()
                    ? "rounded-pill bg-atlas/15 px-4 py-2 text-caption text-atlas-dark"
                    : "rounded-pill bg-beige-soft px-4 py-2 text-caption text-anthracite"
                }
              >
                {legalIdentityComplete()
                  ? t("legal.completeStatus")
                  : t("legal.prelaunchStatus")}
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
                [t("legal.fields.headquarters"), legalConfig.headquarters],
                [t("legal.fields.publicationDirector"), legalConfig.publicationDirector],
                [t("legal.fields.host"), legalConfig.hostName],
                [t("legal.fields.hostAddress"), legalConfig.hostAddress],
                [t("legal.fields.hostUrl"), legalConfig.hostUrl],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-caption text-anthracite/70">{label}</dt>
                  <dd className="mt-2 text-small text-ink">
                    {value || t("legal.notConfigured")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <ProseSections
        sections={sections}
        pendingLabel={t("legal.pendingLabel")}
        pendingNote={t("legal.pendingNote")}
      />
    </>
  );
}
