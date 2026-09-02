import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { verifiedResults } from "@/data/statistics";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Block } from "@/components/ui/Block";
import { Button } from "@/components/buttons/Button";
import { AmbientShapes } from "@/components/hero/AmbientShapes";
import { MountainRange } from "@/components/hero/MountainRange";
import { SectionImage } from "@/components/media/SectionImage";
import { homeImagery } from "@/data/imagery";

/**
 * Hero.
 *
 * DEUX COLONNES : le discours à gauche, le territoire à droite.
 *
 * L'image tenait auparavant une bande pleine largeur SOUS les appels à
 * l'action. Elle y était hors du premier écran sur presque tous les portables
 * — donc invisible au moment où elle avait quelque chose à dire — et elle
 * poussait le reste de la page d'une hauteur d'écran entière. Remontée à
 * hauteur du titre, elle est lue EN MÊME TEMPS que lui : « From Local to
 * Global » et les contreforts de l'Atlas forment une seule affirmation, ce que
 * la lecture en séquence ne pouvait pas produire.
 *
 * La colonne de texte garde son ordre — surtitre, titre, accroche, actions,
 * chiffre vérifié — et le titre y perd son décrochage de 14 % : le décrochage
 * servait à ouvrir un vide dans une ligne pleine largeur, et sur sept colonnes
 * il ne ferait plus que rogner la place du mot le plus long.
 *
 * LE TEXTE NE DÉPEND TOUJOURS D'AUCUN FICHIER LOURD. La composition est peinte
 * par le navigateur — massif, formes d'ambiance, halo — et la colonne de
 * gauche s'affiche entièrement avant que l'image n'ait commencé à arriver.
 * Celle-ci porte en revanche `priority` désormais qu'elle est dans le premier
 * écran : une image au-dessus de la ligne de flottaison chargée paresseusement
 * arrive après le premier rendu, et le cadre reste vide sous les yeux du
 * visiteur.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "home");
  const c = await getTranslator(locale, "common");

  const lines = t.list("hero.titleLines");
  // Seule métrique vérifiée et sourcée : rien d'autre ne flotte sur le Hero.
  const badge = verifiedResults[0];

  return (
    <section className="relative overflow-hidden pb-14 pt-32 md:pb-16 md:pt-36">
      {/*
        Trois plans de décor, du plus lointain au plus proche. Le dégradé
        conique et la grille de repères existaient dans la feuille de style
        sans être posés nulle part : le premier écran n'avait donc que ses
        formes blanches sur un aplat. Le dégradé tourne en 24 s — assez lent
        pour qu'on ne surprenne jamais le mouvement en le regardant — et la
        grille reste immobile, elle ne fait que donner une texture.

        L'opacité du dégradé est ramenée à 0,28. À pleine valeur, un flou de
        80 px étalé sur 140 % de la section repeint tout le premier écran en
        vert : le fond crème de la marque disparaît, et les formes blanches
        n'ont plus de quoi se détacher. Ce qu'on cherche ici est une teinte
        d'ambiance qu'on remarque à peine, pas une surface colorée.
      */}
      <div
        aria-hidden
        className="hero-mesh animate-gradient-drift opacity-[0.28]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-field"
      />

      {/* Le massif occupe le sol, les formes flottent au-dessus. */}
      <MountainRange />
      <AmbientShapes />

      <Container className="relative">
        <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-grid">
          {/* ---------------------------------------------------------------
              COLONNE DE GAUCHE — tout le discours du premier écran.
              --------------------------------------------------------------- */}
          <div className="md:col-span-7">
            <Block immediate>
              <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            </Block>

            {/*
              LA SÉQUENCE DU PREMIER ÉCRAN.

              Tout part à la levée du voile, jamais avant : `immediate` attend
              le signal de l'écran de chargement. Les retards ci-dessous se
              lisent donc à partir de ce moment-là, et non du chargement de la
              page.

              L'ordre est celui du regard — surtitre, titre, accroche, actions,
              chiffre — et les écarts se resserrent à mesure qu'on descend :
              100 ms entre les deux moitiés du titre, puis les blocs suivants
              se rattrapent presque. Une cascade à pas constant se lit comme
              une liste ; une cascade qui accélère se lit comme une composition
              qui se referme.

              Les lettres montent en pivotant sous un masque de ligne (voir
              `SplitHeadline`). En arabe, la découpe se fait par mots —
              l'écriture est liée, la découper par lettres la casserait.
            */}
            <div className="mt-8 md:mt-10">
              <Headline
                as="h1"
                lines={lines}
                className="text-display text-ink"
                immediate
                delay={0.1}
              />
            </div>

            <Block immediate delay={420} className="mt-9">
              <p className="max-w-prose text-body-lg text-anthracite/80">
                {t("hero.description")}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={href(locale, "demander-un-devis")} size="lg" arrow>
                  {c("cta.talk")}
                </Button>
                <Button
                  href={href(locale, "realisations")}
                  variant="secondary"
                  size="lg"
                >
                  {c("cta.work")}
                </Button>
              </div>
            </Block>

            {badge && (
              <Block immediate delay={540} className="mt-10">
                {/*
                  Le halo est posé en frère de la pastille, pas en fond : il
                  doit déborder largement sans agrandir la boîte ni pousser la
                  grille. Portée réduite à 7vw — 12vw convient à une forme
                  d'ambiance perdue dans le décor, pas à un chiffre qu'on vient
                  lire.
                */}
                <div className="relative inline-flex">
                  <span aria-hidden className="halo animate-glow-pulse halo-sm" />
                  <span className="relative flex flex-col gap-1 rounded-lg bg-light px-7 py-6">
                    {/*
                      « 516K+ » se lisait « +516K » en arabe : le signe, neutre
                      pour l'algorithme bidirectionnel, bascule du côté du
                      contexte. `<bdi>` le rattache au nombre qu'il qualifie.
                    */}
                    <bdi className="text-h3 leading-none text-surface">
                      {badge.value}
                      {badge.suffix}
                    </bdi>
                    <span className="text-small text-surface">
                      {t(badge.label)}
                    </span>
                  </span>
                </div>
              </Block>
            )}
          </div>

          {/* ---------------------------------------------------------------
              COLONNE DE DROITE — le territoire, à hauteur du titre.

              `parallax={false}` : la dérive au défilement suppose que le cadre
              traverse l'écran, ce qu'un cadre déjà en place au chargement ne
              fait pas. Elle décalerait l'image dès le premier pixel de
              défilement, sans que rien ne l'ait déclenchée.
              --------------------------------------------------------------- */}
          <SectionImage
            slot={homeImagery.hero}
            alt={c("imagery.home-hero")}
            pendingLabel={c("imagery.pending")}
            priority
            parallax={false}
            className="md:col-span-5"
          />
        </div>

      </Container>
    </section>
  );
}
