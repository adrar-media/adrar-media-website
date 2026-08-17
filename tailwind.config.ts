import type { Config } from "tailwindcss";

/**
 * Palette officielle Adrar Media (source : PROMPT MAÎTRE §07 / §10).
 * Cette palette fait autorité pour le site web et prime sur les couleurs
 * définies dans le projet interne Adrar OS (qui diverge — voir README).
 *
 * Le design system complet (spacing, radius, shadows, typographie, motion)
 * est construit en PHASE 05. Ce fichier ne pose que les fondations couleur.
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
        atlas: "#1F7A63",
        deep: "#0A2540",
        beige: "#D6C2A1",
        anthracite: "#2B2B2B",
        light: "#3ED598",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
