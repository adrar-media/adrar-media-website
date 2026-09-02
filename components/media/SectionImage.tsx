import Image from "next/image";
import { imageSrc, BLUR_DATA_URL } from "@/lib/media";
import type { ImageSlot } from "@/data/imagery";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface SectionImageProps {
  slot: ImageSlot;
  /** Texte alternatif déjà traduit. Jamais une clé. */
  alt: string;
  /** Étiquette affichée tant que le fichier n'a pas été produit. */
  pendingLabel: string;
  /**
   * Charge l'image sans attendre le défilement. Réservé au premier écran :
   * au-delà, c'est du poids téléchargé avant d'être utile.
   */
  priority?: boolean;
  /** Fond du cadre en attente, selon la section qui l'accueille. */
  tone?: "light" | "dark";
  /** Dérive lente au défilement. Coupée sur les cadres du premier écran. */
  parallax?: boolean;
  className?: string;
}

/**
 * Cadre image d'une section.
 *
 * Un seul composant pour tout le site : les proportions, l'attribut `sizes` et
 * le brief viennent du manifeste (`data/imagery.ts`), pas du point d'appel. Une
 * section ne décide donc jamais du poids qu'elle fait télécharger — et `sizes`
 * y est mesuré emplacement par emplacement, non déduit d'un gabarit commun.
 *
 * TROIS MOUVEMENTS, TOUS COMPOSÉS PAR LE GPU :
 *
 * 1. Le cadre monte et se révèle à l'entrée dans l'écran — c'est le `Reveal`
 *    déjà utilisé partout ailleurs, donc le même rythme que le texte voisin.
 * 2. L'image se pose : elle entre à 1,06 et rejoint son échelle normale en
 *    1,2 s. Le décalage avec la révélation du cadre (700 ms) est délibéré —
 *    deux durées identiques donneraient un seul mouvement, deux durées
 *    distinctes donnent une profondeur.
 * 3. Elle dérive de ±44 px pendant la traversée de l'écran (`.parallax`,
 *    piloté par le défilement et non par le temps). Le cadre reste immobile :
 *    seule l'image bouge derrière lui.
 *
 * Le débord vertical de la piste (`-inset-y-12`, soit 48 px) est ce qui rend
 * la dérive possible sans découvrir le fond en haut ou en bas du cadre. Il
 * doit rester STRICTEMENT SUPÉRIEUR à l'amplitude : à égalité, l'arête de
 * l'image affleure le bord du cadre en fin de course, et une ligne de fond
 * d'un pixel apparaît sur certains facteurs de zoom.
 *
 * `prefers-reduced-motion` neutralise les trois (cf. globals.css) : l'image
 * s'affiche alors nette, immobile et à l'échelle, sans rien à attendre.
 */
export function SectionImage({
  slot,
  alt,
  pendingLabel,
  priority = false,
  tone = "light",
  parallax = true,
  className,
}: SectionImageProps) {
  const src = imageSrc(slot.id);

  /*
    * PLAFOND DE HAUTEUR — la règle qui tient le rythme de toutes les pages.
    *
    * Les proportions du manifeste décrivent le CADRAGE de l'image, pas la
    * place qu'elle prend dans la page. Les deux se confondent tant que le
    * cadre est étroit, et se séparent brutalement dès qu'il est pleine
    * largeur : un 16/9 posé sur une colonne de 1050 px fait 590 px de haut,
    * soit les trois quarts d'un écran d'ordinateur portable pour une seule
    * image. Trois sections construites comme ça, et la page fait quatorze
    * écrans sans que personne n'ait décidé qu'elle serait longue.
    *
    * `max-height` tranche : au-delà de 64 % de la hauteur visible, le cadre
    * cesse de grandir et l'image se recadre dedans (`object-cover`). Le
    * cadrage se resserre, la composition ne bouge pas, et aucune image ne
    * peut plus imposer seule la longueur de sa section.
    *
    * Le plafond est en `vh` et non en pixels : sur un écran haut il laisse
    * respirer, sur un portable il serre. C'est la même intention à toutes les
    * tailles — une image, jamais un écran entier.
    */
  const frame = cn(
    "relative max-h-[64vh] overflow-hidden rounded-lg",
    tone === "dark" ? "bg-surface-soft" : "bg-canvas-gray",
    className,
  );

  /*
   * IMAGE_PENDING — le visuel n'a pas encore été produit. Plutôt qu'un cadre
   * vide, qui se lirait comme une image cassée, le cadre garde ses proportions
   * et affiche l'écho de la ligne d'horizon du logo. La page conserve son
   * rythme, et l'absence reste lisible comme une décision.
   */
  if (!src) {
    return (
      <Reveal variant="media" className={frame} style={{ aspectRatio: slot.ratio }}>
        <svg
          aria-hidden
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-1/2 w-full"
        >
          <path
            d="M0 150 C 110 128, 290 128, 400 150"
            fill="none"
            stroke="#1F7A63"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </svg>
        <span
          className={cn(
            "absolute bottom-4 start-4 text-caption",
            tone === "dark" ? "text-white/70" : "text-anthracite/70",
          )}
        >
          {pendingLabel}
        </span>
      </Reveal>
    );
  }

  return (
    <Reveal variant="media" className={frame} style={{ aspectRatio: slot.ratio }}>
      {/*
        Piste de dérive : plus haute que le cadre des 44 px que la parallaxe
        parcourt dans chaque sens, plus une marge. Sans ce débord, la dérive
        découvrirait le fond sur une arête ou sur l'autre.
      */}
      <div className={cn("absolute inset-x-0 -inset-y-12", parallax && "parallax")}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={slot.sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="media-settle object-cover"
        />
      </div>
    </Reveal>
  );
}
