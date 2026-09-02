import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { contact } from "@/config/site";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionImage } from "@/components/media/SectionImage";
import { quoteImage } from "@/data/imagery";
import { QuoteForm, type QuoteFormLabels } from "@/components/forms/QuoteForm";
import { sendLeadAction } from "@/lib/leads/actions";

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
    route: "demander-un-devis",
    title: t("quote.meta.title"),
    description: t("quote.meta.description"),
  });
}

interface Reassurance {
  title: string;
  body: string;
}

/**
 * Page de demande de devis.
 *
 * C'est la destination de tous les appels à l'action « devis » du site. Elle
 * était référencée partout et n'existait pas : chaque bouton principal, sur
 * chaque page et dans la barre de navigation, aboutissait à une 404.
 *
 * La composition place le formulaire à gauche et les garanties à droite : les
 * objections d'un prospect (délai de réponse, périmètre, engagement) se lisent
 * pendant qu'il remplit, et non après.
 */
export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");

  const labels: QuoteFormLabels = {
    legendProject: t("quote.form.legendProject"),
    legendContact: t("quote.form.legendContact"),
    name: t("quote.form.name"),
    company: t("quote.form.company"),
    email: t("quote.form.email"),
    phone: t("quote.form.phone"),
    services: t("quote.form.services"),
    servicesHint: t("quote.form.servicesHint"),
    budget: t("quote.form.budget"),
    timeline: t("quote.form.timeline"),
    message: t("quote.form.message"),
    messagePlaceholder: t("quote.form.messagePlaceholder"),
    privacyConsent: t("quote.form.privacyConsent"),
    privacyLink: t("quote.form.privacyLink"),
    optional: t("quote.form.optional"),
    required: t("quote.form.required"),
    choose: t("quote.form.choose"),
    submit: t("quote.form.submit"),
    budgets: t.list("quote.form.budgets"),
    timelines: t.list("quote.form.timelines"),
    errors: {
      name: t("quote.form.errors.name"),
      email: t("quote.form.errors.email"),
      contact: t("quote.form.errors.contact"),
      message: t("quote.form.errors.message"),
      consent: t("quote.form.errors.consent"),
    },
    sending: t("quote.form.sending"),
    trapLabel: t("quote.form.trapLabel"),
    sentTitle: t("quote.form.sentTitle"),
    sentBody: t("quote.form.sentBody"),
    sentHome: t("quote.form.sentHome"),
    sentWork: t("quote.form.sentWork"),
    failedNotice: t("quote.form.failedNotice"),
    rateLimitedNotice: t("quote.form.rateLimitedNotice"),
    summaryTitle: t("quote.form.summaryTitle"),
    summaryHint: t("quote.form.summaryHint"),
    sendEmail: t("quote.form.sendEmail"),
    sendWhatsapp: t("quote.form.sendWhatsapp"),
    edit: t("quote.form.edit"),
    noChannel: t("quote.form.noChannel"),
    copy: t("quote.form.copy"),
    copied: t("quote.form.copied"),
  };

  const reassurances = t.entries<Reassurance>("quote.reassure");

  return (
    <>
      <PageHeader
        eyebrow={t("quote.eyebrow")}
        titleLines={t.list("quote.titleLines")}
        intro={t("quote.intro")}
      />

      <section className="pb-section">
        <Container>
          <div className="grid gap-16 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-7">
              <QuoteForm
                labels={labels}
                locale={typedLocale}
                action={sendLeadAction}
                serviceOptions={services.map((service) => c(service.nameKey))}
                email={contact.email}
                whatsapp={contact.whatsapp}
                subjectPrefix={t("quote.meta.title")}
              />
            </Block>

            <Block delay={120} className="md:col-span-4 md:col-start-9">
              <ul className="flex flex-col gap-10">
                {reassurances.map((item) => (
                  <li key={item.title}>
                    <h2 className="flex items-center gap-3 text-h3 text-ink">
                      {item.title}
                      <span
                        aria-hidden
                        className="block h-2 w-2 shrink-0 rounded-pill bg-light"
                      />
                    </h2>
                    <p className="mt-3 text-small text-anthracite/70">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>

              {/*
                L'image ferme la colonne de réassurance, pas celle du
                formulaire : un champ à remplir ne gagne rien à être illustré,
                et tout ce qui s'intercale entre deux champs allonge la saisie.
              */}
              <SectionImage
                slot={quoteImage}
                alt={c("imagery.quote")}
                pendingLabel={c("imagery.pending")}
                className="mt-14"
              />
            </Block>
          </div>
        </Container>
      </section>
    </>
  );
}
