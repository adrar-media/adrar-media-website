import type { Project } from "@/types";

/**
 * Projets réels uniquement.
 *
 * Règle stricte : un champ non confirmé par la direction reste marqué
 * DATA_REQUIRED et n'est pas affiché. Aucune métrique n'apparaît sans source.
 * Aucune image n'est référencée tant que les visuels et l'accord client ne
 * sont pas fournis — les composants rendent alors un cadre typographique.
 */
export const projects: Project[] = [
  {
    slug: "bricodi-pro",
    client: "Bricodi Pro",
    industry: "industry.hardware",
    categories: ["social-media", "publicite", "video"],
    services: ["social", "content", "performance"],
    summary: "projects.bricodi.summary",
    headlineMetric: {
      value: "516K+",
      label: "metrics.facebookViews",
      source: "Meta — phase de lancement",
    },
    featured: true,
  },
  {
    slug: "the-big-family",
    client: "The Big Family",
    industry: "industry.barbershop",
    categories: ["social-media", "branding", "video"],
    services: ["social", "content", "brand"],
    summary: "projects.bigFamily.summary",
    featured: true,
  },
  {
    slug: "ruchendo",
    client: "Ruch'Endo",
    // DATA_REQUIRED — secteur non confirmé par la direction.
    industry: "industry.pending",
    categories: ["publicite", "social-media"],
    services: ["strategy", "performance"],
    summary: "projects.ruchendo.summary",
    featured: true,
  },
  {
    slug: "wlidatna",
    client: "Wlidatna",
    // DATA_REQUIRED — secteur non confirmé par la direction.
    industry: "industry.pending",
    categories: ["video", "social-media"],
    services: ["content", "production"],
    summary: "projects.wlidatna.summary",
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
