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
3. **Prêt pour le multilingue.** Le français est la seule langue de la V1, mais la copy est isolée pour permettre l'ajout de l'arabe et de l'anglais sans reconstruire le front.
4. **Palette de référence.** Le site applique strictement la palette officielle ci-dessous. Adrar OS utilise des valeurs divergentes (`#0F2238`, `#1BA784`, `#3BC9A6`) : c'est un écart connu, à arbitrer côté Adrar OS ultérieurement. Rien n'est modifié dans Adrar OS depuis ce projet.

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
| 05 | Design System | à venir |
| 06 | Navbar + Footer | à venir |
| 07 | Homepage | à venir |
| 08 | Test Homepage | à venir |
| 09 | Pages internes | à venir |
| 10 | Portfolio + Case Studies | à venir |
| 11 | Contact + Formulaire de devis | à venir |
| 12 | SEO | à venir |
| 13 | Performance | à venir |
| 14 | Accessibilité | à venir |
| 15 | QA | à venir |

---

**ADRAR MEDIA — FROM LOCAL TO GLOBAL.**
