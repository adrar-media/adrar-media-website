/**
 * Layout racine.
 *
 * Volontairement transparent : les balises <html> et <body> sont rendues par
 * app/[locale]/layout.tsx, seul endroit où la langue et la direction du texte
 * sont connues. Toute URL passe par le middleware, qui garantit la présence
 * d'un segment de langue.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
