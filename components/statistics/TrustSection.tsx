import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { statistics } from "@/data/statistics";
import { Container } from "@/components/ui/Container";
import { Block, BlockItem } from "@/components/ui/Block";
import { Counter } from "@/components/statistics/Counter";

/**
 * Preuve sociale chiffrée.
 *
 * CONTENT_REQUIRED — le tableau `statistics` est vide : aucun des quatre
 * chiffres (clients, projets, contenus, vues) n'a été fourni ni vérifié. La
 * section ne rend donc rien du tout. Une section vide vaut mieux qu'un chiffre
 * inventé, qu'un prospect pourrait citer. Elle s'activera d'elle-même dès que
 * les valeurs réelles seront renseignées.
 */
export async function TrustSection({ locale }: { locale: Locale }) {
  if (statistics.length === 0) return null;

  const t = await getTranslator(locale, "home");

  return (
    <section className="border-b border-canvas-gray bg-canvas py-20">
      <Container>
        <Block
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statistics.map((stat) => (
            <BlockItem key={stat.label}>
              <p className="text-h1 leading-none text-deep">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-small text-anthracite/60">
                {t(stat.label)}
              </p>
            </BlockItem>
          ))}
        </Block>
      </Container>
    </section>
  );
}
