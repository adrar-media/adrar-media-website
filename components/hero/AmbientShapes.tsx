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
 * Le halo passe par `.halo` (globals.css) : un dégradé radial dont seuls
 * l'opacité et l'échelle varient. La version précédente animait un
 * `box-shadow` de 12vw, soit un flou de ~200 px repeint à chaque image sur
 * trois formes en même temps — le poste le plus lourd du premier écran.
 *
 * La section parente conserve `overflow-hidden` : le halo déborde de 12vw de
 * chaque côté de son cadre et sortirait sinon de la page.
 */
const shapes = [
  { position: "start-[6%] top-[20%] h-40 w-64", drift: "0s", glow: "0s" },
  { position: "end-[10%] top-[12%] h-52 w-72", drift: "1.6s", glow: "1.3s" },
  { position: "start-[34%] top-[46%] h-44 w-60", drift: "3.1s", glow: "2.6s" },
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
            className="halo animate-glow-pulse"
            style={{ animationDelay: shape.glow }}
          />
          <div className="absolute inset-0 rounded-xl bg-light/20 dark:bg-light/10" />
          {/*
            Le verre est réglé pour un fond clair : 35 % de blanc sur du crème
            se lit comme une plaque translucide, la même valeur sur un fond de
            nuit devient une dalle laiteuse qui écrase le titre. En thème
            sombre la matière s'inverse — presque rien de blanc, un liseré à
            peine posé : c'est le fond qui doit rester profond.
          */}
          <div className="absolute inset-0 rounded-xl border border-white/60 bg-white/35 dark:border-white/10 dark:bg-white/[0.03]" />
        </div>
      ))}
    </div>
  );
}
