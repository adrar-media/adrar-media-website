/**
 * Injection d'un bloc JSON-LD.
 *
 * Rendu côté serveur dans le HTML servi : un moteur ne doit pas avoir à
 * exécuter de script pour lire l'identité de l'entreprise.
 *
 * `dangerouslySetInnerHTML` est ici le seul moyen d'écrire un script inline ;
 * la donnée est sérialisée par `JSON.stringify` et le `<` échappé, ce qui
 * ferme le seul vecteur réel — une chaîne contenant `</script>` qui
 * refermerait la balise et laisserait passer du balisage.
 */
export function JsonLd({ data }: { data: (Record<string, unknown> | null)[] }) {
  const blocks = data.filter(Boolean) as Record<string, unknown>[];
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
