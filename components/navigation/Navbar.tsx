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
    { label: t("nav.solutions"), href: href(locale, "solutions") },
    { label: t("nav.work"), href: href(locale, "realisations") },
    { label: t("nav.method"), href: href(locale, "methode") },
    { label: t("nav.about"), href: href(locale, "a-propos") },
    /*
     * Contact ferme la liste, après « À propos ».
     *
     * La page existait et n'était atteignable que par le pied de page : un
     * visiteur qui veut joindre l'agence depuis le haut de l'écran n'avait que
     * « Demander un devis », qui engage bien davantage qu'une question. Le rang
     * n'est pas indifférent — dernier de la liste et juste avant l'appel à
     * l'action, il se lit comme la porte de sortie douce à côté de la porte
     * principale.
     */
    { label: t("nav.contact"), href: href(locale, "contact") },
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
        theme: {
          label: t("theme.label"),
          light: t("theme.light"),
          dark: t("theme.dark"),
          system: t("theme.system"),
        },
      }}
    />
  );
}
