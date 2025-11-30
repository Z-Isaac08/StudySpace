# StudySpace 🚀

**Plateforme d'étude collaborative pour étudiants.**

StudySpace est une application web moderne conçue pour permettre aux étudiants de réviser ensemble efficacement, comme s'ils étaient dans la même salle. Elle combine visioconférence, tableau blanc interactif, éditeur de notes partagé et gestion de fichiers.

![StudySpace Preview](/public/preview.png)

## ✨ Fonctionnalités Principales

- **Espaces de Travail (Workspaces)** : Créez des groupes d'étude par matière ou projet.
- **Collaboration Temps Réel** :
  - 🎥 Visioconférence & Audio (WebRTC)
  - 🎨 Tableau blanc interactif (Dessin, schémas)
  - 📝 Éditeur de texte collaboratif (Markdown/Rich Text)
  - 🟢 Indicateurs de présence
- **Gestion de Contenu** : Partage de fichiers et ressources.
- **Authentification Sécurisée** : Inscription, connexion, gestion de profil.

## 🛠️ Stack Technique

### Frontend

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants** : [shadcn/ui](https://ui.shadcn.com/)
- **Animations** : Framer Motion

### Backend & Infrastructure

- **Base de données** : PostgreSQL (via Supabase)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Auth & Realtime** : [Supabase](https://supabase.com/)
- **Validation** : Zod

## 🚀 Installation & Démarrage

### Pré-requis

- Node.js 18+
- Compte Supabase (pour la BDD et l'Auth)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/studyspace.git
cd studyspace
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine et ajoutez vos clés Supabase :

```env
# Connexion Base de données (Supabase Transaction Pooler)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connexion Directe (pour les migrations Prisma)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[votre-clé-anon-publique]"
```

### 4. Initialiser la Base de Données

```bash
npx prisma generate
npx prisma db push
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

PUSHER_SECRET=your_secret
PUSHER_CLUSTER=eu

````

## Environment Variables

Create `.env.local`:

```env
# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=
PUSHER_CLUSTER=eu

# Database (later)
DATABASE_URL=

# JWT (for auth)
JWT_SECRET=your-secret-key
````

## Benefits of This Architecture

✅ **Simpler deployment** - Next.js can deploy to Vercel easily
✅ **No custom server** - Less code to maintain
✅ **Serverless-ready** - API Routes are serverless functions
✅ **Reliable real-time** - Pusher handles WebSocket infrastructure
✅ **Free tier** - 200k messages/day on Pusher free plan
