import { Container } from "@/components/ui/Container";
import { Stagger } from "@/components/motion/Stagger";

export interface ProseSection {
  title: string;
  body: string;
  /** Informations officielles non encore communiquées, listées telles quelles. */
  pending?: string[];
}

interface ProseSectionsProps {
  sections: ProseSection[];
  pendingLabel: string;
  pendingNote: string;
}

/**
 * Corps des pages de texte réglementaire.
 *
 * Les mentions manquantes ne sont pas inventées ni masquées : elles sont
 * affichées en clair, nommées, dans un encart distinct du texte. Une mention
 * légale approximative expose davantage qu'une mention absente et assumée,
 * et laisser un trou silencieux garantit qu'on l'oublie.
 */
export function ProseSections({
  sections,
  pendingLabel,
  pendingNote,
}: ProseSectionsProps) {
  return (
    <section className="pb-section">
      <Container>
        <Stagger as="ol" className="border-t border-anthracite/[0.12]">
          {sections.map((section, index) => (
            <li
              key={section.title}
              className="border-b border-anthracite/[0.12]"
            >
              <div className="grid gap-6 py-12 md:grid-cols-12 md:gap-grid md:py-16">
                <div className="md:col-span-4">
                  <p className="text-caption text-anthracite/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-h3 text-ink">{section.title}</h2>
                </div>

                <div className="md:col-span-7 md:col-start-6">
                  <p className="max-w-prose text-body text-anthracite/75">
                    {section.body}
                  </p>

                  {section.pending && section.pending.length > 0 && (
                    <div className="mt-8 rounded-md border border-beige bg-beige-soft/60 p-6">
                      <p className="text-caption text-atlas">{pendingLabel}</p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {section.pending.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-small text-anthracite/75"
                          >
                            <span
                              aria-hidden
                              className="mt-2 block h-1 w-1 shrink-0 rounded-pill bg-atlas"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-small text-anthracite/75">
                        {pendingNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
