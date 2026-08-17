# Adrar Media — Site Web

> **From Local to Global.**

Site web officiel d'Adrar Media, agence de communication, marketing digital et création de contenu au Maroc.

Le site n'est pas une vitrine : il fonctionne comme un commercial digital 24/7. Objectif de conversion principal — **demander un devis**. Objectif secondaire — **prendre contact**.

---

## Isolation du projet

Ce dossier est la **racine absolue** du site web Adrar Media. Tout fichier du site en est un descendant.

Ce projet est **indépendant** des autres projets présents sur la machine :

| Projet voisin | Chemin | Relation |
|---|---|---|
| Adrar OS | `/Users/mac/adrar-os` | Aucune. Intégration CRM future uniquement (voir plus bas). |
| Adrar OS V1 | `/Users/mac/ADRAR-OS-V1` | Aucune. |
| Projets clients | divers | Aucune. |

Aucun fichier extérieur à ce dossier n'est modifié, déplacé ou supprimé. Aucun `.git`, `.env`, `node_modules` ou configuration d'un autre projet n'est réutilisé.

---

## Stack

| Élément | Choix | Raison |
|---|---|---|
| Framework | Next.js 15 (App Router) | Aligné sur la stack interne Adrar OS |
| Langage | TypeScript 5.7 (strict) | Fiabilité, maintenabilité |
| Styles | Tailwind CSS 3.4 | Design system par tokens |
| Animation | Framer Motion 12 | Uniquement quand cela apporte de la valeur |
| Backend | **aucun** | Frontend performant > backend massif |

Aucune dépendance supplémentaire ne sera installée sans justification écrite dans ce README.

### Décisions d'architecture

1. **Pas de backend en V1.** Le formulaire de devis passe par une Server Action Next.js. NestJS/PostgreSQL ne seront introduits que si une fonctionnalité l'exige réellement.
2. **Pas de CMS en V1.** Le contenu vit dans `data/` en TypeScript typé. Les types sont calqués sur les entités métier pour qu'un CMS puisse s'y brancher plus tard sans refonte du front.
3. **Multilingue dès la V1.** Français, anglais et arabe, avec RTL complet et détection du pays. Implémenté sans librairie i18n — voir la section dédiée plus bas.
4. **Palette de référence.** Le site applique strictement la palette officielle ci-dessous. Adrar OS utilise des valeurs divergentes (`#0F2238`, `#1BA784`, `#3BC9A6`) : c'est un écart connu, à arbitrer côté Adrar OS ultérieurement. Rien n'est modifié dans Adrar OS depuis ce projet.

---

## Multilingue

Trois langues : **français** (défaut), **anglais**, **arabe** (RTL complet).

### Architecture

| Élément | Emplacement |
|---|---|
| Langues, mapping pays → langue, segments d'URL | `config/i18n.ts` |
| Traductions | `locales/{fr,en,ar}/*.json` |
| Résolution de langue | `lib/i18n/resolve-locale.ts` |
| Détection du pays | `lib/geolocation/detect-country.ts` |
| Routage localisé | `lib/i18n/routing.ts` |
| Redirections et réécritures | `middleware.ts` |

L'i18n est implémentée sans librairie. La chaîne de priorité et le mapping des URL localisées sont spécifiques au projet : une librairie aurait été contournée plus qu'utilisée.

### Chaîne de priorité

1. **Choix explicite de l'utilisateur** — cookie `adrar_locale`, valable un an
2. Langue présente dans l'URL — toujours servie telle quelle
3. Pays détecté par en-tête de requête
4. Langue du navigateur (`Accept-Language`)
5. Français

Un choix explicite n'est **jamais** contredit, y compris si l'utilisateur change de pays. Quand le pays recommanderait une autre langue et qu'aucun choix n'a été fait, l'interface propose — sans jamais imposer ni masquer le contenu.

### Détection du pays

Lecture d'un en-tête déjà présent sur la requête (`x-vercel-ip-country`, `cf-ipcountry`, et autres). **Aucun appel réseau**, donc aucune latence ajoutée au rendu et aucun risque de blocage. Aucune adresse IP n'est manipulée ni stockée, aucune position précise n'est demandée : seul un code pays sur deux lettres transite. Sans en-tête, repli immédiat sur `Accept-Language`.

### URL localisées

Une page, une URL par langue. Les variantes sont redirigées en 308.

```
/fr/realisations    /en/work        /ar/aamal
/fr/methode         /en/method      /ar/manhajiya
/fr/a-propos        /en/about       /ar/man-nahnu
```

### Traductions manquantes

Repli automatique sur le français, avec un avertissement `MISSING_TRANSLATION` en console de développement. L'utilisateur ne voit jamais une clé brute, `undefined` ou `null`.

---

## Identité

| Couleur | Hex | Usage |
|---|---|---|
| Atlas Green | `#1F7A63` | CTA, éléments actifs |
| Deep Digital Blue | `#0A2540` | Sections fortes |
| Earth Beige | `#D6C2A1` | Fonds secondaires |
| Anthracite | `#2B2B2B` | Texte |
| Light Green | `#3ED598` | Accent |

Direction artistique : **Premium / Editorial / Digital / Moroccan Modernism**. 80 % simplicité, 20 % caractère. Le caractère vient de la typographie, de la composition et du rythme — pas de la surcharge.

### Système de proportions

Les proportions sont calquées sur le système mesuré de la référence UX retenue (relevé au navigateur : styles calculés, rythme des sections, états de survol). On reprend un **système**, jamais une identité : couleurs, typographie, contenus et vocabulaire restent ceux d'Adrar Media.

