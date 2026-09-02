"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/errors/ErrorView";

/**
 * Frontière d'erreur d'une page.
 *
 * Sans elle, une exception au rendu remplace la page entière par l'écran
 * technique de Next. Ici, la navigation et le pied de page restent en place :
 * seule la zone en échec est remplacée, et `reset` permet de retenter sans
 * recharger.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Trace serveur/navigateur : sans journal, un incident de production reste
    // invisible tant qu'un visiteur ne le signale pas.
    console.error("[adrar] erreur de rendu", error);
  }, [error]);

  return <ErrorView reset={reset} digest={error.digest} />;
}
