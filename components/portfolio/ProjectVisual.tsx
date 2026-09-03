import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectVisualProps {
  client: string;
  /** Étiquette affichée tant qu'aucun visuel validé n'est disponible. */
  pendingLabel: string;
  ratio: string;
  /** Logo client réel, fourni par la direction. Absent tant que non confirmé. */
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
}

/**
 * Cadre visuel d'un projet.
 *
 * DEUX ÉTATS.
 *
 * — Logo fourni : présenté sur une tablette (`surface-soft` sur `surface`,
 *   rayon `md`), pas en médaillon plaqué au centre. Les logos réels ont leur
 *   propre fond (souvent sombre, parfois blanc) : les poser à fond perdu sur
 *   le cadre les aurait fait flotter sans bord ; les recadrer en cercle
 *   aurait coupé les lockups qui incluent un nom de marque (The Big Family).
 *   La tablette leur donne un bord propre quel que soit leur fond, avec une
 *   marge intérieure généreuse — jamais collés à leur propre cadre — et un
 *   rayon `default` légèrement plus serré que celui de la tablette : deux
 *   rayons concentriques, pas un seul répété, comme le cadre général
 *   (`lg`) l'est déjà par rapport à la page.
 * — Logo absent (IMAGE_REQUIRED) : aucun visuel n'est disponible ni autorisé
 *   à ce jour. Plutôt qu'une image d'illustration achetée ou inventée, le
 *   cadre affiche une composition typographique construite à partir du nom
 *   du client. Le résultat est assumé et cohérent avec la direction
 *   éditoriale : il ne ressemble pas à une image manquante.
 *
 * Le remplacement du second état par un vrai logo, une fois fourni, ne
 * touche que ce composant.
 *
 * Le cadre répond au survol du lien qui l'enveloppe (`group`, défini dans
 * SelectedWork) : jusqu'ici seule la flèche bougeait, et une vignette de
 * portfolio de cette taille qui reste inerte sous le curseur ne se lit pas
 * comme cliquable. Le mouvement reste retenu — le cadre se soulève, la
 * tablette respire et son bord vire au vert de marque, la ligne d'horizon
 * monte — et ne joue que sur `transform`, `box-shadow` et des couleurs, donc
 * sans recalcul de mise en page. Une durée lente (500 ms) le distingue des
 * micro-interactions à 250 ms : c'est une masse qui se déplace, pas un
 * bouton qui répond.
 */
export function ProjectVisual({
  client,
  pendingLabel,
  ratio,
  logoSrc,
  logoAlt,
  className,
}: ProjectVisualProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface",
        "transition-transform duration-slow ease-brand group-hover:-translate-y-1.5",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-[8%]">
        {logoSrc ? (
          <span
            className={cn(
              "relative flex aspect-square w-[46%] min-w-28 max-w-64 items-center justify-center p-4",
              "rounded-md bg-surface-soft ring-1 ring-white/10",
              "shadow-lifted transition-[transform,box-shadow] duration-slow ease-brand",
              "group-hover:scale-[1.04] group-hover:shadow-glow group-hover:ring-atlas/40",
            )}
          >
            <span className="relative h-full w-full overflow-hidden rounded">
              <Image
                src={logoSrc}
                alt={logoAlt ?? client}
                fill
                sizes="(min-width: 1024px) 260px, 40vw"
                className="object-cover"
              />
            </span>
          </span>
        ) : (
          <span
            aria-hidden
            className="select-none px-6 text-center text-h1 leading-none text-white/70 transition-[transform,color] duration-slow ease-brand group-hover:scale-[1.04] group-hover:text-white/85"
          >
            {client}
          </span>
        )}
      </div>

      {/*
        Lueur verte qui monte du pied du cadre au survol. Un dégradé dont on
        ne fait varier que l'opacité : la couche est peinte une fois, puis
        composée par le GPU.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-atlas/25 to-transparent opacity-0 transition-opacity duration-slow ease-brand group-hover:opacity-100"
      />

      <span className="absolute bottom-4 start-4 z-10 text-caption text-white/70 transition-colors duration-slow ease-brand group-hover:text-white">
        {pendingLabel}
      </span>

      {/* Écho de la ligne d'horizon du logo, en filigrane. */}
      <svg
        aria-hidden
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-1/3 w-full transition-transform duration-slow ease-brand group-hover:-translate-y-1.5"
      >
        <path
          d="M0 150 C 110 128, 290 128, 400 150"
          fill="none"
          stroke="#3ED598"
          strokeWidth="1"
          strokeOpacity="0.35"
          className="transition-[stroke-opacity] duration-slow ease-brand group-hover:[stroke-opacity:0.8]"
        />
      </svg>
    </div>
  );
}
