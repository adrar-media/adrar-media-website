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
    caseStudy: {
      context: "projects.bricodi.context",
      approach: "projects.bricodi.approach",
      deliverables: [
        "projects.bricodi.deliverables.0",
        "projects.bricodi.deliverables.1",
        "projects.bricodi.deliverables.2",
      ],
      disclosure: "projects.bricodi.disclosure",
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
    caseStudy: {
      context: "projects.bigFamily.context",
      approach: "projects.bigFamily.approach",
      deliverables: [
        "projects.bigFamily.deliverables.0",
        "projects.bigFamily.deliverables.1",
        "projects.bigFamily.deliverables.2",
      ],
      disclosure: "projects.bigFamily.disclosure",
    },
    featured: true,
  },
  {
    slug: "wlidatna",
    client: "Wlidatna",
    industry: "industry.association",
    categories: ["video", "social-media"],
    services: ["content", "production"],
    summary: "projects.wlidatna.summary",
    caseStudy: {
      context: "projects.wlidatna.context",
      approach: "projects.wlidatna.approach",
      deliverables: [
        "projects.wlidatna.deliverables.0",
        "projects.wlidatna.deliverables.1",
        "projects.wlidatna.deliverables.2",
      ],
      disclosure: "projects.wlidatna.disclosure",
    },
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
