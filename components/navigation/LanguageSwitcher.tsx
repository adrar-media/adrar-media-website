"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  localeCookie,
  localeLabels,
  localeNames,
  locales,
  type Locale,
} from "@/config/i18n";
import { localizePathname } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  current: Locale;
  label: string;
  className?: string;
  variant?: "inline" | "stacked";
}

/**
 * Sélecteur de langue.
 *
 * Un choix ici est un choix explicite : il est mémorisé dans le cookie
 * `adrar_locale` et devient prioritaire sur toute détection ultérieure, y
 * compris si l'utilisateur change de pays. La navigation reste sur la même
 * page — /fr/realisations devient /en/work, pas la page d'accueil.
 */
export function LanguageSwitcher({
  current,
  label,
  className,
  variant = "inline",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (locale: Locale) => {
    if (locale === current) return;
    document.cookie = `${localeCookie.name}=${locale}; path=/; max-age=${localeCookie.maxAgeSeconds}; samesite=lax`;
    startTransition(() => {
      router.push(localizePathname(pathname, locale));
    });
  };

  return (
    <div
      role="group"
      aria-label={label}
      aria-busy={isPending}
      className={cn(
        "flex items-center",
        variant === "inline" ? "gap-1" : "gap-2",
        className,
      )}
    >
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center">
          {variant === "inline" && index > 0 && (
            <span aria-hidden className="px-1 text-current opacity-30">
              ·
            </span>
          )}
          <button
            type="button"
            lang={locale}
            onClick={() => select(locale)}
            aria-current={locale === current ? "true" : undefined}
            title={localeNames[locale]}
            className={cn(
              "rounded px-1 py-1 text-caption uppercase transition-colors duration-fast ease-brand",
              locale === current
                ? "text-atlas underline underline-offset-4"
                : "text-anthracite/70 hover:text-ink",
              // Même règle que la bascule de thème : 44 px au doigt.
              variant === "stacked" &&
                "inline-flex min-h-11 items-center justify-center px-4 py-2.5 text-body",
            )}
          >
            {variant === "stacked" ? localeNames[locale] : localeLabels[locale]}
          </button>
        </span>
      ))}
    </div>
  );
}
