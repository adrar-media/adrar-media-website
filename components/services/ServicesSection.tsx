import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/buttons/Button";
import { ServiceRows, type ServiceRow } from "@/components/services/ServiceRows";

export async function ServicesSection({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  const rows: ServiceRow[] = services.map((service) => ({
    index: service.index,
    kicker: service.kicker,
    name: c(service.nameKey),
    description: t(service.descriptionKey),
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
          className="mb-16"
        />
        <ServiceRows rows={rows} />
        <div className="mt-12">
          <Button href={href(locale, "services")} variant="secondary" arrow>
            {t("services.all")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
