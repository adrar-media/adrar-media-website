import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Block } from "@/components/ui/Block";

interface PageHeaderProps {
  eyebrow: string;
  titleLines: string[];
  intro?: string;
  children?: React.ReactNode;
  /**
   * Décor posé derrière le titre, sur toute la hauteur de l'en-tête.
   *
   * Il est reçu en propriété plutôt que codé ici : une seule page en porte un,
   * et un en-tête partagé par onze pages n'a pas à connaître le dessin de
   * l'une d'elles. Absent, rien ne change — pas de conteneur en trop, pas de
   * `overflow` imposé aux dix autres.
   */
  backdrop?: React.ReactNode;
}

/**
 * En-tête de page intérieure.
 *
 * Toutes les pages du site partagent la même ouverture : étiquette, titre
 * découpé en lignes maîtrisées, accroche décalée. Le motif était recopié
 * d'une page à l'autre ; il est réuni ici pour que le rythme d'entrée reste
 * identique partout.
 *
 * Le contenu du premier écran n'est pas révélé au défilement (`still`) : rien
 * n'a encore été fait défiler à l'arrivée, il n'y a donc rien à annoncer.
 */
export function PageHeader({
  eyebrow,
  titleLines,
  intro,
  children,
  backdrop,
}: PageHeaderProps) {
  return (
    <section
      className={
        backdrop
          ? "relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-48"
          : "pb-16 pt-40 md:pb-24 md:pt-48"
      }
    >
      {/*
        Le décor est SOUS le contenu et ne reçoit aucun clic : il n'est pas
        dans le flux, il ne porte pas de texte, et il doit laisser passer le
        curseur vers ce qui est derrière lui. `overflow-hidden` sur la section
        l'empêche de déborder sur la page quand il dérive.
      */}
      {backdrop && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {backdrop}
        </div>
      )}

      <Container className={backdrop ? "relative" : undefined}>
        <Block still>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Block>

        <div className="mt-10 md:mt-12">
          <Headline
            as="h1"
            lines={titleLines}
            className="text-h1 text-ink"
          />
        </div>

        {intro && (
          <Block still>
            <p className="mt-10 max-w-prose text-body-lg text-anthracite/75 md:ms-[14%]">
              {intro}
            </p>
          </Block>
        )}

        {children && <Block still>{children}</Block>}
      </Container>
    </section>
  );
}
