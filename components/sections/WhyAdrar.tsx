import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  PrincipleTimeline,
  type TimelineItem,
} from "@/components/sections/PrincipleTimeline";

/**
 * Les six principes, dans leur ordre.
 *
 * L'ordre N'EST PAS décoratif depuis qu'ils sont en frise : il se lit comme un
 * enchaînement. Comprendre le business, puis créer, puis mesurer, puis ancrer
 * dans le marché, puis réunir les métiers, puis faire croître. Déplacer une
 * entrée change ce que la section affirme.
 */
const principles = [
  "strategy",
  "creative",
  "data",
  "local",
  "partner",
  "growth",
] as const;

/**
 * Pourquoi Adrar — six principes en frise verticale.
 *
 * L'IMAGE A ÉTÉ RETIRÉE, et sa place avec elle. Elle occupait les quatre
 * dernières colonnes de l'en-tête, où elle ne faisait que boucher un vide : un
 * portrait générique posé à côté d'un titre, sans rapport avec aucun des six
 * principes qu'il surplombait. Le vide qu'elle comblait était réel, mais la
 * réponse était mauvaise — en composition « split » sans accroche, c'est
 * l'en-tête qui devait redevenir simple, pas le vide qui devait être rempli.
 *
 * La frise, elle, occupe toute la largeur et n'a plus besoin de rien à côté :
 * la lecture descend le long du rail au lieu de balayer trois colonnes.
 */
export async function WhyAdrar({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");

  const items: TimelineItem[] = principles.map((key) => ({
    key,
    title: t(`why.items.${key}.title`),
    body: t(`why.items.${key}.body`),
  }));

  return (
    <section className="border-b border-canvas-gray bg-canvas py-section">
      <Container>
        <SectionHeader
          eyebrow={t("why.eyebrow")}
          titleLines={t.list("why.titleLines")}
          className="mb-16"
        />

        {/*
          La frise tient sept colonnes sur douze plutôt que la pleine largeur.
          Une ligne de texte courant posée sur 1120 px passe les 110 caractères,
          bien au-delà de ce qu'un œil relit sans se perdre — et un rail vertical
          n'aide plus quand ce qu'il aligne est trois fois plus large que haut.
        */}
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-8 lg:col-span-7">
            <PrincipleTimeline items={items} />
          </div>
        </div>
      </Container>
    </section>
  );
}
