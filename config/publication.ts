import approvals from "./project-media-approvals.json";

/**
 * Une référence d'accord écrit par projet (date + référence interne, sans
 * donnée confidentielle). Ne rien inscrire sans accord réellement obtenu.
 * L'absence d'accord retire les médias du rendu ET ferme leurs URL publiques.
 */
export const projectMediaApprovals: Readonly<Record<string, string>> = approvals;

export const isProjectMediaApproved = (slug: string): boolean =>
  Boolean(projectMediaApprovals[slug]?.trim());

export function canServeProjectMedia(pathname: string): boolean {
  if (!pathname.startsWith("/images/projects/")) return true;
  const name = pathname.slice("/images/projects/".length);
  return Object.entries(projectMediaApprovals).some(([slug, evidence]) =>
    Boolean(evidence.trim()) && (name.startsWith(`${slug}/`) || name.startsWith(`${slug}-logo.`)),
  );
}
