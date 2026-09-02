# Mise en ligne — Adrar Media

Ce document est la marche à suivre complète, du dépôt au domaine. Il ne
suppose aucune connaissance préalable de l'hébergement.

---

## 1. Ce qui doit être décidé avant

| Élément | Pourquoi c'est bloquant | Où le renseigner |
|---|---|---|
| Nom de domaine de production | URL canoniques, sitemap, image de partage, données structurées | `NEXT_PUBLIC_SITE_URL` |
| E-mail, téléphone, WhatsApp, ville | Pages Contact et pied de page ; sans eux, ces blocs restent masqués | `NEXT_PUBLIC_CONTACT_*`, `NEXT_PUBLIC_PHONE_*`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_LOCATION` |
| URLs des réseaux sociaux | Pied de page et champ `sameAs` des données structurées | `NEXT_PUBLIC_*_URL` |
| Boîte de réception des formulaires | Envoi automatique vers `contact@adrar.media` | `EMAIL_API_KEY`, `QUOTE_NOTIFICATION_FROM` |

Le site **fonctionne sans ces valeurs** : chaque bloc concerné se masque de
lui-même et le formulaire bascule sur l'envoi manuel. Rien n'est cassé, mais
le site tourne alors en dessous de ses moyens.

Les mentions légales attendent en plus des informations réglementaires
(immatriculation, siège, directeur de publication, hébergeur). Elles sont
listées nommément sur la page `/mentions-legales` tant qu'elles manquent.

---

## 2. Hébergement recommandé — Vercel

Next.js est développé par Vercel : middleware, rendu par langue, images et
en-têtes y fonctionnent sans configuration. Aucun fichier de déploiement n'est
nécessaire dans ce dépôt.

1. Pousser le dépôt sur GitHub.
2. Sur vercel.com : **Add New → Project**, choisir le dépôt.
   Framework détecté : *Next.js*. Ne rien changer aux commandes proposées.
3. **Environment Variables** : recopier les valeurs de `.env.example`
   renseignées, pour les environnements *Production* **et** *Preview*.
4. **Deploy**.
5. **Settings → Domains** : ajouter le domaine, puis créer chez le registrar
   l'enregistrement DNS indiqué par Vercel. Le certificat HTTPS est émis seul.

### Autre hébergeur

Tout hébergeur Node fonctionne (Netlify, Railway, Render, VPS) :

```bash
npm ci
npm run build
npm run start   # écoute sur le port 3100
```

Node 20 ou plus est requis (`package.json` → `engines`).

Sur un VPS, placer un reverse proxy (nginx, Caddy) devant le port 3100 pour le
TLS. **Un export statique n'est pas possible** : le site utilise un middleware
pour résoudre la langue et une action serveur pour le formulaire.

---

## 3. Détection du pays

La langue proposée au premier accès vient d'un en-tête de requête posé par
l'hébergeur : `x-vercel-ip-country` sur Vercel, `cf-ipcountry` derrière
Cloudflare, et quelques équivalents.

Sans cet en-tête, le site se rabat sur la langue du navigateur, puis sur le
français. Rien ne casse — la détection est simplement moins précise.

---

## 4. Après la mise en ligne

1. `https://VOTRE-DOMAINE/robots.txt` — doit mentionner le sitemap.
2. `https://VOTRE-DOMAINE/sitemap.xml` — doit lister les trois langues.
3. Partager une URL sur WhatsApp ou LinkedIn : la vignette de marque doit
   apparaître.
4. Envoyer une demande de devis de test et vérifier sa réception.
5. Google Search Console : ajouter la propriété, déposer le sitemap.
6. Tester `/{langue}/styleguide` : doit renvoyer 404 en production.

---

## 5. Régénérer les visuels de marque

Icônes, favicon et images de partage sont produits par un script, à partir du
seul fichier `public/brand/adrar-media-mark.svg` :

```bash
node scripts/generate-brand-assets.mjs
```

À relancer si la marque, l'accroche de partage ou les couleurs changent. Les
fichiers produits sont versionnés : le build n'en dépend pas.

---

## 6. Envoi des demandes de devis

L'envoi automatique passe par [Resend](https://resend.com), appelé en HTTP
direct — aucune dépendance n'est ajoutée au projet.

1. Créer un compte, vérifier le domaine d'envoi (enregistrements DNS fournis
   par Resend).
2. Créer une clé d'API → `EMAIL_API_KEY`.
3. Définir `QUOTE_NOTIFICATION_FROM` avec un expéditeur du domaine vérifié,
   par exemple `Site Adrar Media <no-reply@adrar.media>`.

La destination `contact@adrar.media` est fixée côté serveur. Tant que la clé et
l'expéditeur ne sont pas tous les deux présents, le formulaire ne
prétend pas envoyer : il compose le message et propose au visiteur de le
transmettre par e-mail ou WhatsApp.

Pour un autre prestataire (Postmark, Brevo, SendGrid), seul
`lib/leads/email.ts` change — une requête HTTP. Ni le formulaire ni la
validation ne sont concernés.

---

## 7. Mesure d'audience

Renseigner `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` ou
`NEXT_PUBLIC_TIKTOK_PIXEL_ID` active la bannière de consentement. Aucun script
n'est chargé avant un accord explicite ; l'absence de réponse vaut refus.

Sans identifiant, aucune bannière ne s'affiche : il n'y aurait rien à
consentir.

---

## 8. Contenu à publier après coup

Ces éléments s'ajoutent sans toucher au code — le site les affiche dès qu'ils
existent, et les masque tant qu'ils n'existent pas.

| Contenu | Fichier | Effet |
|---|---|---|
| Témoignages clients validés | `data/testimonials.ts` | Fait apparaître la section Témoignages sur l'accueil |
| Membres de l'équipe | `data/team.ts` | Remplace le texte d'attente de la page À propos par la grille |
| Résultats chiffrés sourcés | `data/statistics.ts` | Alimente la section Résultats |
| Nouveaux projets | `data/projects.ts` | Portfolio, page projet, sitemap |

Règle inchangée : **aucun chiffre sans source, aucun témoignage sans accord
écrit du client.**
