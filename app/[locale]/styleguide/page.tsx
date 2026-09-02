import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Marquee } from "@/components/ui/Marquee";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/buttons/Button";
import { Block, BlockItem } from "@/components/ui/Block";

/**
 * Page de validation interne du design system.
 *
 * Ni indexée, ni liée depuis la navigation, ni présente au sitemap — et
 * désormais fermée par défaut : elle ne répond que si
 * NEXT_PUBLIC_STYLEGUIDE vaut « 1 ». Laisser une page de contrôle interne
 * publiquement accessible en production expose l'inventaire complet du
 * système à qui devine l'URL, pour un usage qui n'est pas celui des visiteurs.
 *
 * Elle reste ouverte en développement, où elle sert à chaque revue visuelle.
 */
const isVisible =
  process.env.NEXT_PUBLIC_STYLEGUIDE === "1" ||
  process.env.NODE_ENV !== "production";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "Atlas Green", hex: "#1F7A63", className: "bg-atlas" },
  { name: "Deep Digital Blue", hex: "#0A2540", className: "bg-surface" },
  { name: "Earth Beige", hex: "#D6C2A1", className: "bg-beige" },
  { name: "Anthracite", hex: "#2B2B2B", className: "bg-anthracite" },
  { name: "Light Green", hex: "#3ED598", className: "bg-light" },
  { name: "Off White", hex: "#FAF8F4", className: "bg-canvas-off" },
  { name: "Light Gray", hex: "#EFEDE8", className: "bg-canvas-gray" },
];

const typeScale = [
  { token: "display", label: "Display", className: "text-display" },
  { token: "h1", label: "Heading 1", className: "text-h1" },
  { token: "h2", label: "Heading 2", className: "text-h2" },
  { token: "h3", label: "Heading 3", className: "text-h3" },
  { token: "body-lg", label: "Body large", className: "text-body-lg" },
  { token: "body", label: "Body", className: "text-body" },
  { token: "small", label: "Small", className: "text-small" },
  { token: "caption", label: "Caption", className: "text-caption uppercase" },
];

function Spec({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-canvas-gray py-16">
      <Eyebrow className="mb-10 text-atlas">{title}</Eyebrow>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  if (!isVisible) notFound();

  return (
    /* Le layout fournit déjà le repère principal : un second <main> imbriqué
       en produirait deux dans le document. */
    <div className="py-section">
      <Container>
        <SectionHeader
          as="h1"
          eyebrow="Adrar Media — Design System"
          titleLines={["Fondations", "visuelles."]}
          intro="Tokens, primitives et règles de mouvement. Toute page du site est construite à partir de ces éléments — aucun style arbitraire au cas par cas."
          align="split"
          className="mb-14"
        />

        <Spec title="01 — Palette">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {palette.map((color) => (
              <div key={color.hex}>
                <div
                  className={`${color.className} h-24 w-full rounded border border-canvas-gray`}
                />
                <p className="mt-3 text-small font-medium">{color.name}</p>
                <p className="text-small text-anthracite/70">{color.hex}</p>
              </div>
            ))}
          </div>
        </Spec>

        <Spec title="02 — Typographie">
          <div className="space-y-8">
            {typeScale.map((item) => (
              <div
                key={item.token}
                className="grid gap-2 md:grid-cols-12 md:items-baseline"
              >
                <p className="text-small text-anthracite/70 md:col-span-2">
                  {item.token}
                </p>
                <p className={`${item.className} md:col-span-10`}>
                  {item.label} — From Local to Global.
                </p>
              </div>
            ))}
          </div>
        </Spec>

        <Spec title="03 — Boutons">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/demander-un-devis" arrow>
              Demander un devis
            </Button>
            <Button href="/realisations" variant="secondary">
              Voir nos réalisations
            </Button>
            <Button variant="link" href="/methode" arrow>
              Découvrir notre approche
            </Button>
            <Button variant="primary" size="lg" arrow>
              Grand format
            </Button>
            <Button disabled>Désactivé</Button>
          </div>
          <div className="mt-8 bg-surface p-8">
            <Button variant="invert" arrow>
              Sur fond sombre
            </Button>
          </div>
        </Spec>

        <Spec title="04 — Tags & badges">
          <div className="flex flex-wrap items-center gap-3">
            <Tag>Social Media</Tag>
            <Tag>Branding</Tag>
            <Tag>Vidéo</Tag>
            <Badge>01</Badge>
            <Badge tone="light">Résultat</Badge>
            <Badge tone="deep">Étude de cas</Badge>
          </div>
        </Spec>

        <Spec title="05 — Bande éditoriale">
          <Marquee
            items={["Strategy", "Creative", "Content", "Performance", "Growth"]}
            className="bg-canvas-off"
          />
        </Spec>

        <Spec title="06 — Mouvement (survol, halo, bande)">
          <Block className="grid gap-4 sm:grid-cols-3">
            {["Survol 350ms", "Halo 4s", "Bande 30s"].map((label) => (
              <BlockItem
                key={label}
                className="border border-canvas-gray p-8 text-h3"
              >
                {label}
              </BlockItem>
            ))}
          </Block>
          <p className="mt-6 max-w-prose text-small text-anthracite/70">
            Une seule courbe d&apos;accélération sur tout le site. Chaque
            apparition ne joue qu&apos;une fois. Sous prefers-reduced-motion,
            tout est neutralisé et le contenu reste intégralement lisible.
          </p>
        </Spec>
      </Container>
    </div>
  );
}
