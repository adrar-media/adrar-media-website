import Image from "next/image";
import type { Locale } from "@/config/i18n";
import type { TeamMember } from "@/types";
import { ChartMotion } from "@/components/team/ChartMotion";
import { cn } from "@/lib/utils";

/**
 * L'équipe en organigramme.
 *
 * POURQUOI UN SCHÉMA ET NON UNE GRILLE
 *
 * Des portraits alignés en colonnes disent qui travaille ici, et rien
 * d'autre. Ils ne disent pas qui décide, qui produit, ni à qui l'on s'adresse
 * pour quoi — or c'est exactement la question qu'un visiteur se pose en
 * arrivant sur cette section. Le lien hiérarchique est une information ; une
 * grille la jette, un schéma la montre.
 *
 * L'ARBRE EST CONSTRUIT, PAS ÉCRIT. Il vient des `reportsTo` de
 * `data/team.ts` : aucune branche n'est codée ici. Un rattachement qui change
 * là-bas redessine le schéma ici, traits compris.
 *
 * DEUX MISES EN PAGE, ET C'EST LE MINIMUM VIABLE.
 *
 * À partir de `lg`, l'arbre est horizontal : la racine en haut, les branches
 * qui s'ouvrent vers le bas, comme se lit un organigramme. En dessous, il n'y
 * a pas la place — quatre nœuds côte à côte demandent près de 800 px, et une
 * barre de défilement horizontale sur un schéma est une façon polie de le
 * rendre illisible. Il devient donc vertical, chaque niveau décalé sous son
 * responsable et relié par un rail à la manière de la frise « Comment nous
 * travaillons ». La hiérarchie reste lisible dans les deux cas, elle change
 * seulement d'axe.
 *
 * LES TRAITS SONT EN PROPRIÉTÉS LOGIQUES (`start-*`, `insetInlineStart`) : en
 * arabe, l'arbre se retourne sans une ligne de JavaScript.
 *
 * Le mouvement est confié à `ChartMotion`, qui enveloppe ce balisage sans le
 * connaître — voir le fichier voisin.
 */

interface TeamChartProps {
  members: TeamMember[];
  locale: Locale;
  /** Intitulé accessible de l'organigramme. Déjà traduit. */
  label: string;
}

interface Node {
  member: TeamMember;
  reports: Node[];
}

/**
 * Construit l'arbre à partir des `reportsTo`.
 *
 * Les entrées dont le responsable est introuvable — identifiant mal écrit,
 * personne retirée du fichier sans mettre à jour ses rattachements — sont
 * traitées comme des racines plutôt que perdues en silence. Sur une page,
 * quelqu'un affiché au mauvais niveau se remarque et se corrige ; quelqu'un
 * qui a disparu, non.
 */
