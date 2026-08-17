import {
  countryLanguageMap,
  defaultLocale,
  fallbackCountryLocale,
  isLocale,
  locales,
  type Locale,
} from "@/config/i18n";
import {
  detectCountry,
  parseAcceptLanguage,
} from "@/lib/geolocation/detect-country";

/** Origine de la langue retenue — utile au débogage et aux tests. */
export type LocaleSource =
  | "user-preference"
  | "country"
  | "browser"
  | "fallback";

export interface LocaleResolution {
  locale: Locale;
  source: LocaleSource;
  country: string | null;
  /** Langue que le pays détecté suggérerait, si différente du résultat. */
  suggested: Locale | null;
}

export function languageForCountry(country: string | null): Locale {
  if (!country) return defaultLocale;
  return countryLanguageMap[country] ?? fallbackCountryLocale;
}

/**
 * Chaîne de priorité (PROMPT §09) :
 *   1. choix explicite de l'utilisateur, mémorisé en cookie
 *   2. pays détecté par en-tête
 *   3. langue du navigateur
 *   4. français
 *
 * La langue présente dans l'URL est traitée en amont par le middleware : une
 * URL localisée est toujours servie telle quelle, sans redirection.
 */
export function resolveLocale(
  headers: Headers,
  savedPreference: string | undefined,
): LocaleResolution {
  const country = detectCountry(headers);
  const countryLocale = country ? languageForCountry(country) : null;

  if (savedPreference && isLocale(savedPreference)) {
    return {
      locale: savedPreference,
      source: "user-preference",
      country,
      // Ne suggère que si le pays recommanderait autre chose que le choix fait.
      suggested:
        countryLocale && countryLocale !== savedPreference
          ? countryLocale
          : null,
    };
  }

  if (countryLocale) {
    return { locale: countryLocale, source: "country", country, suggested: null };
  }

  const browser = parseAcceptLanguage(headers.get("accept-language"), locales);
  if (browser && isLocale(browser)) {
    return { locale: browser, source: "browser", country, suggested: null };
  }

  return { locale: defaultLocale, source: "fallback", country, suggested: null };
}
