/**
 * Formes d'ambiance du Hero.
 *
 * Rectangles arrondis diffus, teintés du vert de la marque, posés derrière le
 * titre. Ils installent la profondeur du registre sans aucune image : tout est
 * peint par le navigateur, donc zéro octet téléchargé et aucun décalage de
 * mise en page au chargement.
 *
 * Seul le halo respire (`glow-pulse`, 4 s) ; le cadre reste fixe, pour ne pas
 * faire vibrer une forme géométrique sous les yeux du lecteur. C'est le seul
 * mouvement permanent de la page, et il s'arrête sous prefers-reduced-motion.
 *
 * Purement décoratives, donc masquées aux technologies d'assistance.
 */
const shapes = [
  "start-[6%] top-[22%] h-40 w-64",
  "end-[12%] top-[14%] h-52 w-72",
  "start-[38%] bottom-[12%] h-44 w-60",
];

export function AmbientShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {shapes.map((position, i) => (
        <div key={i} className={`absolute rounded-xl ${position}`}>
          <div className="ambient h-full w-full animate-glow-pulse rounded-xl bg-light/25" />
          <div className="absolute inset-0 rounded-xl border border-white/60 bg-white/40" />
        </div>
      ))}
    </div>
  );
}
