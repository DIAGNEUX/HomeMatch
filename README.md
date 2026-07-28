# HomeMatch

## Présentation

Quelques lignes.

> HomeMatch est une plateforme immobilière intelligente développée dans le cadre du projet CDA. Elle met en relation particuliers et agences immobilières grâce à une expérience moderne et des recommandations assistées par IA.

---

## Stack technique

```text
Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

Backend
- NestJS
- Prisma
- PostgreSQL
- JWT

DevOps
- Docker
- Docker Compose
```

---

# Prérequis

```text
Node.js >= 22

Docker Desktop

Git
```

---

# Installation

```bash
git clone https://github.com/DIAGNEUX/HomeMatch.git

cd HomeMatch
```

---

## Installer les dépendances

Backend

```bash
cd apps/backend
npm install
```

Frontend

```bash
cd apps/frontend
npm install
```

---

# Variables d'environnement

### Backend

Créer un fichier

```text
apps/backend/.env
```

Exemple :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/homematch"

JWT_SECRET="your-secret-key"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

PORT=3001
```

---

### Frontend

Créer

```text
apps/frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

# Lancer PostgreSQL

```bash
docker compose up -d
```

---

# Lancer Prisma

```bash
npx prisma migrate dev

npx prisma generate
```

Puis

```bash
npx prisma studio
```

---

# Lancer le backend

```bash
npm run start:dev
```

Disponible sur

```
http://localhost:3001
```

Swagger

```
http://localhost:3001/api
```

---

# Lancer le frontend

```bash
npm run dev
```

Disponible sur

```
http://localhost:3000
```

---

# Structure

Tu peux même mettre un petit schéma :

```text
HomeMatch
│
├── apps
│   ├── backend
│   └── frontend
│
├── docker-compose.yml
└── README.md
```

---

# Architecture

Tu peux même mettre un lien :

> 📚 Pour une documentation complète de l'architecture, consultez le workspace Notion du projet.

https://app.notion.com/p/CDA-Projet-IA-Immobilier-3930e348bfaf802b8511ce31e03a8576

# Comment contribuer

Par exemple :

```bash
Créer une branche

↓

feature/auth

↓

Commit

↓

Push

↓

Pull Request
```

---
