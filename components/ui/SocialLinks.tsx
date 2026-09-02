import { activeSocials, whatsappLink } from "@/config/site";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface SocialLinksProps {
  /** Libellé accessible de la liste — « Suivez-nous », déjà traduit. */
  label: string;
  /** Nom du canal WhatsApp, déjà traduit. Sert d'étiquette au lien. */
  whatsappLabel: string;
  /**
   * Fond sur lequel la rangée est posée. Le pied de page est sombre, la page
   * Contact est claire : les deux jeux de contrastes ne sont pas
   * interchangeables et une seule paire de classes ne peut pas servir aux deux.
   */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Rangée d'icônes : WhatsApp d'abord, puis les comptes configurés.
 *
 * WHATSAPP EST DANS LA MÊME RANGÉE QUE LES RÉSEAUX, ET C'EST UN CHOIX.
 *
 * Il était auparavant une ligne de texte perdue au milieu des numéros et des
 * adresses, où il se lisait comme une quatrième coordonnée à recopier. C'est
 * pourtant le canal le plus utilisé au Maroc, et le seul de la colonne qui
 * ouvre une conversation en un geste. Posé en tête de la rangée d'icônes, il
 * est reconnu avant d'être lu.
 *
 * CHAQUE ICÔNE PORTE SON NOM EN TEXTE MASQUÉ, pas en `title` ni en `alt` : un
 * lien dont le contenu accessible est vide est annoncé par son URL, et
 * « wa point me slash deux un deux six six trois… » n'est une destination pour
 * personne.
 *
 * La cible tactile fait 44 px de côté (`h-11 w-11`) alors que le pictogramme
 * n'en fait que 20 : c'est le minimum recommandé pour le doigt, et il ne se
 * voit pas — seule la pastille au survol trahit sa taille.
 *
 * Rien n'est rendu tant qu'aucun canal n'est configuré : voir `socials` dans
 * `config/site.ts`, où un compte non communiqué reste vide.
 */
export function SocialLinks({
  label,
  whatsappLabel,
  tone = "light",
  className,
}: SocialLinksProps) {
  const whatsapp = whatsappLink();
  const accounts = activeSocials();

  if (!whatsapp && accounts.length === 0) return null;

  const item =
    tone === "dark"
      ? "text-white/70 hover:bg-white/10 hover:text-white"
      : "text-anthracite/70 hover:bg-anthracite/[0.06] hover:text-atlas";

  const links = [
    ...(whatsapp
      ? [{ key: "whatsapp" as const, label: whatsappLabel, url: whatsapp }]
      : []),
    ...accounts,
  ];

  return (
    <ul
      aria-label={label}
      className={["-ms-2.5 flex flex-wrap items-center gap-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      {links.map((link) => (
        <li key={link.key}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-11 w-11 items-center justify-center rounded-pill transition duration-fast ease-brand active:scale-95 ${item}`}
          >
            <SocialIcon name={link.key} className="h-5 w-5" />
            <span className="sr-only">{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
