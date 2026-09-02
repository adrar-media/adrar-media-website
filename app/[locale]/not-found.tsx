import { headers } from "next/headers";
import { defaultLocale, isLocale } from "@/config/i18n";
import { localeHeader } from "@/middleware";
import { NotFoundView } from "@/components/errors/NotFoundView";

/**
 * 404 à l'intérieur d'une langue.
 *
 * S'affiche dans la coque du site — navigation, pied de page, langue et
 * direction du texte corrects — pour que le visiteur reparte d'où il est
 * plutôt que de fermer l'onglet.
 *
 * Une frontière `not-found` ne reçoit pas les paramètres de route : la langue
 * est lue dans l'en-tête posé par le middleware. En son absence — appel hors
 * middleware — le français s'applique, comme partout ailleurs.
 */
export default async function NotFound() {
  const headerList = await headers();
  const value = headerList.get(localeHeader) ?? "";
  const locale = isLocale(value) ? value : defaultLocale;

  return <NotFoundView locale={locale} />;
}
