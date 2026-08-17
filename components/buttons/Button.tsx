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

const base =
  "group inline-flex items-center justify-center gap-2 rounded text-button uppercase transition-colors duration-fast ease-brand disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-atlas text-white hover:bg-atlas-dark",
  secondary:
    "border border-anthracite/20 text-anthracite hover:border-anthracite hover:bg-anthracite hover:text-white",
  invert: "bg-white text-deep hover:bg-beige",
  link: "px-0 text-atlas hover:text-atlas-dark",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3",
  lg: "px-7 py-4",
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
        <span
          aria-hidden
          className="transition-transform duration-fast ease-brand group-hover:translate-x-1"
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
