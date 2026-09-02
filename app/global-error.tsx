"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Dernier filet.
 *
 * Ne se déclenche que si le layout racine lui-même échoue — la frontière
 * `app/[locale]/error.tsx` couvre tout le reste. À ce stade, aucune donnée de
 * langue n'est disponible et aucun composant du site ne peut être monté : la
 * page est donc volontairement autonome, sans dépendance ni traduction.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[adrar] erreur globale", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-canvas text-anthracite antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-container flex-col justify-center px-gutter py-24">
          <h1 className="text-h2 text-ink">
            Une erreur est survenue · Something went wrong
          </h1>
          <p className="mt-6 max-w-prose text-body text-anthracite/70">
            Le site n&apos;a pas pu s&apos;afficher. Réessayez dans un instant.
          </p>
          {error.digest && (
            <p className="mt-4 text-caption text-anthracite/70">
              Référence : {error.digest}
            </p>
          )}
          <div className="mt-12">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2.5 rounded-pill bg-atlas px-8 py-4 text-button text-canvas transition duration-base hover:bg-atlas-dark"
            >
              Réessayer · Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
