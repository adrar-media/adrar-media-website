import type { Config } from "tailwindcss";

/**
 * DESIGN SYSTEM — ADRAR MEDIA
 *
 * Palette officielle (§24) + neutres nécessaires. Aucune couleur dominante
 * supplémentaire. Cette palette prime sur celle du projet interne Adrar OS,
 * qui diverge (écart documenté dans le README).
 *
 * L'échelle typographique est fluide (clamp) : un seul token couvre mobile et
 * desktop, ce qui évite d'empiler les surcharges responsive sur chaque titre.
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
          DEFAULT: "#FFFFFF",
          off: "#FAF8F4",
          gray: "#EFEDE8",
        },
      },
      fontFamily: {
        // Latin (fr, en) et arabe : deux grotesques de proportions voisines,
        // pour que la densité typographique ne change pas d'une langue à l'autre.
        sans: ["var(--font-latin)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "var(--font-latin)", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(3rem, 11vw, 10rem)",
          { lineHeight: "0.92", letterSpacing: "-0.035em", fontWeight: "700" },
        ],
        h1: [
          "clamp(2.5rem, 7vw, 5.5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        h2: [
          "clamp(2rem, 4.5vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        h3: [
          "clamp(1.25rem, 2vw, 1.75rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-lg": ["clamp(1.0625rem, 1.4vw, 1.25rem)", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.55" }],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.14em", fontWeight: "500" },
        ],
        button: [
          "0.875rem",
          { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "500" },
        ],
      },
      spacing: {
        gutter: "clamp(1.25rem, 4vw, 4rem)",
        section: "clamp(5rem, 12vw, 11rem)",
      },
      maxWidth: {
        container: "88rem",
        prose: "38rem",
      },
      borderRadius: {
        // Registre éditorial : angles quasi vifs. Le "pill" est réservé aux tags.
        DEFAULT: "2px",
        md: "4px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(10, 37, 64, 0.06)",
        lifted: "0 24px 60px -24px rgba(10, 37, 64, 0.28)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "250ms",
        base: "500ms",
      },
      screens: {
        xs: "375px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
