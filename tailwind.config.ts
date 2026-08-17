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
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          DEFAULT: "#1F7A63",
          dark: "#175C4A",
        },
        deep: {
          DEFAULT: "#0A2540",
          soft: "#123356",
        },
        beige: {
          DEFAULT: "#D6C2A1",
          soft: "#E8DECB",
        },
        anthracite: "#2B2B2B",
        light: "#3ED598",
        canvas: {
          // Fond général légèrement tiédi vers le beige de la marque : il
          // installe la douceur sans introduire de couleur supplémentaire.
          DEFAULT: "#F4F2EE",
          raised: "#FFFFFF",
          gray: "#E7E4DD",
        },
      },
      fontFamily: {
        sans: ["var(--font-latin)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "var(--font-latin)", "sans-serif"],
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
        // 17 px de base : une ligne de texte courant plus présente à l'écran.
        body: ["1.0625rem", { lineHeight: "1.6" }],
        "body-lg": ["clamp(1.125rem, 1.6vw, 1.5rem)", { lineHeight: "1.5" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }],
        button: ["0.9375rem", { lineHeight: "1", fontWeight: "500" }],
      },
      spacing: {
        /**
         * `gutter` = marge horizontale de page uniquement. Large, pour que le
         * contenu respire loin des bords sur grand écran.
         *
         * `grid` = écart entre colonnes. Volontairement distinct : appliquer
         * la marge de page comme écart de grille multiplie sa valeur par le
         * nombre de colonnes et fait déborder le conteneur.
         */
        gutter: "clamp(1.25rem, 8.3vw, 8.75rem)",
        grid: "clamp(1.5rem, 2.5vw, 2.5rem)",
        section: "clamp(4.5rem, 9vw, 9rem)",
      },
      maxWidth: {
        container: "87.5rem",
        prose: "34rem",
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
      boxShadow: {
        subtle: "0 1px 2px rgba(10, 37, 64, 0.05)",
        lifted: "0 24px 60px -28px rgba(10, 37, 64, 0.25)",
        pill: "0 8px 30px -10px rgba(10, 37, 64, 0.12)",
        glow: "0 0 60px 0 rgba(62, 213, 152, 0.35)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
        /**
         * Courbe des changements d'état (survol, focus). Relevée sur la
         * référence UX : plus neutre que `brand`, elle convient aux
         * micro-interactions, qui doivent répondre sans « rebondir ».
         */
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "250ms",
        base: "350ms",
        slow: "500ms",
      },
      screens: {
        xs: "375px",
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
         * Respiration lente du halo vert. C'est le seul mouvement permanent
         * de la page : assez lent pour ne pas capter le regard, assez présent
         * pour que la composition ne paraisse pas figée.
         */
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        float: "float 7s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
