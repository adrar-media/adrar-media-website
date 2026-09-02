"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";
import { href } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/buttons/Button";
import fr from "@/locales/fr/errors.json";
import en from "@/locales/en/errors.json";
import ar from "@/locales/ar/errors.json";

/**
 * ÉCRAN DE PANNE
 *
 * Une frontière d'erreur est nécessairement un composant client : elle doit
 * pouvoir relancer le rendu (`reset`) depuis le navigateur. Elle ne peut donc
 * pas appeler `getTranslator`, qui est asynchrone et serveur — les trois
 * dictionnaires d'erreur, une dizaine de lignes chacun, sont importés
 * directement et la langue se lit dans l'URL.
 *
 * Aucune chaîne n'est écrite dans ce fichier : les traductions restent dans
 * `locales/`, comme partout ailleurs.
 */
const dictionaries: Record<Locale, typeof fr> = { fr, en, ar };

export function ErrorView({
  reset,
  digest,
}: {
  /** Relance le rendu de la section en échec, sans recharger la page. */
  reset?: () => void;
  /** Identifiant d'incident produit par Next, utile au support. */
  digest?: string;
}) {
  // `usePathname` peut renvoyer `null` au premier rendu d'une frontière.
  const pathname = usePathname() as string | null;
  const first = (pathname ?? "").split("/").filter(Boolean)[0];
  const locale = first && isLocale(first) ? first : defaultLocale;
  const copy = dictionaries[locale].error;

  return (
    <section className="pb-section pt-40 md:pt-48">
      <Container>
        <Eyebrow>{copy.eyebrow}</Eyebrow>

        <h1 className="mt-8 max-w-[16ch] text-h1 text-ink">{copy.title}</h1>

        <p className="mt-8 max-w-prose text-body-lg text-anthracite/75">
          {copy.body}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          {reset && (
            <Button size="lg" onClick={reset} arrow>
              {copy.retry}
            </Button>
          )}
          <Button href={href(locale)} variant="secondary" size="lg">
            {copy.home}
          </Button>
        </div>

        {digest && (
          <p className="mt-8 text-caption text-anthracite/70">
            {copy.reference} : {digest}
          </p>
        )}
      </Container>
    </section>
  );
}
