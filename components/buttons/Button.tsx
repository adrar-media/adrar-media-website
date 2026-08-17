import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "invert" | "link";
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
 */
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-pill text-button transition-all duration-base ease-brand disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-atlas text-white hover:bg-atlas-dark hover:shadow-lifted",
  secondary:
    "border border-anthracite/15 bg-canvas-raised text-anthracite hover:border-anthracite/30 hover:shadow-pill",
  invert: "bg-light text-deep hover:bg-white",
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
        <span
          aria-hidden
          className="transition-transform duration-base ease-brand group-hover:translate-x-1 rtl:-scale-x-100"
        >
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
