# HomeMatch

HomeMatch est une plateforme immobiliere full-stack qui met en relation des particuliers et des agences autour d'annonces de vente ou de location. Le projet couvre le parcours complet: recherche de biens, assistant IA, espace utilisateur, espace agence, back-office administrateur, gestion des images et demandes de visite.

Projet realise dans le cadre d'un cursus CDA, avec une approche proche d'un produit SaaS: plusieurs roles, API securisee, donnees persistantes, deploiement web et backend, et prototype mobile Expo.

## Liens

- Repository GitHub: [github.com/DIAGNEUX/HomeMatch](https://github.com/DIAGNEUX/HomeMatch)
- API backend: [homematch-veii.onrender.com](https://homematch-veii.onrender.com/health)
- Application web: [https://homematchapp.me]

## Objectif du projet

Les plateformes immobilieres classiques reposent surtout sur des filtres. HomeMatch ajoute une couche conversationnelle: l'utilisateur peut decrire son besoin en langage naturel, puis l'assistant affine la recherche et propose des biens coherents avec ses criteres.

Le projet met aussi l'accent sur les besoins metier des agences: creation d'annonces, publication, gestion des images, suivi des demandes de visite et separation claire des droits entre utilisateur, agence et administrateur.

## Fonctionnalites principales

### Cote utilisateur

- Recherche publique d'annonces avec filtres: ville, type de bien, vente/location, prix, surface, pieces, chambres et tri.
- Detail d'une annonce avec informations du bien, agence rattachee et images.
- Assistant IA conversationnel pour exprimer une recherche immobiliere en langage naturel.
- Recommandations d'annonces avec score, points forts et differences par rapport aux criteres.
- Compte utilisateur avec authentification, profil, favoris et demandes de visite.
- Creation et annulation de demandes de visite.

### Cote agence

- Inscription agence en deux etapes: compte utilisateur puis fiche agence.
- Tableau de bord agence.
- Creation, modification, suppression et publication d'annonces.
- Upload et suppression d'images via Cloudinary.
- Gestion des demandes de visite recues: acceptation, refus et suivi.
- Modification du profil agence.

### Cote administration

- Connexion administrateur dediee.
- Dashboard avec statistiques globales.
- Gestion des utilisateurs, agences et annonces.
- Desactivation de comptes utilisateurs.
- Consultation detaillee des agences et de leurs annonces.

### Prototype mobile

- Application Expo / React Native connectee a l'API.
- Parcours mobile pour recherche, authentification, favoris, visites et espace agence.

## Stack technique

| Partie | Technologies |
| --- | --- |
| Frontend web | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Axios |
| Backend API | NestJS, TypeScript, Prisma, PostgreSQL, Swagger |
| Authentification | JWT, cookies HTTP-only, guards NestJS, roles USER / AGENCY / ADMIN |
| IA | OpenAI API, gestion de conversation, scoring de recommandations |
| Images | Cloudinary, upload multipart, stockage des URLs en base |
| Mobile | Expo, React Native, TypeScript |
| DevOps | Docker Compose, Vercel, Render |

## Architecture

```text
HomeMatch
|
+-- apps
|   +-- frontend    # Application web Next.js
|   +-- backend     # API NestJS + Prisma
|   +-- mobile      # Prototype Expo / React Native
|
+-- docker-compose.yml
+-- README.md
```

Flux principal:

```text
Utilisateur / Agence / Admin
        |
        v
Frontend Next.js ou application Expo
        |
        v
API NestJS securisee par JWT et roles
        |
        +--> PostgreSQL via Prisma
        +--> Cloudinary pour les images
        +--> OpenAI API pour l'assistant immobilier
```

## Modele de donnees

Le schema Prisma couvre les entites principales du domaine:

- `User`: compte utilisateur avec role `USER`, `AGENCY` ou `ADMIN`.
- `Agency`: fiche professionnelle rattachee a un utilisateur agence.
- `Annonce`: bien immobilier, statut brouillon ou publie.
- `Image`: images rattachees aux annonces.
- `DemandeVisite`: demandes de visite avec statut de suivi.
- `Favorite`: favoris utilisateurs avec unicite par utilisateur et annonce.

## API

L'API expose notamment les modules suivants:

- `auth`: inscription, connexion, deconnexion, session courante.
- `admin`: statistiques, gestion des utilisateurs, agences et annonces.
- `agencies`: creation et modification de fiche agence.
- `announcements`: recherche publique, CRUD agence, publication.
- `announcements/:id/images`: upload et suppression d'images.
- `favorites`: ajout, suppression et consultation des favoris.
- `visit-requests`: creation et suivi des demandes de visite.
- `ai/chat`: assistant de recherche conversationnelle.

La route `POST /admin/register` est protegee par JWT et role `ADMIN`. Le premier compte administrateur doit etre cree avec `npm run admin:create` depuis `apps/backend`, ou directement en base de donnees.

Swagger est disponible en local sur:

```text
http://localhost:3001/api
```

## Installation locale

### Prerequis

- Node.js 22 ou superieur
- Docker Desktop
- Git
- Un compte Cloudinary
- Une cle API OpenAI

### Cloner le projet

```bash
git clone https://github.com/DIAGNEUX/HomeMatch.git
cd HomeMatch
```

### Installer les dependances

```bash
cd apps/backend
npm install

cd ../frontend
npm install

cd ../mobile
npm install
```

### Configurer les variables d'environnement

Creer `apps/backend/.env`:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/homematch"

JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-with-a-strong-password"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="HomeMatch"

OPENAI_API_KEY="your-openai-api-key"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

FRONTEND_URL="http://localhost:3000"
AUTH_COOKIE_SAMESITE="lax"
AUTH_COOKIE_SECURE="false"
```

Creer `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Creer ou mettre a jour le premier compte administrateur:

```bash
cd apps/backend
npm run admin:create
```

Ce script utilise `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME` et `ADMIN_LAST_NAME`. Il ne nettoie pas la base de donnees.

### Lancer PostgreSQL

```bash
docker compose up -d
```

### Initialiser Prisma

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev
```

### Lancer le backend

```bash
cd apps/backend
npm run start:dev
```

API locale:

```text
http://localhost:3001
```

### Lancer le frontend

```bash
cd apps/frontend
npm run dev
```

Application web locale:

```text
http://localhost:3000
```

### Lancer le prototype mobile

```bash
cd apps/mobile
npm run start
```

## Scripts utiles

### Backend

```bash
npm run start:dev
npm run build
npm run admin:create
npm run lint
npm run test
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

### Mobile

```bash
npm run start
npm run android
npm run ios
```

## Deploiement

Le projet est pense pour un deploiement separe:

- Frontend Next.js sur Vercel.
- Backend NestJS sur Render.
- Base PostgreSQL managee ou service PostgreSQL compatible.
- Images hebergees sur Cloudinary.

Variables importantes en production:

- `NEXT_PUBLIC_API_URL`: URL publique du backend.
- `FRONTEND_URL`: URL publique du frontend autorisee par CORS.
- `DATABASE_URL`: chaine de connexion PostgreSQL.
- `JWT_SECRET`: secret de signature JWT.
- `OPENAI_API_KEY`: cle API OpenAI.
- `CLOUDINARY_*`: configuration Cloudinary.
- `AUTH_COOKIE_SAMESITE=none` et `AUTH_COOKIE_SECURE=true` si le frontend et le backend sont sur deux domaines HTTPS differents.

## Points techniques mis en avant

- Architecture monorepo avec separation frontend, backend et mobile.
- API REST structuree par modules NestJS.
- Authentification par JWT avec roles et guards.
- Utilisation de cookies HTTP-only pour securiser la session web.
- Recherche immobiliere multi-criteres avec pagination et tri.
- Assistant IA capable de maintenir un contexte de conversation.
- Scoring metier pour recommander des annonces proches de la demande.
- Gestion d'images avec limite par annonce, controle de propriete et suppression Cloudinary.
- Back-office administrateur et workflows agence/utilisateur distincts.
- Schema relationnel Prisma avec contraintes, index et suppressions en cascade.

## Ameliorations possibles

- Ajouter une suite de tests end-to-end sur les parcours critiques.
- Ajouter des captures d'ecran et une courte video de demonstration.
- Mettre en place une CI GitHub Actions pour lint, build et tests.
- Ajouter une observabilite production: logs structures, monitoring d'erreurs et health checks automatises.
- Stabiliser le deploiement backend si l'hebergeur met le service en veille.

## Auteur

Projet realise par [DIAGNEUX](https://github.com/DIAGNEUX) dans le cadre d'un projet CDA.
