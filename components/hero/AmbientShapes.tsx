/**
 * Formes d'ambiance du Hero.
 *
 * Trois cadres arrondis qui dérivent lentement, chacun portant un halo vert
 * qui enfle puis retombe. Les deux mouvements sont désynchronisés par des
 * retards différents : sans cela, les trois formes battent à l'unisson et
 * l'effet devient mécanique.
 *
 * Tout est peint par le navigateur — aucune image, aucun JavaScript. Les
 * formes sont décoratives, donc masquées aux technologies d'assistance, et
 * l'ensemble s'immobilise sous prefers-reduced-motion.
 *
 * La section parente conserve `overflow-hidden` : le halo mesure jusqu'à 12vw
 * et déborderait sinon la page sur les côtés.
 */
const shapes = [
  { position: "start-[6%] top-[20%] h-40 w-64", drift: "0s", glow: "0s" },
  { position: "end-[10%] top-[12%] h-52 w-72", drift: "1.6s", glow: "1.3s" },
  { position: "start-[36%] bottom-[10%] h-44 w-60", drift: "3.1s", glow: "2.6s" },
];

export function AmbientShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute animate-float ${shape.position}`}
          style={{ animationDelay: shape.drift }}
        >
          {/* Le halo émane d'un cadre invisible : seule la lumière se voit. */}
          <div
            className="absolute inset-0 animate-glow-pulse rounded-xl"
            style={{ animationDelay: shape.glow }}
          />
          <div className="ambient absolute inset-0 rounded-xl bg-light/20" />
          <div className="absolute inset-0 rounded-xl border border-white/60 bg-white/35" />
        </div>
      ))}
    </div>
  );
}
