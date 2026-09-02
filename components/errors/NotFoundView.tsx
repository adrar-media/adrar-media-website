import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/buttons/Button";

/**
 * PAGE 404 LOCALISÉE
 *
 * Composant serveur, et pas par confort : une frontière `not-found` placée
 * sous un segment dynamique ne monte aucun composant client — le rendu échoue
 * en silence et Next lui substitue son écran technique. C'est ce qui se
 * produisait avec une première version fondée sur `usePathname`.
 *
 * La langue arrive donc par la seule voie disponible ici : l'en-tête posé par
 * le middleware, qui a déjà résolu la langue pour cette requête.
 *
 * Le visiteur repart avec trois sorties plutôt qu'une : l'accueil, le travail
 * publié, et le devis. Une impasse sur un site commercial coûte un prospect.
 */
export async function NotFoundView({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "errors");

  return (
    <section className="pb-section pt-40 md:pt-48">
      <Container>
        <Eyebrow>{t("notFound.eyebrow")}</Eyebrow>

        <p
          aria-hidden
          className="mt-8 text-display leading-none text-canvas-gray"
        >
          {t("notFound.code")}
        </p>

        <h1 className="mt-8 max-w-[16ch] text-h1 text-ink">
          {t("notFound.title")}
        </h1>

        <p className="mt-8 max-w-prose text-body-lg text-anthracite/75">
          {t("notFound.body")}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button href={href(locale)} size="lg" arrow>
            {t("notFound.home")}
          </Button>
          <Button
            href={href(locale, "realisations")}
            variant="secondary"
            size="lg"
          >
            {t("notFound.work")}
          </Button>
          <Button href={href(locale, "demander-un-devis")} variant="link">
            {t("notFound.quote")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
