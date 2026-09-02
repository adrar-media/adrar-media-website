import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "invert" | "outline" | "link";
type Size = "md" | "lg";

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Flèche de continuité — signal de lecture, pas décoration. */
  arrow?: boolean;
}

type ButtonProps = BaseProps &
  (
    | ({ href: string; external?: boolean } & Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        "href" | "className" | "children"
      >)
    | ({ href?: undefined } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        "className" | "children"
      >)
  );

/**
 * Bouton en pastille pleine.
 *
 * La forme est le marqueur : arrondi complet, casse normale, transition unique
 * à 350 ms. Aucun bouton du site n'a d'angle vif.
 *
 * Le survol seul ne dit pas qu'un clic a été pris en compte : `active` ajoute
 * un léger enfoncement, qui donne au bouton la réponse tactile qui lui
 * manquait. L'écart est volontairement faible (3 %) — au-delà, le bouton
 * paraît sauter au lieu de répondre.
 *
 * L'enfoncement est plus rapide que le reste (`duration-fast`) : un retour au
 * doigt doit être immédiat, alors qu'un changement de couleur peut fondre.
 *
 * `transition` plutôt que `transition-all` : la liste couvre déjà couleur,
 * fond, bordure, ombre et transformation, sans mettre le navigateur en
 * surveillance de toutes les propriétés, y compris celles de mise en page.
 */
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-pill text-button transition duration-base ease-brand active:duration-fast active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

/**
 * Une variante par fond, jamais de retouche au cas par cas.
 *
 * `cn` est une simple concaténation, sans résolution de conflit : une classe
 * passée en `className` ne remplace pas celle de la variante, elle s'y ajoute.
 * Deux couleurs de fond se retrouvaient donc sur le même bouton et c'est
 * l'ordre de la feuille compilée — non celui des classes — qui tranchait.
 *
 * C'est ce qui cassait le bouton secondaire de la section de conversion :
 * posé sur Deep Blue, il gardait le `bg-canvas-raised` blanc de la variante
 * claire sous un `text-white`, soit du blanc sur blanc. D'où `outline`, une
 * variante complète pour fond sombre.
 */
const variants: Record<Variant, string> = {
  /** Fond clair, action principale. */
  primary: "bg-atlas text-canvas hover:bg-atlas-dark hover:shadow-lifted",
  /** Fond clair, action secondaire. */
  secondary:
    "border border-anthracite/15 bg-canvas-raised text-anthracite hover:border-anthracite/30 hover:shadow-pill",
  /** Fond sombre, action principale. */
  invert: "bg-light text-surface hover:bg-white hover:text-surface",
  /** Fond sombre, action secondaire : contour clair qui se remplit au survol. */
  outline:
    "border border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-surface",
  link: "px-0 text-atlas hover:text-atlas-dark",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3.5",
  lg: "px-8 py-4",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variants[variant],
    variant !== "link" && sizes[size],
    className,
  );

  const content = (
    <>
      {children}
      {arrow && (
        // La flèche suit le sens de lecture : retournée en RTL, elle pointe
        // vers la gauche et son mouvement au survol s'inverse avec elle.
        // `arrow-nudge` (globals.css) porte les deux cas.
        <span aria-hidden className="arrow-nudge">
          →
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, ...linkProps } = props;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
