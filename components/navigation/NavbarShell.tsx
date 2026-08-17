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
 * Barre de navigation.
 *
 * Reste visible au scroll et se compacte au-delà du premier écran. Contrairement
 * à la référence analysée, elle ne disparaît pas sur desktop : l'objectif du
 * site est la demande de devis, le CTA doit rester atteignable en permanence.
 */
export function NavbarShell({
  locale,
  homeHref,
  items,
  cta,
  labels,
}: NavbarShellProps) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
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
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-fast ease-brand",
        compact
          ? "border-canvas-gray bg-canvas/95 backdrop-blur"
          : "border-transparent bg-canvas",
      )}
    >
      <Container
        as="nav"
        className={cn(
          "flex items-center justify-between transition-all duration-fast ease-brand",
          compact ? "py-3" : "py-5",
        )}
      >
        <span aria-label={labels.nav} className="sr-only" />

        <Link href={homeHref} className="flex items-center gap-3">
          {/* IMAGE_REQUIRED — logo vectoriel (SVG) attendu pour remplacer ce PNG. */}
          <Image
            src="/brand/adrar-media-logo.png"
            alt={labels.logoAlt}
            width={40}
            height={40}
            priority
            className={cn(
              "w-auto transition-all duration-fast ease-brand",
              compact ? "h-8" : "h-10",
            )}
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-small text-anthracite transition-colors duration-fast ease-brand hover:text-atlas"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitcher current={locale} label={labels.language} />
          <Button href={cta.href} size="md">
            {cta.label}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
          className="flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span aria-hidden className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute inset-x-0 block h-px bg-anthracite transition-all duration-fast ease-brand",
                menuOpen ? "top-2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 top-2 block h-px bg-anthracite transition-opacity duration-fast",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 block h-px bg-anthracite transition-all duration-fast ease-brand",
                menuOpen ? "top-2 -rotate-45" : "top-4",
              )}
            />
          </span>
        </button>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[var(--nav-h,64px)] z-50 overflow-y-auto bg-canvas lg:hidden"
        >
          <Container className="flex flex-col gap-8 py-10">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-canvas-gray py-4 text-h3 text-deep"
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
              <p className="eyebrow mb-3 text-anthracite/50">
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
