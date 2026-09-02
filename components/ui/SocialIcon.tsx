import type { SocialKey } from "@/config/site";

/**
 * Pictogrammes des réseaux, plus WhatsApp.
 *
 * POURQUOI DES TRACÉS ÉCRITS ICI PLUTÔT QU'UNE BIBLIOTHÈQUE D'ICÔNES
 *
 * Une dépendance d'icônes (react-icons et consorts) apporte plusieurs milliers
 * de tracés pour en utiliser cinq, et impose son propre gabarit de taille et de
 * couleur. Cinq `<path>` écrits une fois pèsent quelques centaines d'octets,
 * héritent de `currentColor` et se dimensionnent avec le texte autour.
 *
 * TOUS LES TRACÉS SONT CALÉS SUR UNE GRILLE 24 × 24 et dessinés en aplat
 * (`fill`) plutôt qu'en filet : à 20 px, un contour de 1,5 px sur le logo
 * Instagram — trois formes imbriquées — devient une tache. L'aplat reste
 * lisible jusqu'à 16 px.
 *
 * L'ICÔNE N'EST JAMAIS SEULE POUR QUI NE LA VOIT PAS. Elle est purement
 * décorative (`aria-hidden`) ; c'est au lien qui l'enveloppe de porter le nom
 * du réseau, en texte visuellement masqué ou en `aria-label`. Une icône
 * étiquetée « instagram » sans lien nommé laisse un lecteur d'écran annoncer un
 * lien sans destination.
 */

type IconName = SocialKey | "whatsapp";

/** Tracés officiels simplifiés, grille 24 × 24, remplissage plein. */
const PATHS: Record<IconName, string> = {
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.81 3.81 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
  facebook:
    "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z",
  tiktok:
    "M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.2a2.6 2.6 0 0 1-2.6 2.6 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.78.12v-3.4a6 6 0 0 0-.78-.05 5.99 5.99 0 1 0 5.99 5.99V8.9a7.5 7.5 0 0 0 4.37 1.4V7a4.28 4.28 0 0 1-3.4-1.18z",
  whatsapp:
    "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98.99-3.63-.23-.37a9.79 9.79 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.79 9.8zM20.52 3.45A11.7 11.7 0 0 0 12.05 0C5.58 0 .32 5.26.32 11.73c0 2.07.54 4.09 1.57 5.87L.22 24l6.55-1.72a11.7 11.7 0 0 0 5.28 1.26h.01c6.47 0 11.73-5.26 11.73-11.73a11.66 11.66 0 0 0-3.27-8.36z",
};

interface SocialIconProps {
  name: IconName;
  className?: string;
}

export function SocialIcon({ name, className }: SocialIconProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
