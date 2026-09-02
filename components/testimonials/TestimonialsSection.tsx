import Image from "next/image";
import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { approvedTestimonials } from "@/data/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

/**
 * TÉMOIGNAGES CLIENTS
 *
 * La section n'existait pas : la page d'accueil portait un commentaire
 * expliquant qu'aucun témoignage n'était validé. C'était juste sur le fond,
 * mais cela laissait le jour où un client donnerait son accord sans rien pour
 * l'accueillir — il aurait fallu écrire la section à ce moment-là, sous
 * pression.
 *
 * Elle est donc écrite, et se masque d'elle-même tant que `data/testimonials`
 * ne contient aucune entrée approuvée. Ajouter un témoignage validé au fichier
 * de données suffit à la faire apparaître, sans toucher au code.
 *
 * La règle d'`approved` est tenue par la donnée, pas par l'affichage : un
 * témoignage recueilli mais non validé par écrit reste invisible.
 */
export async function TestimonialsSection({ locale }: { locale: Locale }) {
  if (approvedTestimonials.length === 0) return null;

  const t = await getTranslator(locale, "home");
  const single = approvedTestimonials.length === 1;

  return (
    <section className="border-b border-canvas-gray bg-beige-soft py-section">
      <Container>
        <SectionHeader
          eyebrow={t("testimonials.eyebrow")}
          titleLines={t.list("testimonials.titleLines")}
          intro={t("testimonials.intro")}
          align="split"
          className="mb-14"
        />

        <Stagger
          as="ul"
          className={
            single
              ? "grid gap-12 md:grid-cols-12"
              : "grid gap-x-grid gap-y-14 md:grid-cols-2"
          }
        >
          {approvedTestimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className={single ? "md:col-span-9" : undefined}
            >
              <figure>
                <blockquote className="max-w-prose text-h3 text-ink">
                  {/*
                    Les guillemets sont typographiques et posés ici, non
                    saisis dans la donnée : ils dépendent de la langue de la
                    page, pas de celle du témoignage.
                  */}
                  <p>« {testimonial.quote} »</p>
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4">
                  {testimonial.photo && (
                    <Image
                      src={testimonial.photo.src}
                      alt={testimonial.photo.alt}
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 rounded-pill object-cover"
                    />
                  )}
                  <span className="flex flex-col">
                    <span className="text-body text-ink">
                      {testimonial.author}
                    </span>
                    <span className="text-small text-anthracite/70">
                      {testimonial.role} — {testimonial.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
