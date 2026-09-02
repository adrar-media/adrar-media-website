"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/**
 * Socle GSAP commun.
 *
 * Un seul endroit enregistre les greffons et traduit les jetons de mouvement
 * du système de design. Sans cela, chaque composant animé rappelle
 * `registerPlugin` et réécrit ses propres courbes — et le jour où l'une d'elles
 * change dans tailwind.config.ts, la moitié du site continue d'utiliser
 * l'ancienne.
 *
 * LES COURBES SONT REPRISES À L'IDENTIQUE, PAS APPROXIMÉES.
 *
 * `power3.out` ressemble beaucoup à la courbe `brand`, mais « beaucoup » n'est
 * pas « exactement » : la révélation est jouée des dizaines de fois sur une
 * page, à côté de transitions CSS qui, elles, gardent la vraie courbe. Deux
 * mouvements presque identiques se remarquent plus qu'un seul mouvement franc.
 * `CustomEase` accepte la notation cubic-bezier telle qu'elle est écrite dans
 * le système, donc la parité est stricte et le jeton reste la source.
 *
 * Les valeurs ci-dessous doivent rester alignées sur
 * `theme.extend.transitionTimingFunction` (tailwind.config.ts).
 *
 * SPLITTEXT ET DRAWSVG sont désormais enregistrés ici. Depuis GSAP 3.13 ils
 * sont inclus dans le paquet public — aucune licence à fournir, aucun fichier
 * à héberger à part. Ils portent les deux mouvements signature du site : la
 * découpe des titres et le tracé du logo à l'écran de chargement.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin);

/** Révélations et déplacements de masse. */
export const EASE_BRAND = CustomEase.create("brand", "0.22, 1, 0.36, 1");

/** Entrées qui doivent se remarquer — départ sec, arrivée longue. */
export const EASE_ENTRANCE = CustomEase.create("entrance", "0.16, 1, 0.3, 1");

/**
 * Durées, en secondes. GSAP compte en secondes là où le système de design
 * compte en millisecondes ; la conversion vit ici plutôt qu'à chaque appel.
 */
export const REVEAL_DURATION = 0.7;
export const SETTLE_DURATION = 1.2;

/**
 * Décalage entre deux entrées d'une cascade, et plafond du décalage total.
 *
 * Le plafond reprend la règle de l'ancien système : au-delà de sept rangs, la
 * cascade cesse d'être un rythme et devient une attente — la dernière carte
 * d'une grille de douze arriverait plus d'une demi-seconde après la première.
 * GSAP l'exprime par `amount`, qui répartit un total sur l'ensemble des
 * éléments au lieu de multiplier un pas par leur nombre.
 */
export const STAGGER_STEP = 0.06;
export const STAGGER_MAX = STAGGER_STEP * 7;

/**
 * Cascade des caractères d'un titre.
 *
 * Bien plus serrée que celle des blocs : un titre se lit d'un seul tenant, et
 * un décalage par lettre perceptible le transformerait en machine à écrire.
 * Réparti sur l'ensemble (`amount`), le total reste sous la demi-seconde quel
 * que soit le nombre de lettres — une accroche de huit mots ne met pas trois
 * fois plus longtemps à se poser qu'une accroche de trois.
 */
export const CHAR_STAGGER_AMOUNT = 0.4;

/**
 * Point de déclenchement.
 *
 * Le seuil est bas et la marge négative : la révélation part quand le bloc est
 * franchement entré, pas au premier pixel, pour que la montée se termine dans
 * l'écran au lieu de s'achever hors champ. C'est la traduction directe du
 * `threshold: 0.08` / `rootMargin: -10%` de l'observateur qu'il remplace.
 */
export const REVEAL_START = "top 90%";

/**
 * Déclenchement des titres — nettement plus tardif que celui des blocs.
 *
 * Un titre découpé lettre par lettre est le mouvement le plus visible de la
 * page : parti à 90 % de la hauteur, il s'achève avant que le lecteur ait eu
 * le temps de poser les yeux dessus, et il ne reste que le résultat. À 82 %,
 * la découpe se joue pendant qu'on la regarde.
 */
export const HEADLINE_START = "top 82%";

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
