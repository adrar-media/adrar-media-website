import type { Testimonial } from "@/types";

/**
 * CONTENT_REQUIRED — aucun témoignage client validé à ce jour.
 *
 * Un témoignage n'est publié qu'avec l'accord écrit du client (`approved`).
 * Tant que ce tableau ne contient aucune entrée approuvée, la section
 * Témoignages est entièrement masquée : pas de citation inventée, pas de
 * faux placeholder visible côté public.
 */
export const testimonials: Testimonial[] = [];

export const approvedTestimonials = testimonials.filter((t) => t.approved);
