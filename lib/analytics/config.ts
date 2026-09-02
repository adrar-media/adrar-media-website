/**
 * Identifiants de mesure d'audience.
 *
 * Aucun n'est écrit en dur : un identifiant de suivi appartient au compte du
 * client, pas au code. Tant qu'aucun n'est renseigné, aucun script tiers n'est
 * chargé et aucune bannière de consentement n'est affichée — il n'y aurait
 * rien à consentir.
 *
 * Ces valeurs sont publiques par nature (elles apparaissent dans le HTML de
 * tout site qui les utilise) : le préfixe NEXT_PUBLIC_ est ici légitime.
 *
 * LES TROIS LECTURES SONT ÉCRITES EN TOUTES LETTRES, ET C'EST LA SEULE FORME
 * QUI FONCTIONNE.
 *
 * Ce fichier passait par un utilitaire `env(key)` qui lisait `process.env[key]`
 * — une lecture par clé calculée. Or le remplacement des variables NEXT_PUBLIC_
 * dans le paquet client est une SUBSTITUTION DE TEXTE opérée à la compilation :
 * elle ne reconnaît que la forme littérale `process.env.NEXT_PUBLIC_XXX`. Une
 * lecture indexée n'est pas reconnue, rien n'est substitué, et `process.env`
 * vaut `{}` dans le navigateur.
 *
 * La panne était silencieuse et complète : `hasAnalytics()` est appelé côté
 * serveur (`components/consent/Consent.tsx`), où `process.env` est réel — la
 * bannière de consentement s'affichait donc normalement. `Analytics` est un
 * composant client : il relisait les mêmes clés dans le navigateur, obtenait
 * trois chaînes vides, et ne montait aucun script. Le site demandait au
 * visiteur d'accepter une mesure d'audience qui n'existait pas, et pas un seul
 * événement n'était remonté à GA4, Meta ou TikTok.
 *
 * Vérification, si ces lignes sont retouchées un jour : construire avec un
 * identifiant de test, puis le chercher dans le paquet client.
 *
 *   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-TEST npm run build
 *   grep -rl "G-TEST" .next/static/chunks/
 *
 * La commande doit trouver un fichier. Si elle n'en trouve aucun, la mesure
 * d'audience est de nouveau morte.
 */

const clean = (value: string | undefined): string => value?.trim() ?? "";

export const analyticsIds = {
  ga4: clean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID),
  metaPixel: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  tiktokPixel: clean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
} as const;

export const hasAnalytics = (): boolean =>
  Object.values(analyticsIds).some((id) => id.length > 0);
