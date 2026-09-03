"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

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

  if (normalizePath(pathname) === normalizePath(contactHref)) return null;

  return children;
}
