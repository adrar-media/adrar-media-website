"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  EASE_ENTRANCE,
  EASE_BRAND,
} from "@/components/motion/gsap";
import { markPreloaderDone } from "@/components/motion/preloader-state";

/**
 * Durée maximale de l'écran de chargement, en secondes.
 *
 * PLAFOND DUR, pas une durée cible. Le voile se lève quand la page est prête ;
 * ce nombre n'existe que pour le cas où elle ne le serait jamais — une image
 * qui ne répond pas, un domaine tiers qui expire. Sans lui, un seul fichier
 * bloqué garde le visiteur devant un logo pendant trente secondes, et il part.
 * Rien de ce que le voile recouvre n'est indispensable à la lecture : le HTML
 * est déjà là, entièrement rendu par le serveur, dessous.
 */
const MAX_HOLD = 1.6;

/**
 * Durée minimale du voile, en secondes — et c'est le nombre le plus cher du
 * site.
 *
 * CE QU'IL COÛTE. Le premier écran ne se contente pas d'être caché par le
 * voile : le Hero et son titre attendent le signal de levée pour jouer leur
 * entrée (cf. `whenPreloaderDone`), et jusque-là ils sont à `opacity: 0`. Or
 * un élément transparent n'est PAS considéré comme peint : la mesure du plus
 * grand rendu de contenu (LCP), celle sur laquelle Google classe la page, ne
 * démarre son décompte qu'à partir de la levée. Ce plancher n'est donc pas un
 * temps d'attente ajouté à l'affichage, il EST l'affichage.
 *
 * Il valait 1,5 s, plafonné à 2,6 s, suivi d'un retrait de 0,9 s pendant lequel
 * le Hero attendait encore : entre 2,4 s et 3,5 s de LCP sur chaque première
 * visite, sur une page dont le HTML complet arrive en moins de 200 ms.
 *
 * CE QU'IL ACHÈTE. Le tracé du massif doit avoir le temps de se lire, sinon la
 * page s'ouvre sur un clignotement et le voile n'a plus aucune raison d'être.
 * 0,9 s est la durée du tracé une fois joué à double vitesse (voir
 * `INTRO_TIMESCALE`) : la figure se construit entièrement, personne n'attend
 * après elle.
 */
const MIN_HOLD = 0.9;

/**
 * Accélération du tracé.
 *
 * La chorégraphie n'est pas réécrite — ce serait la refaire, et elle est
 * juste : la ligne de sol part d'abord, la crête la suit, l'arc coiffe, la
 * masse remplit. Elle est jouée deux fois plus vite, ce qui la fait tenir dans
 * `MIN_HOLD` sans toucher à un seul de ses repères relatifs. Un seul nombre à
 * bouger le jour où le plancher change.
 */
const INTRO_TIMESCALE = 2;

