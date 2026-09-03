import type { ProjectVideo } from "@/types";
import { Reveal } from "@/components/motion/Reveal";

interface ProjectVideoGridProps {
  items: ProjectVideo[];
  label: string;
}

/**
 * Capsules vidéo réelles d'un projet.
 *
 * Chaque vidéo est encodée pour le web (H.264, 720p) à partir du montage
 * original, avec une image d'affiche extraite de la vidéo elle-même — jamais
 * une vignette générique. `preload="metadata"` évite de télécharger les six
 * capsules avant qu'une seule ait été ouverte.
 */
export function ProjectVideoGrid({ items, label }: ProjectVideoGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-caption text-anthracite/70">{label}</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.src} delay={(index % 3) * 80}>
            <div
              className="relative overflow-hidden rounded-md bg-surface"
              style={{ aspectRatio: "9 / 16" }}
            >
              <video
                src={item.src}
                poster={item.poster}
                controls
                preload="metadata"
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <track kind="captions" />
              </video>
            </div>
            <p className="mt-3 text-small text-anthracite/70">{item.label}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
