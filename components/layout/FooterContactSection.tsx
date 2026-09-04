"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FooterContactSectionProps {
  contactHref: string;
  children: ReactNode;
}

const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

/** Masque l'ancienne occurrence du formulaire sur la page Contact seule. */
export function FooterContactSection({
  contactHref,
  children,
}: FooterContactSectionProps) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  /*
   * `usePathname()` peut voir le segment interne après le middleware (notamment
   * /ar/contact pour l'URL publique /ar/tawasul) pendant le rendu serveur.
   * Le navigateur hydrate pourtant avec l'URL publique. Décider du rendu
   * pendant le render produisait donc deux arbres différents et React #418.
   * Le premier rendu reste identique, puis l'effet masque le doublon après
   * l'hydratation avec le pathname réellement visible par le visiteur.
   */
  useEffect(() => {
    setHidden(normalizePath(pathname) === normalizePath(contactHref));
  }, [pathname, contactHref]);

  if (hidden) return null;

  return children;
}