/**
 * Écran de chargement.
 *
 * TROIS ÉLÉMENTS, ET LE MOUVEMENT EST DANS LEUR ORDRE
 *
 * 1. LE MASSIF SE TRACE. Le logo n'apparaît pas, il se construit : la ligne de
 *    sol part d'un bord et rejoint l'autre, la crête se dessine derrière elle,
 *    l'arc du ciel la coiffe, puis la masse pleine vient remplir le contour
 *    déjà tracé. C'est la même figure que le trait a parcourue — le logo se
 *    solidifie plutôt qu'il ne surgit.
 * 2. LE COMPTEUR MONTE, en bas de page, dans le corps d'affichage. Il ne dit
 *    pas seulement « ça charge » : il dit COMBIEN, ce qui est la seule chose
 *    qui rend une attente supportable.
 * 3. LA RÈGLE SE REMPLIT au ras du bord inférieur, sur toute la largeur. Elle
 *    redit le compteur sous une autre forme — un chiffre se lit, une longueur
 *    se perçoit sans être lue.
 *
 * LA PROGRESSION N'EST PAS UNE ANIMATION DÉGUISÉE
 *
 * Un compteur qui va de 0 à 100 en une durée fixe est un décor : il affiche
 * 100 % pendant que la page charge encore, ou reste à 40 % alors que tout est
 * prêt. Celui-ci court jusqu'à 92 % pendant que les fichiers arrivent, puis
 * ATTEND l'événement `load` avant de finir sa course. Les 8 % du bout sont donc
 * les seuls à dire quelque chose de vrai, et ce sont ceux qu'on regarde.
 *
 * Le voile se lève ensuite par le bas : il ne se fond pas, il se retire, et
 * le premier écran est déjà en place derrière lui — d'où l'événement émis à
 * la fin, qui laisse le Hero jouer son entrée sur le voile qui s'en va plutôt
 * qu'après.
 *
 * CE QUI LE DÉSACTIVE
 *
 * — `prefers-reduced-motion` : le composant ne rend rien du tout. Pas de
 *   voile, pas de verrou de défilement, pas d'attente. Un écran de chargement
 *   est du mouvement pur ; il n'a pas de version réduite, il a une absence.
 * — l'absence de JavaScript : le voile est posé par le script, donc il
 *   n'existe simplement pas, et la page est lisible immédiatement.
 *
 * Le voile porte `aria-hidden` et le contenu reste dans le document : un
 * lecteur d'écran traverse la page normalement pendant que le voile est là.
 */
