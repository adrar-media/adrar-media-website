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
    logo: {
      src: "/images/projects/bricodi-pro-logo.jpg",
      alt: "Bricodi Pro",
      width: 200,
      height: 200,
    },
    gallery: [
      {
        src: "/images/projects/bricodi-pro/gallery/01.jpg",
        alt: "Bricodi Pro — visuel 1",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/02.jpg",
        alt: "Bricodi Pro — visuel 2",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/03.jpg",
        alt: "Bricodi Pro — visuel 3",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/04.jpg",
        alt: "Bricodi Pro — visuel 4",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/05.jpg",
        alt: "Bricodi Pro — visuel 5",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/06.jpg",
        alt: "Bricodi Pro — visuel 6",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/07.jpg",
        alt: "Bricodi Pro — visuel 7",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/08.jpg",
        alt: "Bricodi Pro — visuel 8",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/09.jpg",
        alt: "Bricodi Pro — visuel 9",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/10.jpg",
        alt: "Bricodi Pro — visuel 10",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/11.jpg",
        alt: "Bricodi Pro — visuel 11",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/bricodi-pro/gallery/12.jpg",
        alt: "Bricodi Pro — visuel 12",
        width: 360,
        height: 640,
      },
    ],
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
    logo: {
      src: "/images/projects/the-big-family-logo.jpg",
      alt: "The Big Family Barbershop",
      width: 200,
      height: 200,
    },
    gallery: [
      {
        src: "/images/projects/the-big-family/gallery/01.jpg",
        alt: "The Big Family Barbershop — visuel 1",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/02.jpg",
        alt: "The Big Family Barbershop — visuel 2",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/03.jpg",
        alt: "The Big Family Barbershop — visuel 3",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/04.jpg",
        alt: "The Big Family Barbershop — visuel 4",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/05.jpg",
        alt: "The Big Family Barbershop — visuel 5",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/06.jpg",
        alt: "The Big Family Barbershop — visuel 6",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/07.jpg",
        alt: "The Big Family Barbershop — visuel 7",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/08.jpg",
        alt: "The Big Family Barbershop — visuel 8",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/09.jpg",
        alt: "The Big Family Barbershop — visuel 9",
        width: 360,
        height: 640,
      },
      {
        src: "/images/projects/the-big-family/gallery/10.jpg",
        alt: "The Big Family Barbershop — visuel 10",
        width: 360,
        height: 640,
      },
    ],
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
    logo: {
      src: "/images/projects/wlidatna-logo.jpg",
      alt: "Association Wlidatna",
      width: 240,
      height: 240,
    },
    featured: true,
  },
  {
    slug: "zenori-cafe",
    client: "Zenori Café",
    industry: "industry.cafe",
    categories: ["social-media", "video"],
    services: ["social", "content", "production"],
    summary: "projects.zenori.summary",
    caseStudy: {
      context: "projects.zenori.context",
      approach: "projects.zenori.approach",
      deliverables: [
        "projects.zenori.deliverables.0",
        "projects.zenori.deliverables.1",
        "projects.zenori.deliverables.2",
      ],
      disclosure: "projects.zenori.disclosure",
    },
    logo: {
      src: "/images/projects/zenori-cafe-logo.jpg",
      alt: "Zenori Café",
      width: 320,
      height: 320,
    },
    gallery: [
      {
        src: "/images/projects/zenori-cafe/gallery/01.jpg",
        alt: "Zenori Café — visuel 1",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/02.jpg",
        alt: "Zenori Café — visuel 2",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/03.jpg",
        alt: "Zenori Café — visuel 3",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/04.jpg",
        alt: "Zenori Café — visuel 4",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/05.jpg",
        alt: "Zenori Café — visuel 5",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/06.jpg",
        alt: "Zenori Café — visuel 6",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/07.jpg",
        alt: "Zenori Café — visuel 7",
        width: 700,
        height: 933,
      },
      {
        src: "/images/projects/zenori-cafe/gallery/08.jpg",
        alt: "Zenori Café — visuel 8",
        width: 700,
        height: 933,
      },
    ],
    videos: [
      {
        src: "/images/projects/zenori-cafe/videos/ambiance-interne.mp4",
        poster: "/images/projects/zenori-cafe/videos/ambiance-interne-poster.jpg",
        label: "Ambiance interne",
      },
      {
        src: "/images/projects/zenori-cafe/videos/differents-caracteres.mp4",
        poster: "/images/projects/zenori-cafe/videos/differents-caracteres-poster.jpg",
        label: "Différents caractères",
      },
      {
        src: "/images/projects/zenori-cafe/videos/localisation.mp4",
        poster: "/images/projects/zenori-cafe/videos/localisation-poster.jpg",
        label: "Localisation",
      },
      {
        src: "/images/projects/zenori-cafe/videos/match-day.mp4",
        poster: "/images/projects/zenori-cafe/videos/match-day-poster.jpg",
        label: "Match day",
      },
      {
        src: "/images/projects/zenori-cafe/videos/qualite-de-service.mp4",
        poster: "/images/projects/zenori-cafe/videos/qualite-de-service-poster.jpg",
        label: "Qualité de service",
      },
      {
        src: "/images/projects/zenori-cafe/videos/travail-a-distance.mp4",
        poster: "/images/projects/zenori-cafe/videos/travail-a-distance-poster.jpg",
        label: "Travail à distance",
      },
    ],
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