| Token | Valeur | Rôle |
|---|---|---|
| Rayon `lg` | 33 px | Cartes, visuels de projet |
| Rayon `pill` | 999 px | Boutons, étiquettes, navigation |
| `display` | clamp(2.75rem, 7.4vw, 7.75rem) | Titre du Hero |
| Graisse des titres | 600, **casse normale** | Registre éditorial, pas brutaliste |
| Texte courant | 17 px | Présence à l'écran |
| `gutter` | clamp(1.25rem, 8.3vw, 8.75rem) | Marge horizontale de page **uniquement** |
| `grid` | clamp(1.5rem, 2.5vw, 2.5rem) | Écart entre colonnes |
| `duration-base` | 350 ms | Transition unique du site |
| `max-w-container` | 1400 px | Largeur de contenu |

> `gutter` et `grid` sont volontairement distincts. Appliquer la marge de page comme écart de grille multiplie sa valeur par le nombre de colonnes et fait déborder le conteneur — régression rencontrée et corrigée.

Aucune capitale forcée dans l'interface : l'arabe les supporte mal, et le registre visé repose sur la casse normale.

---

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement — http://localhost:3100
npm run build    # build de production
npm run start    # servir le build de production
npm run lint     # ESLint
npm run typecheck # TypeScript sans émission
```

Le port **3100** est utilisé volontairement pour ne jamais entrer en conflit avec Adrar OS (port 3000).

---

## Structure

```text
app/          routes (App Router)
components/   composants UI, regroupés par domaine
data/         contenu structuré : services, projets, témoignages, équipe, statistiques
lib/          logique métier, utilitaires, SEO, intégrations
hooks/        hooks React réutilisables
types/        types partagés
config/       configuration site : coordonnées, navigation, analytics
public/       assets statiques (brand, images, vidéos, icônes, fonts)
```

La logique métier ne vit pas dans les composants UI. Le contenu est séparé de la présentation.

---

## Environnement

Copier `.env.example` vers `.env.local` et renseigner les valeurs réelles.

```bash
cp .env.example .env.local
```

`.env.local` n'est jamais committé. Aucune clé API, aucun secret, aucun token ne doit apparaître côté frontend — seules les variables préfixées `NEXT_PUBLIC_` sont exposées au navigateur, et elles ne doivent contenir que des informations publiques.

---

## Règle de contenu — non négociable

**Rien n'est inventé.** Jamais de client, résultat, statistique, témoignage, coordonnée, certification, award, partenaire ou chiffre financier fictif.

Quand une donnée manque, le code porte un marqueur explicite : `CONTENT_REQUIRED`, `IMAGE_REQUIRED`, `DATA_REQUIRED` ou `TODO`. Ces marqueurs sont visibles dans le code, pas dans l'interface publique.

### Données réelles disponibles

- **Bricodi Pro** — matériaux / outillage. Résultat fourni par la direction : **516K+ vues Facebook pendant la phase de lancement**. Aucune autre métrique (ROI, leads, CA, taux de conversion) ne sera produite pour ce projet.

### Données manquantes bloquantes

| Donnée | Impact |
|---|---|
| Téléphone, WhatsApp, email, localisation | Pages Contact, Footer, bouton WhatsApp |
| URLs réseaux sociaux | Footer, structured data |
| Nom de domaine de production | `canonical`, `sitemap`, Open Graph, analytics |
| Statistiques Social Proof (4 chiffres réels) | Section Social Proof de la homepage |
| Visuels des réalisations + accord client | Portfolio et études de cas |
| Témoignages validés par les clients | Section Testimonials |
| Logo au format vectoriel (SVG) | Qualité de rendu et performance |

Tant que ces éléments ne sont pas fournis, les sections concernées restent des structures vides et éditables — jamais du contenu fictif.

### Confidentialité

Le projet Adrar OS contient des données internes sensibles (trésorerie, dettes, rémunérations, impayés clients nommés). **Aucune de ces données ne doit alimenter le site web**, y compris de façon dérivée ou agrégée.

---

## Intégration future Adrar OS / CRM

```text
Site web → Formulaire de devis → API → Adrar OS → CRM → Lead → Prospect → Client
```

L'architecture est préparée : la soumission du devis passera par une couche d'intégration isolée dans `lib/`, ce qui permettra de brancher Adrar OS sans toucher au formulaire ni aux composants.

**Cette intégration n'est pas développée** tant que les APIs Adrar OS ne sont pas définies. Adrar OS ne dispose actuellement d'aucun modèle `Lead` ou `QuoteRequest`.

---

## Avancement

| Phase | Objet | État |
|---|---|---|
| 01 | Dossier isolé | ✅ |
| 02 | Initialisation du projet | ✅ |
| 03 | Git | ✅ |
| 04 | Dépendances | ✅ |
| 05 | Design System | ✅ |
| 06 | Architecture i18n (FR / EN / AR) | ✅ |
| 07 | Détection du pays | ✅ |
| 08 | Navbar + Language Switcher + Footer | ✅ |
| 09 | Hero | à venir |
| 10 | Homepage complète | à venir |
| 11 | Portfolio + Case Studies | à venir |
| 12 | Services | à venir |
| 13 | À propos + Méthode | à venir |
| 14 | Contact + Formulaire de devis | à venir |
| 15 | SEO multilingue | à venir |
| 16 | Performance | à venir |
| 17 | Accessibilité | à venir |
| 18 | QA | à venir |

---

**ADRAR MEDIA — FROM LOCAL TO GLOBAL.**
