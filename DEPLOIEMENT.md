# Publication — Adrar Media

## État au 31 octobre 2026

Le code contient déjà les coordonnées et la localisation confirmées, Instagram,
LinkedIn, le domaine `https://adrar.media`, le logo PNG et des médias clients.
Le README historique ne reflétait pas tous ces ajouts.

Ne pas confondre présence d'un fichier avec accord de publication. Aucun accord
client écrit n'est référencé dans le dépôt : les médias sont donc masqués dans
les pages et fermés par le middleware, y compris via `/_next/image`.
Les fichiers restent conservés dans le dépôt. Le dépôt GitHub étant public,
ce filtrage du site ne retire pas les fichiers de GitHub ni d'anciens caches.

## 1. P0 — configuration et conversion

- [ ] Confirmer que `https://adrar.media` est le domaine principal ; définir
  `NEXT_PUBLIC_SITE_URL` avant le build si le domaine principal est différent.
  Ne pas ajouter `/fr`, une requête ou un fragment à cette variable.
- [ ] Vérifier les DNS, le certificat HTTPS et la redirection de l'autre forme
  du domaine (www / sans www) vers le domaine principal retenu.
- [ ] Confirmer l'activité des coordonnées déjà présentes dans `config/site.ts` :
  mobile, fixe, WhatsApp, email commercial, recrutement et localisation.
- [ ] Renseigner les surcharges publiques dans l'environnement de l'hébergeur
  **avant le build**. Next fige les `NEXT_PUBLIC_` à la compilation : modifier
  une variable impose un nouveau build et un nouveau déploiement.
- [ ] Choisir le mode de réception : automatique avec Resend, ou manuel avec
  boutons email/WhatsApp. En mode manuel le visiteur doit encore envoyer son
  message ; le site ne confirme pas une réception automatique.
- [ ] Pour Resend : vérifier le domaine d'envoi chez Resend, puis renseigner
  `EMAIL_API_KEY` et `QUOTE_NOTIFICATION_FROM` côté serveur uniquement.
  Le destinataire est `contact@adrar.media`, fixé dans `lib/leads/email.ts`.
- [ ] Tester les deux formulaires sur l'hébergement final et constater la
  réception réelle. Une réponse du fournisseur ne prouve pas l'arrivée en boîte.

Aucun secret n'est à mettre dans Git, dans `.env.example` ou dans une variable
`NEXT_PUBLIC_`. Le contrôle refuse une configuration partielle de transport.
Sans transport, il avertit et conserve le repli manuel.

## 2. P1 — contenu et droits

| Élément | Traitement prêt dans le code | Action externe restante |
|---|---|---|
| Réseaux | Instagram/LinkedIn présents ; Facebook/TikTok masqués | Fournir uniquement les comptes officiels supplémentaires |
| Statistiques générales | Section masquée car tableau vide | Fournir quatre chiffres réels avec leurs sources si souhaité |
| Résultat Bricodi Pro | 516K+ vues Facebook, phase de lancement | Ne pas extrapoler de ROI, leads ou CA |
| Médias clients | Masqués et URL fermées | Obtenir les accords ; inscrire une référence non confidentielle par slug dans `config/project-media-approvals.json`, puis reconstruire |
| Témoignages | Section masquée | Ajouter le texte approuvé dans `data/testimonials.ts`, `approved: true` et une `approvalReference` réelle |
| Logo | PNG existant conservé | Fournir le SVG officiel complet ; ne pas confondre le symbole auxiliaire `adrar-media-mark.svg` avec ce logo |

Les projets textuels existants restent disponibles. Les accords et justificatifs
complets restent hors du dépôt public : seule une référence interne non sensible
y est inscrite. Aucun accord n'est supposé ou fabriqué.

Lors du remplacement du logo, mettre à jour tous ses usages, puis exécuter
`node scripts/generate-brand-assets.mjs` si le symbole source ou les visuels de
partage changent. Vérifier favicon et partage FR/EN/AR. Les assets de `/public`
sont revalidés après une heure ; un CDN tiers peut nécessiter sa propre purge.

## 3. P2 — intégrations facultatives

- Analytics : laisser les trois identifiants vides si aucun compte n'est fourni.
  Aucune bannière ni script de suivi n'est alors chargé. Si activé : tester
  l'absence de requêtes avant consentement et après refus, puis le chargement
  après acceptation. Utiliser les identifiants du compte réel.
- CRM : laisser `ADRAR_OS_API_URL` et `ADRAR_OS_API_KEY` vides tant qu'Adrar OS
  n'offre pas d'endpoint Lead compatible. Le CRM ne conditionne pas l'envoi
  email ; son échec ne doit pas perdre une demande déjà transmise.
- Search Console : vérifier la propriété du domaine et soumettre le sitemap.

## 4. Ordre exact de recette

1. Arrêter les contenus et accords disponibles ; conserver le masquage des autres.
2. Valider domaine, coordonnées et mode de réception.
3. Configurer l'environnement de build et les secrets serveur chez l'hébergeur.
4. Installer les dépendances : `npm ci` (Node >= 20 ; CI sur Node 22).
5. Exécuter `npm run verify` : lint → typage → tests de configuration et de transport simulé →
   contrôle d'environnement → build. Corriger chaque échec avant de poursuivre.
6. Exécuter `npm run smoke:production`. Ce script démarre lui-même le build
   sur `localhost:3310`, vérifie les routes du sitemap et ferme le serveur.
   `SMOKE_PORT` permet de changer le port. Le scénario standard utilise les
   coordonnées confirmées et le registre de médias vide du dépôt.
7. Examiner en navigateur mobile et ordinateur : navigation, formulaires,
   FR/EN/AR, RTL, clavier, images, erreurs et consentement éventuel.
8. Déployer sur une préproduction Next.js avec middleware et actions serveur.
   Un export statique seul n'est pas compatible. Empêcher l'indexation de cette
   préproduction dans les réglages de l'hébergeur.
9. Sur cette préproduction, tester les deux formulaires, leur réception ou leur
   repli manuel et le comportement lors d'une panne du service d'envoi.
10. Vérifier les URL canoniques par page, `hreflang`, `/sitemap.xml`,
    `/robots.txt`, les partages et la fermeture de `/fr/styleguide`,
    `/en/styleguide` et `/ar/styleguide` (404).
11. Publier le même commit avec les variables de production validées.
12. Contrôler immédiatement HTTPS, redirections, accueil FR/EN/AR, formulaires,
    réception et sitemap. Garder le déploiement précédent pour retour arrière.

Le workflow `.github/workflows/quality.yml` exécute les contrôles techniques sur
les PR et les pushes sur `main`. Il ne configure pas l'hébergement et ne remplace
pas la recette humaine, les accords clients ou le contrôle de réception.

## 5. Hébergement

L'identité légale versionnée mentionne Netlify. Conserver l'hébergeur réel dans
`NEXT_PUBLIC_HOST_NAME` et `NEXT_PUBLIC_HOST_ADDRESS` ; les corriger si le site
change d'hébergeur. Sur Netlify, utiliser la prise en charge Next.js avec rendu
serveur, middleware et actions serveur. Sur un serveur Node autonome :

```bash
npm ci
npm run verify
npm run start
```

Le serveur écoute sur le port 3100. Sur VPS, placer un reverse proxy HTTPS en
amont. Ne pas mélanger les fichiers ou secrets avec Adrar OS ou un autre projet.
