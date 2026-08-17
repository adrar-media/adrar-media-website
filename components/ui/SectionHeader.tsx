import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  /** Une entrée par ligne — la coupe des titres est un choix de composition. */
  titleLines: string[];
  intro?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "split";
  action?: React.ReactNode;
  tone?: "dark" | "light";
}

/**
 * En-tête de section. `split` place le titre à gauche et l'accroche à droite :
 * c'est le rythme asymétrique qui évite l'effet « tout centré ».
 */
export function SectionHeader({
  eyebrow,
  titleLines,
  intro,
  className,
  as = "h2",
  align = "left",
  action,
  tone = "dark",
}: SectionHeaderProps) {
  const titleSize = as === "h1" ? "text-h1" : "text-h2";

  return (
    <div
      className={cn(
        align === "split" &&
          "grid gap-8 md:grid-cols-12 md:items-end md:gap-gutter",
        className,
      )}
    >
      <div className={cn(align === "split" && "md:col-span-7")}>
        {eyebrow && (
          <Eyebrow
            className={cn(
              "mb-6",
              tone === "dark" ? "text-atlas" : "text-light",
            )}
          >
            {eyebrow}
          </Eyebrow>
        )}
        <TextReveal
          as={as}
          lines={titleLines}
          className={cn(
            titleSize,
            "uppercase",
            tone === "dark" ? "text-deep" : "text-white",
          )}
        />
      </div>

      {(intro || action) && (
        <div
          className={cn(
            align === "split" ? "md:col-span-4 md:col-start-9" : "mt-8",
          )}
        >
          {intro && (
            <p
              className={cn(
                "max-w-prose text-body-lg",
                tone === "dark" ? "text-anthracite/75" : "text-white/70",
              )}
            >
              {intro}
            </p>
          )}
          {action && <div className="mt-6">{action}</div>}
        </div>
      )}
    </div>
  );
}
