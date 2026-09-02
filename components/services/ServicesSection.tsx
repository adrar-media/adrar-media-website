import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { services } from "@/data/services";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/buttons/Button";
import { ServiceRows, type ServiceRow } from "@/components/services/ServiceRows";
import { SectionImage } from "@/components/media/SectionImage";
import { homeImagery } from "@/data/imagery";

export async function ServicesSection({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  const rows: ServiceRow[] = services.map((service) => ({
    index: service.index,
    kicker: c(`kickers.${service.key}`),
    name: c(service.nameKey),
    description: t(service.descriptionKey),
    // Les pages de détail existent désormais : la rangée y mène directement
    // plutôt que de renvoyer vers une ancre de la page Services.
    href: `${href(locale, "services")}/${service.slug}`,
  }));

  return (
    <section className="border-b border-canvas-gray bg-canvas py-section">
      <Container>
        <SectionHeader
          eyebrow={t("services.eyebrow")}
          titleLines={t.list("services.titleLines")}
          intro={t("services.intro")}
          align="split"
          className="mb-14"
        />
        {/*
          L'image précède la liste : sept intitulés alignés sont une table des
          matières, et une table des matières se lit mieux quand on sait d'où
          elle vient. Le studio en fin de journée dit le métier avant que les
          rangées n'en donnent le détail.
        */}
        <SectionImage
          slot={homeImagery.services}
          alt={c("imagery.home-services")}
          pendingLabel={c("imagery.pending")}
          className="mb-14"
        />

        <ServiceRows rows={rows} />
        <Reveal className="mt-10">
          <Button href={href(locale, "services")} variant="secondary" arrow>
            {t("services.all")}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
