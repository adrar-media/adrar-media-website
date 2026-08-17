import { isLocale } from "@/config/i18n";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/ui/TextReveal";

/**
 * Placeholder de PHASE 06 — sert à valider que /fr/realisations, /en/work et
 * /ar/aamal aboutissent bien à cette même route. Le portfolio réel est
 * construit en PHASE 09.
 */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = await getTranslator(locale, "common");

  return (
    <section className="py-section">
      <Container>
        <TextReveal
          as="h1"
          lines={[c("nav.work")]}
          className="text-h1 uppercase text-deep"
        />
      </Container>
    </section>
  );
}
