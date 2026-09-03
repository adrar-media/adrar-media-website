import type { Locale } from "@/config/i18n";
import { whatsappLink } from "@/config/site";
import { href } from "@/lib/i18n/routing";
import { Button } from "@/components/buttons/Button";

interface MobileServiceCTAProps {
  locale: Locale;
  quoteLabel: string;
  whatsappLabel: string;
  whatsappMessage: string;
}

/**
 * Accès direct à la prise de contact sur les en-têtes Services mobiles.
 *
 * Le bloc disparaît dès le breakpoint desktop afin de laisser l'en-tête et
 * les CTA existants strictement inchangés sur grand écran.
 */
export function MobileServiceCTA({
  locale,
  quoteLabel,
  whatsappLabel,
  whatsappMessage,
}: MobileServiceCTAProps) {
  const whatsapp = whatsappLink(whatsappMessage);

  return (
    <div className="mt-8 flex flex-wrap gap-2 md:hidden">
      <Button
        href={href(locale, "demander-un-devis")}
        className="min-h-11"
        arrow
      >
        {quoteLabel}
      </Button>

      {whatsapp && (
        <Button
          href={whatsapp}
          external
          variant="secondary"
          className="min-h-11"
        >
          {whatsappLabel}
        </Button>
      )}
    </div>
  );
}
