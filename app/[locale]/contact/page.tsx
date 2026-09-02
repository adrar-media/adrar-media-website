import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { href } from "@/lib/i18n/routing";
import { contact } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { HeaderField } from "@/components/decor/HeaderField";
import { SectionImage } from "@/components/media/SectionImage";
import { contactImage } from "@/data/imagery";
import { LocationMap } from "@/components/contact/LocationMap";
import { SocialLinks } from "@/components/ui/SocialLinks";

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
    route: "contact",
    title: t("contact.meta.title"),
    description: t("contact.meta.description"),
  });
}

/**
 * Page Contact.
 *
 * Les canaux viennent de l'environnement et non d'une liste écrite en dur :
 * un canal non configuré n'est pas affiché avec un faux numéro, il disparaît.
 * Si aucun canal n'est publié, la page le dit et renvoie vers le devis, qui
 * fonctionne sans coordonnées.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const t = await getTranslator(typedLocale, "pages");
  const c = await getTranslator(typedLocale, "common");
  /*
   * La requête cartographique préfère le repère précis au libellé affiché : un
   * nom d'établissement place une épingle, une ville n'en place aucune. À
   * défaut, le libellé fait l'affaire. Les deux vides, la carte disparaît.
   */
  const mapQuery = contact.mapQuery || contact.location;

  const channels = [
    contact.email && {
      label: t("contact.meta.title"),
      value: contact.email,
      href: `mailto:${contact.email}`,
      name: "email",
    },
    contact.phoneDisplay &&
      contact.phoneE164 && {
        label: c("footer.contact"),
        value: contact.phoneDisplay,
        href: `tel:${contact.phoneE164}`,
        name: "phone",
      },
    contact.landlineDisplay &&
      contact.landlineE164 && {
        label: c("footer.channels.landline"),
        value: contact.landlineDisplay,
        href: `tel:${contact.landlineE164}`,
        name: "landline",
      },
  ].filter(Boolean) as { label: string; value: string; href: string; name: string }[];

  return (
    <>
      <PageHeader
        eyebrow={t("contact.eyebrow")}
        titleLines={t.list("contact.titleLines")}
        intro={t("contact.intro")}
        backdrop={<HeaderField variant="contact" />}
      />

      <section className="pb-section">
        <Container>
          <div className="grid gap-16 md:grid-cols-12 md:gap-grid">
            <Block className="md:col-span-6">
              <h2 className="text-h3 text-ink">{t("contact.channelsTitle")}</h2>

              {channels.length > 0 ? (
                <ul className="mt-8 border-t border-anthracite/[0.12]">
                  {channels.map((channel) => (
                    <li
                      key={channel.name}
                      className="border-b border-anthracite/[0.12]"
                    >
                      <a
                        href={channel.href}
                        className="group flex items-center justify-between gap-6 py-6"
                      >
                        <span
                          dir={
                            channel.name === "phone" ||
                            channel.name === "landline"
                              ? "ltr"
                              : undefined
                          }
                          className="text-body-lg text-ink"
                        >
                          {channel.value}
                        </span>
                        <span aria-hidden className="arrow-nudge text-atlas">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 max-w-prose text-body text-anthracite/70">
                  {t("contact.pendingAll")}
                </p>
              )}

              {/*
                WHATSAPP ET LES RÉSEAUX SORTENT DE LA LISTE DES CANAUX.

                Une ligne « WhatsApp » alignée sous un e-mail et deux numéros se
                lisait comme une quatrième coordonnée à recopier, alors que
                c'est un bouton qui ouvre une conversation. En icônes, la
                distinction est immédiate : au-dessus on lit, en dessous on
                clique.
              */}
              <SocialLinks
                label={c("footer.follow")}
                whatsappLabel={c("cta.whatsapp")}
                className="mt-6"
              />

              <div className="mt-12">
                <h3 className="text-caption text-atlas">
                  {t("contact.hoursTitle")}
                </h3>
                <p className="mt-3 max-w-prose text-small text-anthracite/70">
                  {t("contact.hoursBody")}
                </p>
              </div>

              {contact.location && (
                <div className="mt-10">
                  <h3 className="text-caption text-atlas">
                    {t("contact.locationTitle")}
                  </h3>
                  <p className="mt-3 text-small text-anthracite/70">
                    {contact.location}
                  </p>
                </div>
              )}

              {/*
                L'image ferme la colonne des coordonnées : elle situe l'agence
                dans une ville plutôt que dans un formulaire. Elle vient après
                les canaux — un visiteur venu chercher un numéro doit le
                trouver avant tout le reste.
              */}
              <SectionImage
                slot={contactImage}
                alt={c("imagery.contact")}
                pendingLabel={c("imagery.pending")}
                className="mt-14"
              />
            </Block>

            <Block delay={120} className="md:col-span-5 md:col-start-8">
              <div className="card-sweep rounded-lg bg-surface p-8 text-white md:p-10">
                <h2 className="text-h3 text-white">
                  {t("contact.quoteTitle")}
                </h2>
                <p className="mt-4 text-body text-white/70">
                  {t("contact.quoteBody")}
                </p>
                <div className="mt-8">
                  <Button
                    href={href(typedLocale, "demander-un-devis")}
                    variant="invert"
                    size="lg"
                    arrow
                  >
                    {c("cta.quote")}
                  </Button>
                </div>
              </div>
            </Block>
          </div>

          {/*
            LA CARTE FERME LA PAGE, EN PLEINE LARGEUR.

            Elle est posée après les canaux et après le devis, jamais avant :
            un visiteur venu chercher un numéro ou envoyer une demande doit les
            trouver d'abord. La carte répond à une autre question — « où sont-
            ils ? » — qui vient une fois les deux premières réglées.

            Pleine largeur plutôt que glissée dans la colonne des coordonnées :
            une carte de 350 px de côté ne montre qu'un quartier sans repère,
            et le premier geste du visiteur est alors de dézoomer.

            Elle ne s'affiche pas tant qu'aucun lieu n'est configuré — voir
            `contact.location` et `contact.mapQuery` dans `config/site.ts`.
          */}
          {mapQuery && (
            <Block delay={180} className="mt-20 md:mt-24">
              <h2 className="text-h3 text-ink">{t("contact.locationTitle")}</h2>
              <div className="mt-8">
                <LocationMap
                  query={mapQuery}
                  label={contact.location || mapQuery}
                  labels={{
                    load: t("contact.map.load"),
                    notice: t("contact.map.notice"),
                    frameTitle: t("contact.map.frameTitle"),
                    openExternal: t("contact.map.openExternal"),
                  }}
                />
              </div>
            </Block>
          )}
        </Container>
      </section>
    </>
  );
}
