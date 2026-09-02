import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { hasAnalytics } from "@/lib/analytics/config";
import { ConsentManager } from "@/components/consent/ConsentManager";

/**
 * Charge les libellés traduits et ne monte la mécanique de consentement que
 * si un outil de mesure est effectivement configuré sur le déploiement.
 */
export async function Consent({ locale }: { locale: Locale }) {
  if (!hasAnalytics()) return null;

  const t = await getTranslator(locale, "common");

  return (
    <ConsentManager
      privacyHref={href(locale, "politique-confidentialite")}
      labels={{
        title: t("consent.title"),
        body: t("consent.body"),
        accept: t("consent.accept"),
        refuse: t("consent.refuse"),
        learnMore: t("consent.learnMore"),
      }}
    />
  );
}
