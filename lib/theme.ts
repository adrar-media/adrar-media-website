/**
 * Clé de stockage du CHOIX de thème.
 *
 * Elle vit dans un module ordinaire, et non aux côtés du composant de bascule.
 * `ThemeToggle` est marqué `"use client"` : une constante exportée depuis un
 * module client et importée par un composant serveur n'est pas transmise
 * telle quelle — le serveur reçoit une référence client, qui vaut `undefined`
 * à l'évaluation. Le script posé en tête de document lisait donc
 * `localStorage.getItem(undefined)` et ne retrouvait jamais le choix du
 * visiteur : le thème sombre ne survivait pas au rechargement.
 *
 * Un module neutre est lisible des deux côtés, et la clé reste écrite une
 * seule fois.
 */
export const THEME_STORAGE_KEY = "adrar-theme";

/** Les trois états possibles. `system` suit le réglage du système. */
export type Theme = "light" | "dark" | "system";

/** Ce que la feuille de style sait peindre. `system` n'en fait pas partie. */
export type ResolvedTheme = "light" | "dark";

/**
 * LE THÈME OFFICIEL DU SITE.
 *
 * C'est ce que voit un visiteur qui n'a jamais rien choisi — donc la quasi-
 * totalité d'entre eux, et la version dans laquelle la marque se présente. Le
 * clair reste disponible, mais il est devenu la préférence d'un visiteur, pas
 * l'identité du site.
 *
 * Rien d'autre dans le code ne décide de ce défaut : la feuille de style pose
 * la palette sombre sur `:root` nu, le document est rendu avec cet attribut, et
 * le script de tête ne le change que si un choix a été enregistré. Changer
 * cette constante NE SUFFIT PAS à basculer le site — il faudrait aussi inverser
 * les deux blocs de `globals.css`. Le commentaire est ici pour éviter qu'on le
 * croie.
 */
export const DEFAULT_THEME: ResolvedTheme = "dark";

/**
 * Script posé en tête de document, avant toute peinture.
 *
 * IL DOIT RESTER SYNCHRONE ET BLOQUANT. Tout ce qui s'exécute après le premier
 * rendu arrive trop tard : la page serait peinte dans le thème officiel puis
 * repeinte dans celui du visiteur, ce qui donne l'éclair blanc que tout le
 * monde connaît sur les sites sombres.
 *
 * IL RÉSOUT « SYSTÈME » ICI, ET C'EST TOUT L'INTÉRÊT. L'attribut écrit sur
 * `<html>` ne vaut jamais « system » : il vaut `dark` ou `light`, jamais autre
 * chose. La feuille de style n'a donc pas de requête média à porter, et les
 * utilitaires `dark:` de Tailwind — qui ne savent lire qu'un attribut — voient
 * exactement le même état que la palette. C'est ce qui manquait avant : en
 * système sombre, la palette basculait mais le logo restait en version claire.
 *
 * Écrit à la main plutôt que compilé : ce qui part dans le document doit être
 * lisible tel quel, et tenir en une ligne qu'on peut relire.
 */
export const themeScript = `try{
var c=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var r=c==="light"||c==="dark"?c:(c==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):${JSON.stringify(
  DEFAULT_THEME,
)});
document.documentElement.dataset.theme=r;
}catch(e){}`.replace(/\n/g, "");
