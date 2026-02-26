# StudySpace 🚀

**Plateforme d'étude collaborative moderne pour étudiants.**

StudySpace permet à des groupes d'étudiants de travailler ensemble comme s'ils étaient dans la même salle : espaces de travail partagés, sessions d'étude collaboratives, tableau blanc interactif, audio temps réel, et gestion de fichiers.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Base de données](#-base-de-données)
- [Développement](#-développement)
- [Structure du projet](#-structure-du-projet)
- [API](#-api)
- [Scripts](#-scripts)
- [Déploiement](#-déploiement)
- [Documentation](#-documentation)

---

## ✨ Fonctionnalités

### 🔐 Authentification Complète

- Inscription avec nom, email et mot de passe
- Connexion sécurisée
- Vérification d'email (avec templates React Email)
- Réinitialisation de mot de passe
- Gestion de profil utilisateur
- Changement d'email avec vérification
- Changement de mot de passe
- Suppression de compte avec confirmation

### 🏢 Espaces de Travail (Workspaces)

- Création d'espaces de travail par matière ou projet
- Tags par matière : maths, info, physique, chimie, svt, langues, droit, autre
- Système d'invitation avec codes uniques (6 caractères)
- Gestion des membres (propriétaire/membre)
- Modification/suppression (propriétaire uniquement)

### 📚 Sessions d'Étude

- Création de sessions dans un workspace
- Suivi du temps d'étude
- Sauvegarde de l'état du canvas (tableau blanc)
- Sauvegarde de l'état de l'éditeur
- Historique des sessions par workspace

### 🎙️ Audio Temps Réel (Agora)

- Canaux audio par workspace
- Mute/unmute individuel
- Indicateurs visuels de parole
- Intégration Agora RTC SDK

### 📁 Gestion de Fichiers

- Upload de fichiers dans un workspace (Vercel Blob)
- Téléchargement et prévisualisation
- Gestion des permissions par workspace
- Support multi-formats (PDF, images, documents)

### 👤 Profil & Paramètres

- Page de profil avec statistiques (workspaces, sessions, fichiers)
- Modification du nom et de l'email
- Gestion de la sécurité (changement de mot de passe)
- Zone de danger avec suppression de compte

### 🎨 Interface Utilisateur

- Design moderne avec shadcn/ui (24 composants)
- Animations fluides avec Framer Motion
- Mode sombre/clair
- Interface en français
- Composants accessibles (Radix UI)
- Toast notifications (Sonner)

---

## 🛠️ Stack Technique

### Frontend

- **Framework** : Next.js 16.0.5 (App Router)
- **React** : 19.2.0 (avec React Compiler activé)
- **Language** : TypeScript 5.x (strict mode)
- **Styling** : Tailwind CSS 4 (CSS variables pour design tokens)
- **Composants** : shadcn/ui (New York style) + Radix UI
- **Animations** : Framer Motion 12.23.24
- **Gestion d'état** : Zustand 5.0.9
- **Formulaires** : React Hook Form 7.67.0 + Zod 4.1.13
- **HTTP** : Axios 1.7.9
- **Icônes** : Lucide React 0.468.0
- **Notifications** : Sonner 1.7.3

### Backend

- **API** : Next.js API Routes (App Router)
- **Base de données** : PostgreSQL (Neon)
- **ORM** : Prisma 7.0.1 avec @prisma/adapter-pg 6.0.1
- **Authentification** : Better Auth 1.4.9 avec Prisma adapter
- **Temps réel** : Pusher (WebSocket)
- **Audio** : Agora RTC SDK (canaux audio par workspace)
- **Storage** : Vercel Blob (gestion de fichiers)
- **Email** : Resend 6.6.0 + React Email 5.1.0
- **Validation** : Zod 4.1.13

### Développement

- **Compilateur React** : Activé pour optimisations automatiques
- **ESLint** : Configuration Next.js
- **Prisma Studio** : Interface de gestion de base de données

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/studyspace.git
cd studyspace
```

### 2. Installer les dépendances

```bash
npm install
```

---

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# ===========================================
# DATABASE (PostgreSQL via Neon)
# ===========================================
# Format : postgresql://[user]:[password]@[host]/[database]
DATABASE_URL="postgresql://..."

# ===========================================
# BETTER AUTH
# ===========================================
# URL de base de l'application
BETTER_AUTH_URL="http://localhost:3000"

# Secret pour le JWT (générez-en un avec: openssl rand -base64 32)
BETTER_AUTH_SECRET="votre-secret-securise-ici"

# ===========================================
# EMAIL (Resend)
# ===========================================
# Clé API Resend (optionnel en dev)
RESEND_API_KEY="re_..."

# Adresse email d'envoi (ex: noreply@votredomaine.com)
EMAIL_FROM="StudySpace <noreply@votredomaine.com>"

# ===========================================
# APP CONFIG
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===========================================
# PUSHER (Real-time)
# ===========================================
# Credentials from https://dashboard.pusher.com
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="eu"

# Client-side public keys
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="eu"

# ===========================================
# VERCEL BLOB (Storage)
# ===========================================
# Token from Vercel Dashboard > Storage > Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

⚠️ **Important** :

- `.env.local` ne doit jamais être commité
- En développement, les emails de vérification sont affichés dans la console au lieu d'être envoyés
- `RESEND_API_KEY` est optionnel en développement mais requis en production

### Générer un secret sécurisé

```bash
# Linux/macOS
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 🗄️ Base de données

### Schéma Prisma

Le projet utilise Prisma avec PostgreSQL. Les modèles principaux sont :

- **User** : Utilisateurs (géré par Better Auth)
- **Account** : Comptes OAuth (Better Auth)
- **Session** : Sessions utilisateur (Better Auth)
- **Verification** : Tokens de vérification (Better Auth)
- **Workspace** : Espaces de travail
- **WorkspaceMember** : Membres des workspaces (relation User ↔ Workspace)
- **StudySession** : Sessions d'étude
- **File** : Fichiers partagés dans les workspaces (Vercel Blob)

### Initialiser la base de données

1. **Générer le client Prisma** :

```bash
npx prisma generate
```

2. **Créer les tables** :

```bash
npx prisma db push
```

3. **Ouvrir Prisma Studio** (optionnel) :

```bash
npx prisma studio
```

### Migrations

Les migrations sont dans `prisma/migrations/` :

- `20251224114636_init` : Schéma initial
- `20251224122708_add_auth_models` : Modèles Better Auth
- `20251224161324_better_auth_integration` : Intégration complète

Pour créer une nouvelle migration :

```bash
npx prisma migrate dev --name nom_de_la_migration
```

---

## 🧪 Développement

### Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Mode développement - Emails

En développement, les emails ne sont pas envoyés. Les liens de vérification sont affichés dans la console :

```
================================================================================
📧 EMAIL DE VÉRIFICATION (DEV MODE)
Pour: user@example.com
Lien de vérification: http://localhost:3000/api/auth/verify-email?token=...
================================================================================
```

Copiez simplement le lien et ouvrez-le dans votre navigateur.

### Linter

```bash
npm run lint
```

### Build de production

```bash
npm run build
npm run start
```

---

## 📁 Structure du projet

```
StudySpace/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Route group : pages d'authentification
│   │   ├── login/page.tsx           # Page de connexion
│   │   ├── register/page.tsx        # Page d'inscription
│   │   ├── verify-email/page.tsx    # Vérification d'email
│   │   ├── forgot-password/page.tsx # Mot de passe oublié
│   │   └── reset-password/page.tsx  # Réinitialisation mot de passe
│   ├── (dashboard)/                  # Route group : dashboard protégé
│   │   └── dashboard/
│   │       ├── page.tsx             # Page d'accueil dashboard
│   │       ├── profil/page.tsx      # Page de profil utilisateur
│   │       └── parametres/page.tsx  # Page de paramètres
│   ├── api/                          # API Routes
│   │   ├── auth/[...all]/route.ts   # Routes Better Auth
│   │   ├── workspaces/              # CRUD workspaces
│   │   ├── sessions/                # CRUD sessions d'étude
│   │   └── health/route.ts          # Health check
│   ├── layout.tsx                    # Layout racine avec AuthProvider
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Styles globaux + variables CSS
│
├── components/
│   ├── ui/                           # shadcn/ui components (24 composants)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── auth/                         # Composants d'authentification
│   │   └── AuthProvider.tsx         # Provider d'initialisation auth
│   ├── layout/                       # Composants de layout
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── motion.tsx                    # Wrappers Framer Motion
│   └── AnimatedCounter.tsx
│
├── lib/
│   ├── auth/                         # Configuration authentification
│   │   ├── index.ts                 # Better Auth server config
│   │   ├── client.ts                # Better Auth client
│   │   └── session.ts               # Helpers de session
│   ├── email/                        # Email templates
│   │   ├── resend.ts                # Configuration Resend
│   │   └── templates/
│   │       ├── base.tsx             # Template de base
│   │       ├── verification-email.tsx
│   │       ├── reset-password-email.tsx
│   │       └── change-email.tsx
│   ├── stores/                       # Zustand stores
│   │   ├── index.ts                 # Export combiné
│   │   ├── auth-store.ts            # Store d'authentification
│   │   └── workspace-store.ts       # Store de workspaces
│   ├── hooks/                        # Custom React hooks
│   │   └── use-auth.ts              # Hook d'authentification
│   ├── validations.ts                # Schémas Zod de validation
│   ├── api-response.ts               # Helpers de réponse API
│   ├── animations.ts                 # Presets Framer Motion
│   ├── prisma.ts                     # Instance Prisma client
│   └── utils.ts                      # Utilitaires (cn, etc.)
│
├── prisma/
│   ├── schema.prisma                 # Schéma de base de données
│   └── migrations/                   # Migrations Prisma
│
├── data/
│   └── landingPageData.ts            # Contenu de la landing page
│
├── proxy.ts                          # Middleware de session
├── prisma.config.ts                  # Configuration Prisma
├── .env.example                      # Variables d'environnement exemple
├── .env.local                        # Variables locales (non commité)
└── package.json
```

---

## 🔌 API

### Endpoints d'authentification

Tous les endpoints d'authentification sont gérés par Better Auth via `/api/auth/[...all]` :

- `POST /api/auth/sign-up/email` - Inscription
- `POST /api/auth/sign-in/email` - Connexion
- `POST /api/auth/sign-out` - Déconnexion
- `GET /api/auth/get-session` - Récupérer la session
- `POST /api/auth/update-user` - Modifier le profil
- `POST /api/auth/change-email` - Changer l'email
- `POST /api/auth/change-password` - Changer le mot de passe
- `POST /api/auth/delete-user` - Supprimer le compte
- `POST /api/auth/forget-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe
- `GET /api/auth/verify-email` - Vérifier l'email

### Endpoints Workspaces

- `GET /api/workspaces` - Liste des workspaces de l'utilisateur
- `POST /api/workspaces` - Créer un workspace
- `GET /api/workspaces/[id]` - Détails d'un workspace
- `PUT /api/workspaces/[id]` - Modifier un workspace (propriétaire uniquement)
- `DELETE /api/workspaces/[id]` - Supprimer un workspace (propriétaire uniquement)
- `POST /api/workspaces/join` - Rejoindre avec un code d'invitation
- `GET /api/workspaces/[id]/members` - Liste des membres
- `POST /api/workspaces/[id]/members` - Ajouter un membre
- `DELETE /api/workspaces/[id]/members/[userId]` - Retirer un membre

### Endpoints Sessions

- `GET /api/sessions?workspaceId=...` - Sessions d'un workspace
- `POST /api/sessions` - Créer une session
- `GET /api/sessions/[id]` - Détails d'une session
- `POST /api/sessions/[id]/end` - Terminer une session
- `PUT /api/sessions/[id]` - Modifier une session

### Endpoints Fichiers

- `GET /api/files?workspaceId=...` - Fichiers d'un workspace
- `POST /api/files` - Uploader un fichier (multipart/form-data)
- `DELETE /api/files/[id]` - Supprimer un fichier

### Endpoints Audio (Agora)

- `POST /api/agora/token` - Générer un token RTC pour rejoindre un canal

### Health Check

- `GET /api/health` - Vérifier l'état de l'API et de la DB

---

## 📜 Scripts

```bash
# Développement
npm run dev                 # Lancer le serveur de dev (port 3000)

# Build
npm run build              # Build de production
npm run start              # Lancer le serveur de production
npm run lint               # Linter ESLint

# Base de données
npx prisma generate        # Générer le client Prisma
npx prisma db push         # Pousser le schéma vers la DB
npx prisma studio          # Ouvrir Prisma Studio
npx prisma migrate dev     # Créer une migration
npx prisma migrate deploy  # Appliquer les migrations (production)

# shadcn/ui
npx shadcn@latest add <component>  # Ajouter un composant
```

---

## 🚢 Déploiement

### Vercel (recommandé)

1. **Push sur GitHub** :

```bash
git push origin main
```

2. **Importer sur Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre dépôt GitHub
   - Configurez les variables d'environnement

3. **Variables d'environnement** :
   - Copiez toutes les variables de `.env.local`
   - Changez `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` avec votre URL de production
   - Ajoutez `RESEND_API_KEY` pour l'envoi d'emails en production

4. **Déployer** :

```bash
vercel --prod
```

### Configuration de la base de données

Pour la production, vous devez :

1. Créer une base de données PostgreSQL (Neon, Supabase, Railway, etc.)
2. Copier la `DATABASE_URL`
3. Exécuter les migrations :

```bash
npx prisma migrate deploy
```

---

## 🔒 Sécurité

### Authentification

- **Better Auth** avec sessions sécurisées
- Mots de passe hashés avec bcrypt
- Tokens de vérification d'email avec expiration (24h)
- Tokens de réinitialisation de mot de passe (1h)
- Protection CSRF intégrée

### Base de données

- Validation avec Zod sur toutes les entrées
- Prisma pour prévenir les injections SQL
- Relations strictes dans le schéma

### Permissions

- Vérification de l'authentification sur toutes les routes protégées
- Vérification d'appartenance au workspace avant accès
- Vérification du rôle (OWNER) pour actions sensibles

### Bonnes pratiques

- HTTPS en production (géré par Vercel)
- Variables d'environnement sécurisées
- Pas de secrets côté client
- Validation côté serveur et client

---

## 📚 Documentation

### Technologies utilisées

- [Next.js 16](https://nextjs.org/docs) - Framework React
- [React 19](https://react.dev) - Bibliothèque UI
- [TypeScript](https://www.typescriptlang.org/docs) - Typage statique
- [Tailwind CSS 4](https://tailwindcss.com/docs) - Framework CSS
- [Better Auth](https://www.better-auth.com/docs) - Authentification
- [Prisma](https://www.prisma.io/docs) - ORM
- [Resend](https://resend.com/docs) - Service d'email
- [React Email](https://react.email/docs) - Templates d'email
- [shadcn/ui](https://ui.shadcn.com) - Composants UI
- [Radix UI](https://www.radix-ui.com) - Primitives accessibles
- [Framer Motion](https://www.framer.com/motion) - Animations
- [Zustand](https://zustand-demo.pmnd.rs) - Gestion d'état
- [Zod](https://zod.dev) - Validation de schémas
- [React Hook Form](https://react-hook-form.com) - Gestion de formulaires
- [Agora RTC SDK](https://docs.agora.io/en/voice-calling/get-started/get-started-sdk) - Audio temps réel
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) - Stockage de fichiers
- [Pusher](https://pusher.com/docs) - WebSocket temps réel

### Ressources

- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Guide de développement
- [.env.example](./.env.example) - Exemple de variables d'environnement

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Conventions de code

- **Fichiers** : kebab-case (`auth-store.ts`)
- **Composants** : PascalCase (`AuthProvider.tsx`)
- **Fonctions/Variables** : camelCase
- **Constantes** : UPPER_SNAKE_CASE
- **Types/Interfaces** : PascalCase

---

## 📝 Licence

MIT - Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 🆘 Support

Pour toute question ou problème :

- **Issues** : [GitHub Issues](https://github.com/votre-username/studyspace/issues)
- **Documentation** : [DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

## 🙏 Remerciements

- [shadcn](https://twitter.com/shadcn) pour shadcn/ui
- [Better Auth](https://www.better-auth.com) pour la solution d'authentification
- La communauté Next.js et React

---

**Développé avec ❤️ pour les étudiants**
