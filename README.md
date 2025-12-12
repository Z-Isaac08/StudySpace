# StudySpace 🚀

**Plateforme d’étude collaborative moderne pour étudiants.**

StudySpace permet à des groupes d’étudiants de travailler ensemble comme s’ils étaient dans la même salle : collaboration temps réel, tableau blanc, notes partagées, présence live, fichiers, etc.

![StudySpace Preview](./public/preview.png)

---

# ✨ Fonctionnalités

### 🧭 Espaces de Travail

- Création de workspaces par matière ou projet
- Invités / membres
- Présence en temps réel

### 🤝 Collaboration

- Tableau blanc interactif (crayon + formes simples)
- Éditeur de notes collaboratif (Markdown / Rich Text)
- Chat en temps réel
- Indicateurs “en train d’écrire”
- Avatars en ligne

### 📁 Partage & Organisation

- Upload PDF / images
- Gestion simple des ressources
- Historique de messages

### 🔐 Auth & Sécurité

- Auth Supabase
- Stockage fichiers sécurisé
- RLS PostgreSQL

---

# 🛠️ Stack Technique

### Frontend

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion

### Backend

- Supabase (Auth + DB + Storage + Realtime)
- PostgreSQL
- Prisma ORM v7
- Zod

### Pourquoi Supabase ?

- DB + Auth + Storage + Realtime centralisés
- WebSockets natifs
- Très faible coût → idéal étudiants / early-stage
- Sécurité avec Row Level Security

---

# 🚀 Installation

## 📦 1. Cloner le projet

```bash
git clone https://github.com/votre-username/studyspace.git
cd studyspace
```

## 📥 2. Installer les dépendances

```bash
npm install
# ou pnpm install
```

---

# 🔧 Configuration : Variables d’Environnement

Tu as un fichier **`.env.example`** dans le repo.

Copie-le pour créer ton vrai fichier local :

```bash
cp .env.example .env.local
```

Voici le contenu **optimisé** du `.env.example` :

```env
# ===========================================
# DATABASE (Prisma + Supabase)
# ===========================================
# Remplacer par la connection string trouvée :
# Supabase Dashboard → Settings → Database → Connection String
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# ===========================================
# SUPABASE API
# ===========================================
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# ===========================================
# APP CONFIG
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

⚠️ **`.env.local` ne doit jamais être commité.**  
Ton `.env.example` peut rester public.

---

# 🗄️ Initialiser la base de données

```bash
npx prisma generate
npx prisma db push
```

Pour ouvrir Prisma Studio :

```bash
npx prisma studio
```

---

# 🔴 Configurer Realtime dans Supabase

### Option 1 — via Dashboard

Database → Replication → activer :

- `messages`
- `workspaces`
- `members`

### Option 2 — via SQL Editor

```sql
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE workspaces REPLICA IDENTITY FULL;
ALTER TABLE members REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE workspaces;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
```

---

# 🧪 Lancer en développement

```bash
npm run dev
```

http://localhost:3000

---

# 📁 Structure du Projet

```
studyspace/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
├── components/
│   ├── ui/
│   ├── workspace/
├── lib/
│   ├── prisma.ts
│   ├── supabase/
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.example
└── package.json
```

---

# 🔒 Sécurité

- Auth Supabase
- Row Level Security activé
- Prisma contrôlé par RLS
- Zod pour valider toutes les entrées utilisateur

### Exemple de politique RLS

```sql
CREATE POLICY "Users read only their workspace messages"
ON messages FOR SELECT USING (
  workspace_id IN (
    SELECT workspace_id FROM members WHERE user_id = auth.uid()
  )
);
```

---

# 🚢 Déploiement (Vercel)

1. Push sur GitHub
2. Import sur Vercel
3. Copier toutes les variables `.env.local` dans Vercel
4. Déployer

```bash
vercel --prod
```

---

# 🧪 Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run lint

npx prisma generate
npx prisma db push
npx prisma studio
```

---

# 📚 Documentation

- Next.js — https://nextjs.org
- Supabase — https://supabase.com/docs
- Prisma — https://www.prisma.io
- shadcn/ui — https://ui.shadcn.com

---

# 🤝 Contribution

1. Fork
2. Créer une branche feature
3. Commit
4. Pull Request

---

# 📝 Licence

MIT — Voir `LICENSE`.

---

# 🆘 Support

- Email : votre-email@example.com
- Issues : GitHub Issues
- Discord : Lien Discord

