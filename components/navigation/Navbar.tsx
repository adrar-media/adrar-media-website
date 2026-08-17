import type { Locale } from "@/config/i18n";
import { getTranslator } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/routing";
import { NavbarShell, type NavItem } from "@/components/navigation/NavbarShell";

/**
 * Charge les libellés traduits côté serveur et les transmet à la coque
 * interactive. Les composants d'interface ne connaissent jamais le
 * dictionnaire : ils reçoivent des chaînes déjà résolues.
 */
export async function Navbar({ locale }: { locale: Locale }) {
  const t = await getTranslator(locale, "common");

  const items: NavItem[] = [
    { label: t("nav.services"), href: href(locale, "services") },
    { label: t("nav.work"), href: href(locale, "realisations") },
    { label: t("nav.method"), href: href(locale, "methode") },
    { label: t("nav.about"), href: href(locale, "a-propos") },
  ];

  return (
    <NavbarShell
      locale={locale}
      homeHref={href(locale)}
      items={items}
      cta={{ label: t("cta.quote"), href: href(locale, "demander-un-devis") }}
      labels={{
        nav: t("nav.label"),
        language: t("language.label"),
        openMenu: t("nav.openMenu"),
        closeMenu: t("nav.closeMenu"),
        logoAlt: t("brand.logoAlt"),
      }}
    />
  );
}
