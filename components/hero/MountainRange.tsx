/**
 * Massif en fond de Hero.
 *
 * « Adrar » signifie montagne en amazigh : le motif n'est pas décoratif, il
 * dit le nom de l'agence. Trois crêtes se superposent et dérivent à des
 * vitesses différentes — la plus lointaine la plus lente — ce qui crée une
 * profondeur de parallaxe sans écouter le scroll ni la souris.
 *
 * Chaque crête est un tracé SVG dupliqué côte à côte sur 200 % de largeur,
 * puis translaté de -50 % en boucle : le raccord est invisible parce que le
 * profil commence et finit exactement à la même altitude.
 *
 * Aucune image, aucun JavaScript : le massif ne coûte que quelques centaines
 * d'octets de balisage et s'anime sur le GPU (transform uniquement).
 * Décoratif, donc masqué aux technologies d'assistance ; immobile sous
 * prefers-reduced-motion.
 */

interface Ridge {
  /** Profil de crête. Première et dernière altitude identiques pour boucler. */
  path: string;
  className: string;
  /** Les crêtes lointaines dérivent plus lentement. */
  duration: string;
  height: string;
}

const ridges: Ridge[] = [
  {
    // Lointaine : profil doux, presque effacé dans la brume.
    path: "M0,210 L150,168 L290,198 L430,140 L560,186 L700,128 L840,180 L980,148 L1110,192 L1200,210 L1200,320 L0,320 Z",
    className: "fill-atlas/[0.16]",
    duration: "150s",
    height: "h-[78%]",
  },
  {
    // Intermédiaire : le relief se dessine.
    path: "M0,240 L130,196 L260,232 L400,164 L520,214 L660,152 L790,206 L930,172 L1060,220 L1200,240 L1200,320 L0,320 Z",
    className: "fill-atlas/[0.26]",
    duration: "105s",
    height: "h-[62%]",
  },
  {
    // Proche : la plus marquée, elle ancre la composition au sol.
    path: "M0,266 L120,228 L250,262 L380,204 L500,250 L640,192 L770,244 L900,212 L1040,254 L1200,266 L1200,320 L0,320 Z",
    className: "fill-ink/[0.18]",
    duration: "70s",
    height: "h-[46%]",
  },
];

function Ridge({ path, className, duration, height }: Ridge) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 flex w-[200%] animate-marquee ${height}`}
      style={{ animationDuration: duration }}
    >
      {[0, 1].map((copy) => (
        <svg
          key={copy}
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
          className="h-full w-1/2 shrink-0"
        >
          <path d={path} className={className} />
        </svg>
      ))}
    </div>
  );
}

export function MountainRange() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] overflow-x-clip overflow-y-hidden"
    >
      {ridges.map((ridge) => (
        <Ridge key={ridge.duration} {...ridge} />
      ))}

      {/*
        Voile de fond qui éteint le bas du massif : les crêtes se fondent dans
        la page au lieu de s'arrêter net sur une ligne horizontale.
      */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
