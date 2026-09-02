import type { Config } from "tailwindcss";

/**
 * DESIGN SYSTEM — ADRAR MEDIA
 *
 * Les proportions (échelle typographique, rayons, gouttières, durées) sont
 * calquées sur le système mesuré de la référence UX retenue : registre doux et
 * éditorial, titres en casse normale à graisse semi-grasse, rayons généreux,
 * transition unique à 350 ms. Les couleurs, la typographie et le vocabulaire
 * restent ceux d'Adrar Media — on reprend un système de proportions, pas une
 * identité.
 *
 * L'échelle est fluide (clamp) : un token couvre mobile et desktop, sans
 * empiler des surcharges responsive sur chaque titre.
 */
const config: Config = {
  /*
   * Le thème bascule par les variables CSS : la quasi-totalité du site n'a
   * donc aucune classe `dark:` à écrire. La variante reste déclarée pour les
   * rares retouches qu'un jeton de couleur ne peut pas porter — l'exposition
   * d'une photographie, par exemple.
   */
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /**
       * PALETTE — jetons sémantiques, valeurs en variables CSS.
       *
       * Chaque couleur pointe vers une variable définie dans globals.css, en
       * canaux RVB séparés par des espaces. C'est cette forme qui permet à
       * `<alpha-value>` de fonctionner : sans elle, les 93 `text-anthracite/75`
       * du site perdraient leur opacité, puisqu'un `#rrggbb` glissé dans une
       * variable ne peut pas recevoir de canal alpha.
       *
       * Deux jetons portent le bleu de la marque, et la distinction est la
       * clé du thème sombre :
       *
       *   `ink`     — l'encre du texte. BASCULE : bleu profond sur fond clair,
       *               blanc cassé sur fond sombre.
       *   `surface` — le bleu profond en tant que SURFACE. NE BASCULE PAS : les
       *               sections de ponctuation (portfolio, conversion, pied de
       *               page) restent sombres dans les deux thèmes, simplement
       *               relevées d'un cran en mode sombre pour se détacher du
       *               fond. C'est aussi la couleur du texte posé sur le vert
       *               clair, qui ne bascule pas davantage.
       *
       * Les deux vivaient sous un seul nom, `deep`, ce qui rendait le thème
       * sombre impossible : le même jeton devait s'éclaircir comme encre et
       * rester sombre comme fond.
       */
      colors: {
        atlas: {
          DEFAULT: "rgb(var(--atlas) / <alpha-value>)",
          dark: "rgb(var(--atlas-dark) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          soft: "rgb(var(--surface-soft) / <alpha-value>)",
        },
        beige: {
          DEFAULT: "rgb(var(--beige) / <alpha-value>)",
          soft: "rgb(var(--beige-soft) / <alpha-value>)",
        },
        anthracite: "rgb(var(--anthracite) / <alpha-value>)",
        light: "rgb(var(--light) / <alpha-value>)",
        canvas: {
          DEFAULT: "rgb(var(--canvas) / <alpha-value>)",
          raised: "rgb(var(--canvas-raised) / <alpha-value>)",
          gray: "rgb(var(--canvas-gray) / <alpha-value>)",
          off: "rgb(var(--canvas-off) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-latin)", "system-ui", "sans-serif"],
        /**
         * Madani Arabic en tête : c'est le caractère principal de la version
         * arabe. Il est déclaré en @font-face dans globals.css, pas par
         * next/font, d'où le nom de famille en clair là où les autres passent
         * par une variable CSS.
         *
         * Readex Pro derrière, pour deux cas : les signes que la version DEMO
         * de Madani ne dessine pas (virgule et point d'interrogation arabes,
         * trait d'union, deux-points, parenthèses, apostrophe), et le temps du
         * chargement. Dans les deux cas, le repli reste un caractère arabe :
         * une substitution système casserait les liaisons entre lettres, ce
         * qui est bien plus visible qu'un simple changement de dessin.
         */
        arabic: [
          "Madani Arabic",
          "var(--font-arabic-fallback)",
          "var(--font-latin)",
          "sans-serif",
        ],
      },
      fontSize: {
        // Casse normale, graisse 600, interlettrage quasi neutre : c'est ce qui
        // sépare le registre éditorial du registre « brutaliste » en capitales.
        display: [
          "clamp(2.75rem, 7.4vw, 7.75rem)",
          { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h1: [
          "clamp(2.25rem, 5.2vw, 4.75rem)",
          { lineHeight: "1.06", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.875rem, 3.6vw, 3.25rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        h3: [
          "clamp(1.5rem, 3vw, 2.75rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        /*
         * Titre de carte.
         *
         * `h3` monte jusqu'à 44 px, ce qui convient aux colonnes éditoriales
         * larges du site mais déborde d'une carte de trois colonnes : sur la
         * page Solutions, « Accompagnement » sortait du cadre et empiétait sur
         * la carte voisine. Le plafond est ici fixé à 28 px, largeur à laquelle
         * le plus long des trois noms tient dans la colonne la plus étroite.
         *
         * La graisse et l'interlettrage restent ceux de `h3` : c'est le même
         * registre typographique, à une échelle adaptée au conteneur.
         */
        h4: [
          "clamp(1.25rem, 1.9vw, 1.75rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        // 17 px de base : une ligne de texte courant plus présente à l'écran.
        body: ["1.0625rem", { lineHeight: "1.6" }],
        "body-lg": ["clamp(1.125rem, 1.6vw, 1.5rem)", { lineHeight: "1.5" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }],
        button: ["0.9375rem", { lineHeight: "1", fontWeight: "500" }],
      },
      spacing: {
        /**
         * `gutter` = marge horizontale de page uniquement.
         *
         * La pente était de 8,3vw plafonnée à 8,75rem : sur un écran de
         * 1600 px, elle prenait 133 px de chaque côté À L'INTÉRIEUR d'un
         * conteneur déjà limité à 1400 px. Le texte n'occupait plus que
         * 1134 px, soit 71 % de l'écran, et la proportion empirait à chaque
         * pouce de diagonale supplémentaire. La marge est désormais une marge
         * — assez large pour que rien ne colle au bord, assez sobre pour ne
         * pas manger le tiers de la page.
         *
         * `grid` = écart entre colonnes. Volontairement distinct : appliquer
         * la marge de page comme écart de grille multiplie sa valeur par le
         * nombre de colonnes et fait déborder le conteneur.
         */
        gutter: "clamp(1.25rem, 3.6vw, 4.5rem)",
        grid: "clamp(1.5rem, 2.2vw, 3rem)",
        section: "clamp(3.75rem, 6vw, 6.5rem)",
      },
      maxWidth: {
        /*
         * Le conteneur suit la fenêtre jusqu'à 1760 px, puis se fige. Au-delà,
         * ce n'est plus la place qui manque mais l'œil qui décroche : une
         * ligne de titre traversant 2500 px ne se lit plus d'un seul regard.
         * Les colonnes de texte restent bornées par `prose` — élargir le
         * conteneur allonge la grille, jamais les lignes.
         */
        container: "110rem",
        prose: "34rem",
        /* Colonne de lecture longue (articles, mentions légales). */
        reading: "44rem",
      },
      borderRadius: {
        // Rayons généreux : la douceur des angles est le marqueur visuel le
        // plus immédiat du registre visé.
        DEFAULT: "12px",
        md: "22px",
        lg: "33px",
        xl: "44px",
        pill: "999px",
      },
      /*
       * Les ombres sont teintées du bleu de la marque en thème clair. En thème
       * sombre, `--shadow-tint` passe au noir : une ombre bleue posée sur un
       * fond de nuit ne s'assombrit pas, elle colore — la carte paraît
       * entourée d'un halo bleuté au lieu d'être soulevée.
       */
      boxShadow: {
        subtle: "0 1px 2px rgb(var(--shadow-tint) / 0.05)",
        lifted: "0 24px 60px -28px rgb(var(--shadow-tint) / 0.25)",
        pill: "0 8px 30px -10px rgb(var(--shadow-tint) / 0.12)",
        glow: "0 0 60px 0 rgb(var(--light) / 0.35)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
        /**
         * Courbe des changements d'état (survol, focus). Relevée sur la
         * référence UX : plus neutre que `brand`, elle convient aux
         * micro-interactions, qui doivent répondre sans « rebondir ».
         */
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        /*
         * Entrées : départ sec, arrivée longue. C'est ce décalage — et non la
         * vitesse brute — qui fait lire un mouvement comme piloté plutôt que
         * comme un chargement. `brand` reste la courbe des révélations
         * existantes ; `entrance` est réservée aux mouvements qui doivent se
         * remarquer (volets du Hero, ligne de scan).
         */
        entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
        /* Sorties et replis : symétrique de `entrance`, sans dépassement. */
        exit: "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      transitionDuration: {
        /* Retour tactile : en dessous de ~120 ms, un changement d'état n'est
         * plus perçu comme un mouvement mais comme un basculement. */
        instant: "120ms",
        fast: "250ms",
        base: "350ms",
        slow: "500ms",
        /*
         * Durée des révélations. Plus aucune règle CSS ne la consomme depuis
         * que le mouvement est passé à GSAP, mais le jeton reste la référence :
         * `REVEAL_DURATION` (components/motion/gsap.ts) le reprend en secondes,
         * et les deux doivent bouger ensemble. Le système de design garde
         * l'autorité sur la valeur, GSAP n'en est que le consommateur.
         */
        reveal: "700ms",
      },
      screens: {
        xs: "375px",
        /*
         * Palier des grands écrans. Tailwind s'arrête à 1536px (`2xl`) : sans
         * ce point de rupture, une grille passée à quatre colonnes en `xl` ne
         * pouvait plus rien organiser au-delà, et les cartes s'étiraient au
         * lieu de se multiplier.
         */
        "3xl": "1800px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        /**
         * Halo vert qui enfle puis retombe.
         *
         * L'amplitude reste large — c'est ce qui fait respirer la page — mais
         * elle ne vient plus d'un `box-shadow` animé. Un flou de 12vw
         * (~200 px) recalculé à chaque image est repeint par le processeur,
         * sur quatre éléments à la fois : c'est la propriété la plus coûteuse
         * qu'on puisse animer, et le premier écran perdait des images.
         *
         * Le halo est désormais un dégradé radial porté par `.halo`
         * (globals.css), dont seuls l'opacité et l'échelle varient. Ces deux
         * propriétés sont composées par le GPU : le dégradé est peint une
         * fois, puis seulement transformé. Le rendu est le même, le coût par
         * image est nul.
         *
         * L'échelle part de 0.55 pour que le halo naisse du cadre au lieu
         * d'apparaître déjà à sa taille finale.
         */
        "glow-pulse": {
          "0%, 100%": { opacity: "0", transform: "scale(0.55)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        /** Pastilles vertes : battement léger, pour que les repères vivent. */
        "dot-pulse": {
          "0%, 100%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.2)" },
        },
        /**
         * Balayage lumineux le long d'une bordure (cartes au survol).
         *
         * Seule `background-position` varie : le dégradé est peint une fois
         * puis déplacé, comme le halo. La bordure elle-même est découpée au
         * masque, elle n'est pas redessinée.
         */
        "border-sweep": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        /**
         * Dérive du dégradé conique du Hero : le fond n'est jamais tout à fait
         * immobile. Vingt-quatre secondes par tour — assez lent pour qu'on ne
         * surprenne jamais le mouvement en le regardant.
         */
        "gradient-drift": {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.15)" },
        },
        /**
         * Révélation par volet : le texte se découvre, il n'apparaît pas.
         * `clip-path` ne déplace rien et ne repeint pas le texte — la ligne
         * est composée une fois, puis progressivement démasquée.
         */
        "clip-reveal": {
          from: { clipPath: "inset(0 0 100% 0)" },
          to: { clipPath: "inset(0 0 0% 0)" },
        },
        /** Ligne de scan verticale, une seule fois à l'entrée d'une section. */
        scanline: {
          from: { transform: "scaleY(0)", opacity: "1" },
          to: { transform: "scaleY(1)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        float: "float 7s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "dot-pulse": "dot-pulse 2.4s ease-in-out infinite",
        "border-sweep": "border-sweep 3s linear infinite",
        "gradient-drift": "gradient-drift 24s ease-in-out infinite",
        /*
         * `both` retient l'état final : une révélation qui rend la main à sa
         * valeur de base se refermerait sur elle-même à la fin de l'animation.
         */
        "clip-reveal": "clip-reveal 900ms cubic-bezier(0.16, 1, 0.3, 1) both",
        scanline: "scanline 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
