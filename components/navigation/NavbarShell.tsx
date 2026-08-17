"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale } from "@/config/i18n";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
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
      <Container as="nav" className="flex items-center justify-between gap-4">
        <span aria-label={labels.nav} className="sr-only" />

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
          {/* IMAGE_REQUIRED — logo vectoriel (SVG) attendu pour remplacer ce PNG. */}
          <Image
            src="/brand/adrar-media-logo.png"
            alt={labels.logoAlt}
            width={40}
            height={40}
            priority
            className="h-9 w-auto md:h-10"
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
                  className="text-small text-anthracite transition-colors duration-base ease-brand hover:text-atlas"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <span
            aria-hidden
            className="mx-6 h-5 w-px shrink-0 bg-anthracite/12"
          />

          <LanguageSwitcher current={locale} label={labels.language} />

          <Button href={cta.href} size="md" className="ms-5">
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

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-canvas lg:hidden"
        >
          <Container className="flex flex-col gap-8 py-24">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-canvas-gray py-5 text-h3 text-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Button
              href={cta.href}
              size="lg"
              className="w-full"
              onClick={() => setMenuOpen(false)}
            >
              {cta.label}
            </Button>

            <div>
              <p className="mb-3 text-caption text-anthracite/50">
                {labels.language}
              </p>
              <LanguageSwitcher
                current={locale}
                label={labels.language}
                variant="stacked"
                className="flex-wrap"
              />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
