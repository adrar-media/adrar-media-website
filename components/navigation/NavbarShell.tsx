"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/config/i18n";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/buttons/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarShellProps {
  locale: Locale;
  homeHref: string;
  items: NavItem[];
  cta: NavItem;
  labels: {
    nav: string;
    language: string;
    openMenu: string;
    closeMenu: string;
    logoAlt: string;
    theme: { label: string; light: string; dark: string; system: string };
  };
}

/**
 * Navigation en pastille flottante.
 *
 * La barre ne s'étend pas sur toute la largeur : elle flotte au-dessus du
 * contenu, posée comme un objet. Le logo reste seul à gauche, sur le fond nu.
 *
 * Elle reste visible au défilement, contrairement à la référence analysée :
 * l'objectif du site est la demande de devis, le CTA doit rester atteignable
 * en permanence. Au-delà du premier écran, la pastille se voile simplement
 * pour que le texte qui passe dessous reste lisible.
 */
export function NavbarShell({
  locale,
  homeHref,
  items,
  cta,
  labels,
}: NavbarShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() as string | null;

  /**
   * Page courante.
   *
   * Rien n'indiquait où l'on se trouvait : les cinq entrées avaient
   * exactement la même apparence sur toutes les pages. La comparaison est
   * préfixée pour que /fr/services/branding marque aussi « Services » —
   * une page de détail appartient à sa rubrique.
   */
  const isCurrent = (target: string) =>
    pathname === target || Boolean(pathname?.startsWith(`${target}/`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verrouille le défilement de la page quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-4 md:pt-6">
      {/*
        La barre passe au-dessus du panneau mobile. Sans cela le panneau
        ouvert, en `inset-0`, recouvrait le bouton : il n'y avait plus aucun
        moyen de refermer le menu au doigt — seule la touche Échap
        fonctionnait, ce qu'un téléphone n'a pas. La bascule du bouton en
        croix, elle aussi, ne pouvait jamais être vue.
      */}
      <Container
        as="nav"
        aria-label={labels.nav}
        className="relative z-50 flex items-center justify-between gap-4"
      >
        {/*
          Le logo est posé sur le fond nu, sans pastille : il doit donc
          s'effacer dès que la page défile, sinon le contenu passe dessous et
          se superpose à lui. Seule la pastille de navigation reste fixée.
          Sur mobile il conserve son propre fond et reste lisible.
        */}
        <Link
          href={homeHref}
          tabIndex={scrolled ? -1 : undefined}
          aria-hidden={scrolled || undefined}
          className={cn(
            "flex shrink-0 items-center rounded-pill bg-canvas-raised/80 p-2 backdrop-blur-sm transition-opacity duration-base ease-brand md:bg-transparent md:p-0 md:backdrop-blur-none",
            scrolled && "lg:pointer-events-none lg:opacity-0",
          )}
        >
          {/*
            IMAGE_REQUIRED — logo vectoriel (SVG) attendu pour remplacer ce PNG.

            Le logo était rendu à 36–40 px : à cette taille le massif du
            symbole et le mot « ADRAR » sous lui deviennent illisibles, et une
            marque qui ne se lit pas dans sa propre navigation se lit comme un
            détail.

            IL FAIT DÉSORMAIS 96 px À PARTIR DE `md`, contre 57 px pour la
            pastille de navigation posée en face. L'écart est franc et il est
            voulu : le logo EST la marque, la pastille n'est qu'un outil de
            circulation, et c'est au premier de mener. Aux tailles
            intermédiaires — 64, puis 72 px — les deux objets restaient trop
            proches pour qu'on lise une hiérarchie, sans l'être assez pour
            qu'on lise un alignement.

            CE N'EST PAS UN MASSIF DE 96 px POUR AUTANT. Le carré source porte
            sa propre marge, et le dessin n'en occupe qu'une partie : à 96 px
            de boîte, le symbole et le mot « ADRAR » sous lui restent
            nettement en deçà de la hauteur de la barre. C'est ce qui permet de
            monter aussi haut sans écraser la navigation.

            64 px sur mobile, où le logo n'a plus de pastille en vis-à-vis mais
            garde son propre fond.

            La source PNG fait 500 px de côté : à 72 px affichés, un écran à
            densité double en demande 144, ce que `width`/`height` couvre
            largement. Aucun flou à craindre de ce côté.

            `width`/`height` décrivent la source demandée, pas la taille
            affichée : 160 px laisse de quoi servir un écran à densité double
            sans flou. La source PNG fait 500 px de côté, elle suit.
          */}
          {/*
            ASSET_REQUIRED — version claire du logo pour fond sombre.

            Le PNG est dessiné en bleu profond : posé sur le fond de nuit, il
            disparaît presque entièrement. En attendant un fichier prévu pour
            fond sombre, le filtre le ramène en blanc plein — `brightness-0`
            écrase d'abord toutes les valeurs à zéro, `invert` les remonte à
            un. Le résultat est lisible et net, mais il perd le vert du
            massif : c'est un dépannage assumé, pas la solution.
          */}
          <Image
            src="/brand/adrar-media-logo.png"
            alt={labels.logoAlt}
            width={160}
            height={160}
            priority
            className="h-16 w-auto md:h-24 dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Pastille de navigation — desktop */}
        <div
          className={cn(
            "hidden items-center rounded-pill border p-1.5 ps-8 transition-all duration-base ease-brand lg:flex",
            scrolled
              ? "border-anthracite/10 bg-canvas-raised/85 shadow-pill backdrop-blur-md"
              : "border-anthracite/10 bg-canvas-raised shadow-pill",
          )}
        >
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    "link-underline text-small transition-colors duration-base ease-brand hover:text-atlas",
                    isCurrent(item.href) ? "text-atlas" : "text-anthracite",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <span
            aria-hidden
            className="mx-6 h-5 w-px shrink-0 bg-anthracite/[0.12]"
          />

          <LanguageSwitcher current={locale} label={labels.language} />

          <span
            aria-hidden
            className="mx-3 h-5 w-px shrink-0 bg-anthracite/[0.12]"
          />

          <ThemeToggle labels={labels.theme} />

          <Button href={cta.href} size="md" className="ms-4">
            {cta.label}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
          className="flex h-12 w-12 items-center justify-center rounded-pill border border-anthracite/10 bg-canvas-raised shadow-pill lg:hidden"
        >
          <span aria-hidden className="relative block h-4 w-5">
            <span
              className={cn(
                "absolute inset-x-0 block h-px bg-anthracite transition-all duration-base ease-brand",
                menuOpen ? "top-2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 top-2 block h-px bg-anthracite transition-opacity duration-base",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 block h-px bg-anthracite transition-all duration-base ease-brand",
                menuOpen ? "top-2 -rotate-45" : "top-4",
              )}
            />
          </span>
        </button>
      </Container>

      {/*
        Le panneau reste monté pour pouvoir se fermer en fondu : monté et
        démonté au vol, il apparaissait et disparaissait d'un coup, sans
        transition possible.

        `invisible` plutôt qu'un simple `opacity-0` : la visibilité sort le
        panneau fermé de l'arbre d'accessibilité et de l'ordre de tabulation,
        donc ses liens ne sont ni annoncés ni atteignables au clavier tant
        qu'il est fermé. Elle se transitionne aussi correctement — le
        basculement est différé à la fin du fondu à la fermeture, immédiat à
        l'ouverture.
      */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 overflow-y-auto bg-canvas transition-[opacity,visibility] duration-base ease-brand lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Container className="flex flex-col gap-8 py-24">
          <ul className="flex flex-col gap-1">
            {items.map((item, index) => (
              <li key={item.href}>
                {/*
                  Les entrées montent en cascade. Le décalage n'est appliqué
                  qu'à l'ouverture : à la fermeture, tout doit partir ensemble,
                  sinon le panneau semble se démonter pièce par pièce.
                */}
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    transitionDelay: menuOpen ? `${90 + index * 45}ms` : "0ms",
                  }}
                  className={cn(
                    "block border-b border-canvas-gray py-5 text-h3 text-ink transition-[opacity,transform] duration-base ease-brand",
                    menuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{
              transitionDelay: menuOpen
                ? `${90 + items.length * 45}ms`
                : "0ms",
            }}
            className={cn(
              "transition-[opacity,transform] duration-base ease-brand",
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <Button
              href={cta.href}
              size="lg"
              className="w-full"
              onClick={() => setMenuOpen(false)}
            >
              {cta.label}
            </Button>

            <div className="mt-8">
              <p className="mb-3 text-caption text-anthracite/70">
                {labels.language}
              </p>
              <LanguageSwitcher
                current={locale}
                label={labels.language}
                variant="stacked"
                className="flex-wrap"
              />
            </div>

            <div className="mt-8">
              <p className="mb-3 text-caption text-anthracite/70">
                {labels.theme.label}
              </p>
              <ThemeToggle
                labels={labels.theme}
                variant="stacked"
                className="flex-wrap"
              />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