export function Preloader() {
  // Le wrapper DesktopPreloader garantit que ce composant n'est jamais importé sur mobile.
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const rule = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      /*
       * Rien à jouer : le voile est retiré du flux avant même d'être peint,
       * et le défilement n'est jamais verrouillé.
       */
      gsap.set(el, { display: "none" });
      markPreloaderDone();
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const progress = { value: 0 };

      /*
       * Verrou de défilement. Sans lui, la molette fait défiler une page qu'on
       * ne voit pas : le voile reste devant, mais le premier écran a disparu
       * derrière, et il réapparaît au milieu de la page.
       */
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const render = () => {
        if (count.current) {
          count.current.textContent = String(Math.round(progress.value));
        }
      };

      /* ------------------------------------------------------------------
       * TRACÉ — le logo se construit pendant que les fichiers arrivent.
       * ------------------------------------------------------------------ */
      const intro = gsap.timeline();
      intro.timeScale(INTRO_TIMESCALE);

      intro
        .set(".preloader-mark", { autoAlpha: 1 })
        /*
         * `drawSVG` va de « 0 % » à « 100 % » : le trait se déroule d'une
         * extrémité à l'autre au lieu d'apparaître sur toute sa longueur. La
         * ligne de sol part la première — c'est le sol qui porte le massif,
         * pas l'inverse, et l'ordre se lit.
         */
        .from(".preloader-ground", { drawSVG: "0%", duration: 0.7, ease: EASE_BRAND })
        .from(
          ".preloader-ridge",
          { drawSVG: "0%", duration: 1.1, ease: EASE_BRAND },
          0.15,
        )
        .from(
          ".preloader-arc",
          { drawSVG: "50% 50%", duration: 0.8, ease: EASE_BRAND },
          0.5,
        )
        /*
         * La masse pleine arrive en dernier, par en bas, dans le contour que
         * le trait vient de parcourir. C'est le moment où le dessin devient
         * un logo.
         */
        .from(
          ".preloader-fill",
          { autoAlpha: 0, yPercent: 12, duration: 0.8, ease: EASE_ENTRANCE },
          0.85,
        )
        .from(
          ".preloader-peak",
          { autoAlpha: 0, yPercent: 20, duration: 0.7, ease: EASE_ENTRANCE },
          1.05,
        );

      /* ------------------------------------------------------------------
       * COMPTE — jusqu'à 92 %, puis on attend la page.
       * ------------------------------------------------------------------ */
      /*
       * La course du compteur suit le plancher : elle doit arriver à 92 % au
       * moment où le voile a le droit de se lever, pas après. Calée plus long,
       * elle serait tranchée en pleine montée et le chiffre sauterait de 60 à
       * 100 d'un coup.
       */
      const creep = gsap.to(progress, {
        value: 92,
        duration: MIN_HOLD,
        ease: "power2.out",
        onUpdate: render,
      });

      gsap.to(rule.current, {
        scaleX: 0.92,
        duration: MIN_HOLD,
        ease: "power2.out",
      });

      /* ------------------------------------------------------------------
       * LEVÉE — la fin du compte, puis le voile se retire par le haut.
       * ------------------------------------------------------------------ */
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        creep.kill();

        /*
         * LE SIGNAL PART ICI, AU DÉBUT DU RETRAIT — PAS À LA FIN.
         *
         * Il était émis dans le `onComplete` du retrait : le premier écran
         * commençait donc son entrée une fois le voile entièrement sorti, soit
         * 900 ms plus tard, et ces 900 ms s'ajoutaient telles quelles au LCP.
         * Le visiteur voyait le voile glisser sur une page vide, puis le titre
         * apparaître dans un second temps — deux mouvements successifs là où il
         * n'y a qu'un seul moment à raconter.
         *
         * Émis au départ, le titre se découpe PENDANT que le voile se retire.
         * La page est déjà vivante quand elle se découvre, et la mesure part
         * presque une seconde plus tôt. C'est la même image, jouée dans le bon
         * ordre.
         */
        markPreloaderDone();

        const outro = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = previousOverflow;
            gsap.set(el, { display: "none" });

            /*
             * RECALCUL OBLIGATOIRE, et c'est le piège de tout écran de
             * chargement posé devant une page pilotée au défilement.
             *
             * Le voile verrouille `overflow` sur le corps du document le temps
             * de son passage. Pendant ce temps, la page n'a pas sa hauteur
             * définitive — et c'est précisément là que tous les déclencheurs
             * de défilement se créent et mesurent leurs repères. Le voile
             * retiré, la page reprend sa vraie hauteur, mais les repères, eux,
             * gardent l'ancienne : les titres situés juste sous la ligne de
             * flottaison se retrouvent avec un seuil placé plus bas qu'eux,
             * et ne se déclenchent jamais. Ils restent invisibles, sans erreur
             * ni avertissement — le symptôme est une section vide au premier
             * défilement, et rien dans la console.
             *
             * `refresh()` remesure tout une fois la page rendue à elle-même.
             * Il est appelé APRÈS le retrait du voile et la restauration du
             * défilement, sans quoi il remesurerait exactement l'état faux
             * qu'il est censé corriger.
             */
            ScrollTrigger.refresh();
          },
        });

        outro
          .to(progress, {
            value: 100,
            duration: 0.45,
            ease: "power2.inOut",
            onUpdate: render,
          })
          .to(rule.current, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 0)
          /* Le logo se retire avant le voile, sinon il glisse hors de l'écran
           * avec lui et l'œil le suit au lieu de découvrir la page. */
          .to(
            ".preloader-mark",
            { autoAlpha: 0, y: -18, duration: 0.5, ease: EASE_BRAND },
            0.25,
          )
          .to(
            [count.current, rule.current],
            { autoAlpha: 0, duration: 0.4, ease: EASE_BRAND },
            0.35,
          )
          /*
           * Le voile se retire vers le haut plutôt qu'il ne se fond. Un fondu
           * laisse deux images superposées pendant une demi-seconde ; un
           * retrait dit qu'il y avait quelque chose devant, et que ce n'est
           * plus le cas.
           */
          .to(
            el,
            {
              yPercent: -100,
              duration: 0.9,
              ease: EASE_ENTRANCE,
            },
            0.5,
          );
      };

      /*
       * Deux conditions, la plus lente l'emporte : la page doit être chargée,
       * ET le tracé doit avoir eu le temps de se lire. Lever le voile sur un
       * logo à moitié dessiné donnerait un clignotement, pas une entrée.
       */
      const ready = gsap.timeline();
      ready.to({}, { duration: MIN_HOLD });

      let loaded = document.readyState === "complete";
      const onLoad = () => {
        loaded = true;
        if (ready.progress() === 1) release();
      };

      if (!loaded) window.addEventListener("load", onLoad, { once: true });
      ready.eventCallback("onComplete", () => {
        if (loaded) release();
      });

      /* Plafond dur — voir MAX_HOLD. */
      const ceiling = gsap.delayedCall(MAX_HOLD, release);

      return () => {
        window.removeEventListener("load", onLoad);
        ceiling.kill();
        document.body.style.overflow = previousOverflow;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-canvas"
    >
      {/*
        Le massif d'Adrar — « montagne » en amazigh. Le même dessin que la
        marque, débarrassé de son cartouche : sur un écran entier, un logo
        encadré se lit comme une icône d'application collée au milieu du vide.

        LA FENÊTRE PART DE y=44, ET C'EST L'ARC QUI LA FIXE. L'arc du ciel est
        un demi-cercle de rayon 152 centré en (256, 214) : son sommet monte à
        y=62, et le trait de 14 le porte jusqu'à 55. La fenêtre ouvrait avant à
        108 — elle sectionnait donc l'arc en pleine course, qui entrait par le
        côté, plafonné, et se lisait comme une écharpe au lieu d'un ciel. La
        borne basse (428) laisse passer de même la ligne de sol, dont la courbe
        descend jusqu'à 414. Toute retouche des tracés se revérifie ici.
      */}
      <svg
        viewBox="40 44 432 384"
        className="preloader-mark w-40 opacity-0 md:w-52"
        role="presentation"
      >
        {/* Arc du ciel. */}
        <path
          className="preloader-arc"
          d="M104 214a152 152 0 0 1 304 0"
          fill="none"
          stroke="rgb(var(--atlas))"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Contour de la crête — le trait qui construit. */}
        <path
          className="preloader-ridge"
          d="M52 350 L148 212 L196 268 L256 126 L318 246 L364 200 L460 350"
          fill="none"
          stroke="rgb(var(--ink))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Masse pleine — elle vient remplir le contour déjà tracé. */}
        <path
          className="preloader-fill"
          d="M52 350 L148 212 L196 268 L256 126 L318 246 L364 200 L460 350 Z"
          fill="rgb(var(--ink))"
        />
        {/* Versant clair, le seul accent de couleur du dessin. */}
        <path
          className="preloader-peak"
          d="M256 216 L302 350 L210 350 Z"
          fill="rgb(var(--light))"
        />
        {/* Ligne de sol. */}
        <path
          className="preloader-ground"
          d="M60 390 Q256 426 452 390"
          fill="none"
          stroke="rgb(var(--light))"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>

      {/*
        Le compteur est calé sur le bord de fin plutôt que centré : centré sous
        le logo, il en devient la légende — un sous-titre qu'on lit avec lui.
        Rejeté dans l'angle, il redevient ce qu'il est, un indicateur d'état
        qu'on consulte. `end` plutôt que `right` : en arabe, il passe à gauche.
      */}
      <span className="pointer-events-none absolute bottom-8 end-6 flex items-baseline text-ink md:bottom-10 md:end-10">
        <span ref={count} className="text-display tabular-nums leading-none">
          0
        </span>
        <span className="text-h3 leading-none">%</span>
      </span>

      {/* Règle de progression, au ras du bord. */}
      <span
        ref={rule}
        className="absolute bottom-0 start-0 h-px w-full origin-left scale-x-0 bg-ink rtl:origin-right"
      />
    </div>
  );
}
