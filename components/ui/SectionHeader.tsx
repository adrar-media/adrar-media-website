import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
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
          "grid gap-8 md:grid-cols-12 md:items-end md:gap-grid",
        className,
      )}
    >
      {/*
        LE TITRE N'EST PLUS ENVELOPPÉ DANS UNE RÉVÉLATION.

        Il l'était, et les deux mouvements se marchaient dessus : le conteneur
        montait le bloc entier en le faisant apparaître, pendant que les
        lettres, à l'intérieur, jouaient leur propre découpe. Deux courbes, deux
        durées, sur les mêmes pixels — la découpe se lisait à travers un fondu
        qui n'avait pas fini, et l'onde des caractères disparaissait dans le
        déplacement du parent.

        Le surtitre garde sa révélation : c'est un bloc, il se pose. Le titre
        porte la sienne (`Headline` → `SplitHeadline`), il se découpe. Chacun
        n'a plus qu'une seule animation, et elles partent au même moment
        puisqu'elles répondent au même seuil de défilement.
      */}
      <div className={cn(align === "split" && "md:col-span-7")}>
        {eyebrow && (
          <Reveal>
            <Eyebrow className="mb-8" tone={tone === "dark" ? "dark" : "light"}>
              {eyebrow}
            </Eyebrow>
          </Reveal>
        )}
        <Headline
          as={as}
          lines={titleLines}
          className={cn(
            titleSize,
            tone === "dark" ? "text-ink" : "text-white",
          )}
        />
      </div>

      {(intro || action) && (
        <Reveal
          delay={120}
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
        </Reveal>
      )}
    </div>
  );
}