function buildTree(members: TeamMember[]): Node[] {
  const nodes = new Map<string, Node>(
    members.map((member) => [member.id, { member, reports: [] }]),
  );

  const roots: Node[] = [];
  for (const member of members) {
    const node = nodes.get(member.id)!;
    const parent = member.reportsTo ? nodes.get(member.reportsTo) : undefined;
    if (parent && parent !== node) parent.reports.push(node);
    else roots.push(node);
  }
  return roots;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

/** Une carte. Même gabarit à tous les niveaux : c'est ce qui fait un schéma. */
function Card({ member, locale }: { member: TeamMember; locale: Locale }) {
  return (
    <div
      data-chart-node
      className="flex w-full items-center gap-4 rounded-lg border border-anthracite/[0.12] bg-canvas-raised p-4 text-start lg:min-h-[15rem] lg:w-44 lg:flex-col lg:items-center lg:justify-start lg:gap-3 lg:p-5 lg:text-center"
    >
      {member.photo ? (
        <Image
          src={member.photo.src}
          alt={member.photo.alt}
          width={128}
          height={128}
          sizes="64px"
          className="h-14 w-14 shrink-0 rounded-pill object-cover lg:h-16 lg:w-16"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-canvas-gray text-body text-anthracite/70 lg:h-16 lg:w-16"
        >
          {initials(member.name)}
        </span>
      )}

      <span className="flex flex-col">
        <span className="text-small text-ink">{member.name}</span>
        {member.role[locale].map((title) => (
          <span key={title} className="mt-1 text-caption text-anthracite/70">
            {title}
          </span>
        ))}
      </span>
    </div>
  );
}

function Branch({
  node,
  locale,
  depth,
}: {
  node: Node;
  locale: Locale;
  depth: number;
}) {
  const count = node.reports.length;

  return (
    <li
      className={cn(
        "relative flex flex-col lg:items-center",
        depth > 0 && "lg:px-3",
      )}
    >
      {/*
        Le raccord horizontal qui rattache CETTE carte au rail de son niveau,
        en vertical (sous `lg`). Il part du rail posé par le parent et s'arrête
        au bord de la carte.
      */}
      {depth > 0 && (
        <span
          aria-hidden
          data-chart-line="h"
          className="absolute top-11 h-px w-6 origin-[left_center] bg-anthracite/[0.12] lg:hidden"
          style={{ insetInlineStart: "-1.5rem" }}
        />
      )}

      {/* Le trait qui descend du niveau précédent, en horizontal (`lg`). */}
      {depth > 0 && (
        <span
          aria-hidden
          data-chart-line="v"
          className="absolute top-0 hidden h-8 w-px origin-top bg-anthracite/[0.12] lg:block"
          style={{ insetInlineStart: "50%" }}
        />
      )}

      {/*
        `lg:w-auto` — SANS QUOI LA CARTE N'EST PAS CENTRÉE SUR SA BRANCHE.

        La largeur d'une branche est celle de son sous-arbre, pas celle de sa
        carte : celle du dirigeant fait 176 px et couvre les six autres. En
        `w-full`, la carte se collait au bord de cette largeur — le sommet de
        l'organigramme se retrouvait à gauche, au-dessus du vide, pendant que
        ses traits partaient du milieu. En largeur automatique, le
        `lg:items-center` de la branche la ramène sur son axe.

        HAUTEUR MINIMALE COMMUNE, et c'est ce qui fait tenir les niveaux.

        Les intitulés n'ont pas tous la même longueur — « Chief Operations &
        Production Officer / Chief Technology Officer » occupe quatre lignes là
        où « Graphisme » en occupe une. À hauteur libre, chaque branche
        démarrait son niveau suivant à une ordonnée différente et le schéma
        partait en escalier. Un plancher commun aligne les rangées sans figer
        la carte : un intitulé plus long qu'attendu l'allonge encore au lieu
        d'être coupé.
      */}
      <div className={cn("flex w-full lg:w-auto", depth > 0 && "lg:pt-8")}>
        <Card member={node.member} locale={locale} />
      </div>

      {count > 0 && (
        <>
          {/* Le trait qui descend de cette carte vers ses rattachés (`lg`). */}
          <span
            aria-hidden
            data-chart-line="v"
            className="hidden h-8 w-px origin-top bg-anthracite/[0.12] lg:block"
          />

          {/*
            PAS DE `gap` ENTRE LES BRANCHES À PARTIR DE `lg`, ET C'EST CE QUI
            REND LES TRAITS JUSTES.

            La barre horizontale est posée en pourcentages — elle doit relier le
            centre de la première branche à celui de la dernière. Ces centres ne
            tombent à `50/n %` que si les branches sont contiguës et de largeur
            égale. Un `gap` les écarte sans être compté dans le pourcentage : la
            barre finissait alors 70 px avant le dernier montant, et le schéma
            donnait à lire une branche détachée.

            L'écartement est donc obtenu par un `px-3` sur chaque branche, à
            l'intérieur de sa propre largeur. Visuellement identique à un
            `gap-6`, exact pour le calcul.

            Le `ps-6` du rail vertical, lui, ne vaut qu'en dessous de `lg` — il
            décalait sinon tout le contenu vers la droite pendant que les
            pourcentages, eux, se mesuraient depuis le bord du bloc.
          */}
          <ul className="relative mt-4 flex flex-col gap-4 ps-6 lg:mt-0 lg:flex-row lg:gap-0 lg:ps-0">
            {/*
              LE RAIL VERTICAL, sous `lg`. Il s'arrête à la hauteur du dernier
              raccord (2,75 rem, soit le centre de la pastille d'initiales :
              1 rem de marge intérieure plus la moitié des 3,5 rem de la
              pastille) au lieu de courir jusqu'en bas du groupe. Prolongé, il
              pendrait sous la dernière carte comme une branche qui ne mène
              nulle part ; arrêté plus haut, il laisserait le dernier raccord
              détaché.
            */}
            <span
              aria-hidden
              data-chart-line="v"
              className="absolute top-0 h-[calc(100%-2.75rem)] w-px origin-top bg-anthracite/[0.12] lg:hidden"
              style={{ insetInlineStart: 0 }}
            />

            {/*
              LA BARRE HORIZONTALE, à partir de `lg`. Elle relie le centre du
              premier rattaché au centre du dernier — d'où les retraits à
              `50 / n %` de chaque côté plutôt qu'une largeur fixe : avec deux
              enfants elle couvre le quart au trois-quarts, avec quatre le
              huitième aux sept-huitièmes, et elle reste juste quel que soit le
              nombre d'entrées ajoutées dans `data/team.ts`.

              Un seul rattaché n'a rien à relier : le trait vertical suffit.
            */}
            {count > 1 && (
              <span
                aria-hidden
                data-chart-line="h"
                className="absolute top-0 hidden h-px origin-[left_center] bg-anthracite/[0.12] lg:block"
                style={{
                  insetInlineStart: `${50 / count}%`,
                  insetInlineEnd: `${50 / count}%`,
                }}
              />
            )}

            {node.reports.map((child) => (
              <Branch
                key={child.member.id}
                node={child}
                locale={locale}
                depth={depth + 1}
              />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

export function TeamChart({ members, locale, label }: TeamChartProps) {
  const roots = buildTree(members);
  if (roots.length === 0) return null;

  return (
    <ChartMotion>
      <ol
        aria-label={label}
        className="flex flex-col gap-8 lg:items-center lg:gap-0"
      >
        {roots.map((root) => (
          <Branch key={root.member.id} node={root} locale={locale} depth={0} />
        ))}
      </ol>
    </ChartMotion>
  );
}
