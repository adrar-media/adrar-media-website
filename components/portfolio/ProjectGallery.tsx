import Image from "next/image";
import type { MediaAsset } from "@/types";
import { Reveal } from "@/components/motion/Reveal";

interface ProjectGalleryProps {
  items: MediaAsset[];
  label: string;
}

/**
 * Galerie de visuels réels d'un projet.
 *
 * N'apparaît que lorsque `project.gallery` est renseigné : tant qu'aucun
 * visuel n'est fourni, la page reste silencieuse sur ce point plutôt que
 * d'afficher une grille vide.
 */
export function ProjectGallery({ items, label }: ProjectGalleryProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-caption text-anthracite/70">{label}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal
            key={item.src}
            delay={(index % 4) * 60}
            className="relative overflow-hidden rounded-md bg-canvas-gray"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 32vw, 47vw"
              className="object-cover"
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
