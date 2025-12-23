# ARCHI - Architecture Technique
## StudySpace - Documentation Technique Complète

**Version** : 1.0 (MVP Phase 3A)
**Dernière mise à jour** : Décembre 2025

---

## 1. Vue d'ensemble de l'architecture

### 1.1 Diagramme de haut niveau

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Client)                       │
│  Next.js 16 App Router + React 19 + TypeScript 5            │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Landing   │  │    Auth    │  │ Dashboard  │            │
│  │   Page     │  │   Pages    │  │   Pages    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │              │                │                   │
│         └──────────────┴────────────────┘                   │
│                        │                                     │
│         ┌──────────────▼──────────────┐                     │
│         │   Zustand Stores            │                     │
│         │  (auth, workspace, session) │                     │
│         └──────────────┬──────────────┘                     │
│                        │                                     │
│         ┌──────────────▼──────────────┐                     │
│         │   Axios HTTP Client          │                     │
│         └──────────────┬──────────────┘                     │
└────────────────────────┼──────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼──────────────────────────────────┐
│                   BACKEND (Server)                         │
│              Next.js API Routes                            │
│                                                            │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────┐         │
│  │   Auth   │  │  Workspaces │  │   Sessions   │         │
│  │  Routes  │  │   Routes    │  │    Routes    │         │
│  └────┬─────┘  └──────┬──────┘  └──────┬───────┘         │
│       │               │                 │                  │
│       └───────────────┴─────────────────┘                  │
│                       │                                     │
│       ┌───────────────▼───────────────┐                    │
│       │     Prisma ORM Client         │                    │
│       └───────────────┬───────────────┘                    │
└───────────────────────┼─────────────────────────────────┘
                        │
                        │ PostgreSQL Protocol
                        │
┌───────────────────────▼─────────────────────────────────┐
│               SUPABASE (Backend Services)               │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │ Supabase     │  │   Storage    │  │
│  │   Database   │  │    Auth      │  │ (Phase 4)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  Row Level Security (RLS) + Email Service                │
└──────────────────────────────────────────────────────────┘
```

### 1.2 Architecture en couches

#### Layer 1 : Présentation (UI/UX)
- **Technologie** : React 19 + Next.js 16 App Router
- **Styling** : Tailwind CSS v4 + shadcn/ui
- **Responsabilités** : Rendu, interactions utilisateur, animations

#### Layer 2 : État applicatif (State Management)
- **Technologie** : Zustand 5.x
- **Responsabilités** : Gestion d'état global, cache client, orchestration API calls

#### Layer 3 : API & Business Logic
- **Technologie** : Next.js API Routes + Prisma
- **Responsabilités** : Validation, autorisation, logique métier, CRUD

#### Layer 4 : Persistance (Data)
- **Technologie** : PostgreSQL via Supabase
- **Responsabilités** : Stockage relationnel, contraintes, indexation

#### Layer 5 : Services externes
- **Technologie** : Supabase Auth, Supabase Storage (Phase 4)
- **Responsabilités** : Authentification, email, stockage fichiers

---

## 2. Technologies et outils

### 2.1 Frontend Stack

#### Next.js 16.0.5
**Pourquoi** : Framework React full-stack avec SSR, App Router, optimisations automatiques

**Configuration clé** :
```javascript
// next.config.js
const nextConfig = {
  reactCompiler: true, // React Compiler pour optimisations automatiques
  experimental: {
    reactCompiler: true,
  },
};
```

**Features utilisées** :
- App Router (file-based routing)
- Server Components (composants serveur pour performance)
- API Routes (backend endpoints)
- Middleware (proxy.ts pour auth redirects)
- Image Optimization (next/image)

#### React 19.2.0
**Pourquoi** : Dernière version avec React Compiler intégré

**React Compiler activé** :
- Memoization automatique (plus besoin de useMemo/useCallback)
- Optimisations de re-renders
- Meilleure performance sans effort manuel

#### TypeScript 5 (Strict Mode)
**Pourquoi** : Type safety, meilleure DX, catch errors à la compilation

**tsconfig.json** :
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### Tailwind CSS v4
**Pourquoi** : Utility-first, mobile-first, design system via CSS variables

**globals.css** (CSS Variables) :
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    /* ... plus de variables */
  }

  .dark {
    --background: 240 10% 3.9%;
    /* ... dark mode variables */
  }
}
```

**Responsive breakpoints** :
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

#### shadcn/ui + Radix UI
**Pourquoi** : Composants accessibles (WCAG 2.1 AA), customisables, headless UI primitives

**Composants installés** (19 total) :
- `accordion`, `avatar`, `badge`, `button`, `card`, `checkbox`
- `dialog`, `dropdown-menu`, `input`, `label`, `radio-group`
- `select`, `separator`, `skeleton`, `tabs`, `textarea`, `tooltip`

**Installation** :
```bash
npx shadcn@latest add <component>
```

**Style** : New York (arrondi, ombres subtiles)

#### Framer Motion 12.x
**Pourquoi** : Animations déclaratives, support prefers-reduced-motion

**Wrappers (components/motion.tsx)** :
```typescript
'use client';
import { motion } from 'framer-motion';

export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
```

**Presets (lib/animations.ts)** :
```typescript
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};
```

#### Zustand 5.x
**Pourquoi** : State management simple, pas de boilerplate, TypeScript-first

**Architecture des stores** :
```typescript
// lib/stores/session-store.ts
interface SessionState {
  currentSession: Session | null;
  sessions: Session[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: (workspaceId: string) => Promise<void>;
  createSession: (workspaceId: string) => Promise<Session>;
  updateSession: (id: string, data: UpdateSessionInput) => Promise<void>;
  endSession: (id: string, data: EndSessionInput) => Promise<Session>;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  // ... implementation
}));

// Hook pour faciliter usage
export const useSession = () => {
  const { currentSession, sessions, ... } = useSessionStore();
  return { currentSession, sessions, ... };
};
```

**Stores créés** :
1. `auth-store.ts` : User, isAuthenticated, login, logout
2. `workspace-store.ts` : Workspaces, CRUD, members
3. `session-store.ts` : Sessions, CRUD, auto-save

#### React Hook Form 7.x + Zod 4.x
**Pourquoi** : Validation performante, intégration Zod, moins de re-renders

**Pattern** :
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/validations';

const form = useForm({
  resolver: zodResolver(LoginSchema),
  defaultValues: { email: '', password: '' }
});

const onSubmit = form.handleSubmit(async (data) => {
  await login(data);
});
```

#### Axios
**Pourquoi** : Intercepteurs pour auth, gestion erreurs, type-safe avec TypeScript

**Configuration** :
```typescript
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_URL;
axios.defaults.withCredentials = true; // Cookies
```

**Utilisation via stores uniquement** (pas d'appels directs dans composants).

### 2.2 Backend Stack

#### Next.js API Routes
**Pourquoi** : Colocation frontend/backend, déploiement simple, serverless-ready

**Structure** :
```
app/api/
├── auth/
│   ├── register/route.ts      # POST /api/auth/register
│   ├── login/route.ts         # POST /api/auth/login
│   ├── logout/route.ts        # POST /api/auth/logout
│   ├── me/route.ts            # GET /api/auth/me
│   ├── forgot-password/route.ts
│   ├── reset-password/route.ts
│   └── resend-verification/route.ts
├── workspaces/
│   ├── route.ts               # GET, POST /api/workspaces
│   ├── [id]/route.ts          # GET, PUT, DELETE /api/workspaces/:id
│   └── join/route.ts          # POST /api/workspaces/join
└── sessions/
    ├── route.ts               # GET, POST /api/sessions
    ├── [id]/route.ts          # GET, PUT, DELETE /api/sessions/:id
    └── [id]/end/route.ts      # PUT /api/sessions/:id/end
```

**Pattern standard** :
```typescript
import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/api-response';
import { CreateSessionSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // 1. Auth check
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  // 2. Parse & validate
  const body = await request.json();
  const validated = CreateSessionSchema.safeParse(body);
  if (!validated.success) return validationError(validated.error);

  // 3. Authorization (workspace membership)
  const isMember = await isWorkspaceMember(user.id, validated.data.workspaceId);
  if (!isMember) return forbiddenResponse();

  // 4. Business logic
  const session = await prisma.session.create({
    data: {
      workspaceId: validated.data.workspaceId,
      createdById: user.id,
      startedAt: new Date(),
    },
  });

  // 5. Response
  return successResponse(session, 201);
}
```

#### Prisma 7.0.1
**Pourquoi** : Type-safe ORM, migrations automatiques, excellent DX

**Configuration (prisma/schema.prisma)** :
```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

**Client singleton (lib/prisma.ts)** :
```typescript
import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

**Adapter PostgreSQL** :
```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

**Commandes** :
```bash
npx prisma generate          # Générer client TypeScript
npx prisma db push           # Sync schema → DB (dev)
npx prisma migrate dev       # Créer migration (prod-ready)
npx prisma studio            # GUI pour explorer DB
```

#### Supabase Auth
**Pourquoi** : Auth managed, email verification, password reset, RLS integration

**Clients (lib/supabase/)** :

**client.ts (Browser)** :
```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**server.ts (Server Components / API Routes)** :
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
};
```

**Auth helpers (lib/auth/session.ts)** :
```typescript
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch from Prisma for complete profile
  return await prisma.user.findUnique({
    where: { id: user.id },
  });
};

export const isWorkspaceMember = async (userId: string, workspaceId: string) => {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return !!member;
};

export const isWorkspaceOwner = async (userId: string, workspaceId: string) => {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return member?.role === 'OWNER';
};
```

**Session Proxy (proxy.ts - Middleware)** :
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAuth = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users to login
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### 2.3 Database (PostgreSQL via Supabase)

#### Schéma complet

**users** :
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**workspaces** :
```sql
CREATE TYPE workspace_tag AS ENUM (
  'maths', 'info', 'physique', 'chimie', 'svt',
  'langues', 'droit', 'general', 'autre'
);

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tag workspace_tag DEFAULT 'autre',
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workspaces_created_by ON workspaces(created_by_id);
CREATE INDEX idx_workspaces_invite_code ON workspaces(invite_code);
```

**workspace_members** :
```sql
CREATE TYPE member_role AS ENUM ('OWNER', 'MEMBER');

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  role member_role DEFAULT 'MEMBER',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_id)
);

CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
```

**sessions** :
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration INTEGER, -- secondes
  canvas_state JSONB,
  editor_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_workspace ON sessions(workspace_id);
CREATE INDEX idx_sessions_created_by ON sessions(created_by_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
```

**files** (🔜 Phase 4) :
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  uploaded_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL, -- bytes
  mime_type VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_files_workspace ON files(workspace_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by_id);
```

#### Row Level Security (RLS)

**Politique RLS (Supabase)** :
```sql
-- Users : lecture seule de leur propre profil
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_read_own ON users FOR SELECT
  USING (auth.uid() = id);

-- Workspaces : lecture si membre
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY workspaces_read_member ON workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
    )
  );

-- Sessions : lecture si membre du workspace
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_read_member ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = sessions.workspace_id
        AND user_id = auth.uid()
    )
  );
```

#### Indexation (Performance)

**Stratégie** :
- Index sur toutes les foreign keys (user_id, workspace_id)
- Index sur champs de recherche fréquents (email, invite_code)
- Index sur champs de tri (started_at, created_at)
- Composite index si requêtes multi-colonnes fréquentes

**Vérification performance** :
```sql
EXPLAIN ANALYZE
SELECT * FROM sessions
WHERE workspace_id = '...'
ORDER BY started_at DESC
LIMIT 50;
```

---

## 3. Flux de données

### 3.1 Flux d'authentification

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Submit login form
     ▼
┌────────────────────────┐
│  LoginForm Component   │
│  (React Hook Form +    │
│   Zod validation)      │
└────┬───────────────────┘
     │ 2. form.handleSubmit(login)
     ▼
┌────────────────────────┐
│   auth-store.ts        │
│   login(credentials)   │
└────┬───────────────────┘
     │ 3. POST /api/auth/login
     ▼
┌────────────────────────┐
│  /api/auth/login       │
│  - Validate input      │
│  - Check Supabase Auth │
│  - Upsert Prisma user  │
└────┬───────────────────┘
     │ 4. supabase.auth.signInWithPassword()
     ▼
┌────────────────────────┐
│   Supabase Auth        │
│   - Verify password    │
│   - Create session     │
│   - Set cookies        │
└────┬───────────────────┘
     │ 5. Return user + session
     ▼
┌────────────────────────┐
│  API Route Response    │
│  successResponse(user) │
└────┬───────────────────┘
     │ 6. Update store state
     ▼
┌────────────────────────┐
│   auth-store.ts        │
│   set({ user, isAuth })│
└────┬───────────────────┘
     │ 7. Redirect to /dashboard
     ▼
┌────────────────────────┐
│  router.push()         │
└────────────────────────┘
```

### 3.2 Flux de création de session

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Click "Démarrer une session"
     ▼
┌────────────────────────┐
│ WorkspaceDetailPage    │
│ handleStartSession()   │
└────┬───────────────────┘
     │ 2. createSession(workspaceId)
     ▼
┌────────────────────────┐
│  session-store.ts      │
│  createSession()       │
└────┬───────────────────┘
     │ 3. POST /api/sessions
     ▼
┌────────────────────────┐
│  /api/sessions POST    │
│  - Check auth          │
│  - Check membership    │
│  - Create in DB        │
└────┬───────────────────┘
     │ 4. prisma.session.create()
     ▼
┌────────────────────────┐
│   PostgreSQL (Supabase)│
│   INSERT INTO sessions │
└────┬───────────────────┘
     │ 5. Return session
     ▼
┌────────────────────────┐
│  API Response          │
│  successResponse(...)  │
└────┬───────────────────┘
     │ 6. Update store + redirect
     ▼
┌────────────────────────┐
│  session-store.ts      │
│  set({ currentSession })│
└────┬───────────────────┘
     │ 7. router.push(`/dashboard/session/${id}`)
     ▼
┌────────────────────────┐
│  SessionPage           │
│  - Fetch session       │
│  - Render canvas/editor│
│  - Start auto-save     │
└────────────────────────┘
```

### 3.3 Flux d'auto-save

```
┌────────────────────────┐
│  SessionPage           │
│  useEffect(() => {     │
│    setInterval(...)    │
│  }, [])                │
└────┬───────────────────┘
     │ Every 30 seconds
     ▼
┌────────────────────────┐
│  saveSession()         │
│  - Get canvas dataURL  │
│  - Get editor content  │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────┐
│  session-store.ts      │
│  updateSession(id, {   │
│    canvasState,        │
│    editorState         │
│  })                    │
└────┬───────────────────┘
     │ PUT /api/sessions/:id
     ▼
┌────────────────────────┐
│  /api/sessions/[id]    │
│  PUT handler           │
│  - Validate input      │
│  - Check permissions   │
│  - Update in DB        │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────┐
│  PostgreSQL            │
│  UPDATE sessions       │
│  SET canvas_state = .. │
│      editor_state = .. │
└────┬───────────────────┘
     │ Success (silent)
     ▼
┌────────────────────────┐
│  Store updates         │
│  setLastSaveTime(now)  │
└────────────────────────┘
```

**Note** : Auto-save utilise silent failures (try/catch sans throw) pour ne pas interrompre l'utilisateur.

---

## 4. Patterns et conventions

### 4.1 Store Architecture Pattern

**Règle** : Tous les appels API passent par les stores Zustand. Aucun `axios` direct dans les composants.

**Exemple** :
```typescript
// ❌ BAD - Direct API call
const WorkspaceCard = () => {
  const handleDelete = async () => {
    await axios.delete(`/api/workspaces/${id}`);
    // ...
  };
};

// ✅ GOOD - Use store
const WorkspaceCard = () => {
  const { deleteWorkspace } = useWorkspace();
  const handleDelete = async () => {
    await deleteWorkspace(id);
  };
};
```

**Avantages** :
- Centralization logique API
- Cache côté client
- Loading states partagés
- Easier testing (mock stores)

### 4.2 API Response Pattern

**Fichier** : `lib/api-response.ts`

```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const successResponse = (data: any, status = 200) => {
  return NextResponse.json({ success: true, data }, { status });
};

export const errorResponse = (message: string, status = 500) => {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
};

export const validationError = (error: ZodError) => {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation échouée',
      details: error.errors,
    },
    { status: 400 }
  );
};

export const unauthorizedResponse = (message = 'Non authentifié') => {
  return errorResponse(message, 401);
};

export const forbiddenResponse = (message = 'Accès refusé') => {
  return errorResponse(message, 403);
};
```

**Utilisation** :
```typescript
// Success
return successResponse(session, 201);

// Errors
return validationError(validated.error);
return unauthorizedResponse();
return forbiddenResponse('Seul le propriétaire peut supprimer');
return errorResponse('Workspace non trouvé', 404);
```

### 4.3 Validation Pattern (Zod)

**Fichier** : `lib/validations.ts`

```typescript
import { z } from 'zod';

// Auth
export const RegisterSchema = z.object({
  name: z.string().min(2, "Nom requis (min 2 caractères)"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe min 8 caractères"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

// Workspaces
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(3, "Nom requis (min 3 caractères)"),
  description: z.string().optional(),
  tag: z.enum([
    "maths", "info", "physique", "chimie", "svt",
    "langues", "droit", "general", "autre"
  ]),
});
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

// Sessions
export const CreateSessionSchema = z.object({
  workspaceId: z.string().min(1, "ID de workspace requis"),
});

export const UpdateSessionSchema = z.object({
  canvasState: z.any().optional(), // JSON
  editorState: z.any().optional(), // JSON
});
export type UpdateSessionInput = z.infer<typeof UpdateSessionSchema>;

export const EndSessionSchema = z.object({
  canvasState: z.any().optional(),
  editorState: z.any().optional(),
});
export type EndSessionInput = z.infer<typeof EndSessionSchema>;
```

**Utilisation dans API** :
```typescript
const body = await request.json();
const validated = CreateSessionSchema.safeParse(body);
if (!validated.success) return validationError(validated.error);

const { workspaceId } = validated.data; // Type-safe
```

**Utilisation dans forms** :
```typescript
const form = useForm<RegisterInput>({
  resolver: zodResolver(RegisterSchema),
  defaultValues: { name: '', email: '', password: '' },
});
```

### 4.4 Error Handling Pattern

#### Frontend (Stores)
```typescript
createSession: async (workspaceId) => {
  set({ isCreating: true, error: null });
  try {
    const { data } = await axios.post('/api/sessions', { workspaceId });
    set({ currentSession: data.data, isCreating: false });
    return data.data;
  } catch (error: any) {
    const message = error.response?.data?.error || "Erreur inconnue";
    set({ error: message, isCreating: false });
    throw new Error(message);
  }
}
```

#### Backend (API Routes)
```typescript
export async function POST(request: NextRequest) {
  try {
    // ... logic
    return successResponse(data, 201);
  } catch (error: any) {
    console.error('Error creating session:', error);
    return errorResponse('Erreur lors de la création', 500);
  }
}
```

#### Auto-save (Silent Failures)
```typescript
updateSession: async (sessionId, data) => {
  set({ isSaving: true });
  try {
    const { data: response } = await axios.put(`/api/sessions/${sessionId}`, data);
    // Update state silently
    set({ isSaving: false });
  } catch (error: any) {
    set({ isSaving: false });
    // Don't throw - auto-save should fail silently
    console.error('Auto-save failed:', error);
  }
}
```

### 4.5 Naming Conventions

#### Files
- **Components** : PascalCase (`AnimatedCounter.tsx`, `SessionCard.tsx`)
- **Pages** : lowercase (`page.tsx`, `layout.tsx`)
- **Utilities** : kebab-case (`auth-store.ts`, `api-response.ts`)
- **API Routes** : `route.ts` (Next.js convention)

#### Variables & Functions
- **Variables** : camelCase (`currentSession`, `isLoading`)
- **Constants** : UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Functions** : camelCase (`getCurrentUser`, `createSession`)
- **Components** : PascalCase (`SessionPage`, `WorkspaceCard`)

#### Types & Interfaces
- **Interfaces** : PascalCase (`Session`, `Workspace`, `User`)
- **Types** : PascalCase (`CreateSessionInput`, `MemberRole`)
- **Enums** : PascalCase (`WorkspaceTag`, `MemberRole`)

#### CSS Classes
- **Tailwind** : utility classes (`flex flex-col gap-4`)
- **Custom** : kebab-case (`session-canvas`, `workspace-card`)

---

## 5. Déploiement et environnement

### 5.1 Variables d'environnement

**Fichier** : `.env.local` (local dev) ou Vercel Environment Variables (prod)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Prod: https://studyspace.app

# Optional (Phase 3B+)
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=eu
```

**Accès** :
- **Client** : `process.env.NEXT_PUBLIC_*` (publiques)
- **Server** : `process.env.*` (privées)

### 5.2 Déploiement Vercel (Recommandé)

**Étapes** :
1. Connecter repo GitHub à Vercel
2. Configurer env variables dans Vercel dashboard
3. Deploy automatique sur chaque push (main branch)

**Configuration** :
```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"] // Paris region
}
```

**Build command** :
```bash
npm run build  # Next.js build + Prisma generate
```

**Prisma in production** :
```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

### 5.3 Database migrations (Production)

**Workflow** :
1. Dev : `npx prisma db push` (prototyping)
2. Prod-ready : `npx prisma migrate dev --name <description>`
3. Deploy : `npx prisma migrate deploy` (apply migrations)

**CI/CD (GitHub Actions - future)** :
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx prisma migrate deploy
      - run: npm run build
```

### 5.4 Monitoring (Future)

**Outils** :
- **Errors** : Sentry (crash reporting)
- **Performance** : Vercel Analytics
- **Logs** : Vercel Logs ou Datadog
- **Uptime** : UptimeRobot

---

## 6. Sécurité

### 6.1 Authentification & Sessions

**Méthode** : Cookie-based sessions via Supabase Auth

**Cookies** :
- `httpOnly: true` (no JS access)
- `secure: true` (HTTPS only in prod)
- `sameSite: 'lax'` (CSRF protection)

**Token refresh** :
- Automatique via `@supabase/ssr`
- Refresh token stocké en cookie sécurisé

### 6.2 Validation & Sanitization

**Validation** :
- Toutes les entrées validées avec Zod
- Frontend (React Hook Form) + Backend (API routes)

**Sanitization** :
- Prisma échappe automatiquement les paramètres SQL (prevent SQL injection)
- Next.js échappe les XSS dans JSX

### 6.3 Autorisations

**Pattern** :
```typescript
// Check authentication
const user = await getCurrentUser();
if (!user) return unauthorizedResponse();

// Check workspace membership
const isMember = await isWorkspaceMember(user.id, workspaceId);
if (!isMember) return forbiddenResponse();

// Check ownership
const isOwner = await isWorkspaceOwner(user.id, workspaceId);
if (!isOwner) return forbiddenResponse('Seul le propriétaire peut...');
```

**Helpers** :
```typescript
// lib/auth/session.ts
export const isWorkspaceMember = async (userId: string, workspaceId: string) => {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return !!member;
};

export const isWorkspaceOwner = async (userId: string, workspaceId: string) => {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return member?.role === 'OWNER';
};
```

### 6.4 CSRF Protection

**Next.js built-in** :
- SameSite cookies
- Origin checking

**No CSRF token needed** (cookie-based sessions with SameSite).

### 6.5 Rate Limiting (Future)

**Phase 3B+** :
- Vercel Edge Middleware + Upstash Redis
- Limiter : 100 req/min par IP

```typescript
// middleware.ts (future)
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}
```

---

## 7. Performance

### 7.1 Frontend Optimizations

#### React Compiler
- **Activé** : Memoization automatique
- **Impact** : Moins de re-renders inutiles

#### Code Splitting
- **App Router** : Automatic route-based splitting
- **Dynamic imports** (future) :
```typescript
const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

#### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Logo"
  priority // LCP optimization
/>
```

#### Tailwind CSS Purge
- **Automatique** : Tailwind v4 purge unused classes
- **Production bundle** : ~10 KB CSS (vs ~3 MB dev)

### 7.2 Backend Optimizations

#### Database Indexing
- Index sur FK : `userId`, `workspaceId`, `createdById`
- Index sur search : `email`, `inviteCode`
- Index sur sort : `startedAt`, `createdAt`

#### Query Optimization
```typescript
// ❌ BAD - N+1 queries
const workspaces = await prisma.workspace.findMany();
for (const ws of workspaces) {
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: ws.id }
  });
}

// ✅ GOOD - Include relation
const workspaces = await prisma.workspace.findMany({
  include: {
    members: true,
    _count: { select: { sessions: true } }
  }
});
```

#### Pagination
```typescript
const sessions = await prisma.session.findMany({
  where: { workspaceId },
  orderBy: { startedAt: 'desc' },
  take: 50, // Limit results
  skip: page * 50, // Offset
});
```

#### Connection Pooling
```typescript
// Prisma + pg
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
});
```

### 7.3 Caching (Future)

**Phase 3B+** :
- **Redis** : Cache workspace memberships, user profiles
- **Next.js Cache** : `revalidate` on data fetching
- **CDN** : Cloudflare for static assets

```typescript
// Future: Next.js cache
export const revalidate = 60; // ISR every 60s

export async function getWorkspace(id: string) {
  return await fetch(`/api/workspaces/${id}`, {
    next: { revalidate: 60 }
  });
}
```

---

## 8. Testing (Future)

### 8.1 Unit Tests (Jest + React Testing Library)

```typescript
// __tests__/stores/session-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useSession } from '@/lib/stores/session-store';

describe('useSession', () => {
  it('should create session', async () => {
    const { result } = renderHook(() => useSession());

    await act(async () => {
      const session = await result.current.createSession('workspace-id');
      expect(session.id).toBeDefined();
    });
  });
});
```

### 8.2 E2E Tests (Playwright)

```typescript
// e2e/session.spec.ts
import { test, expect } from '@playwright/test';

test('should create and auto-save session', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.goto('/dashboard/workspace/workspace-id');
  await page.click('text=Démarrer une session');

  await expect(page).toHaveURL(/\/dashboard\/session\/.+/);

  // Draw on canvas
  const canvas = page.locator('canvas');
  await canvas.hover();
  await page.mouse.down();
  await page.mouse.move(100, 100);
  await page.mouse.up();

  // Wait for auto-save
  await page.waitForTimeout(6000);
  await expect(page.locator('text=Sauvegardé')).toBeVisible();
});
```

---

## 9. Roadmap technique (Phases futures)

### 9.1 Phase 3B : Real-time Collaboration (1-2 mois)

**Objectif** : Multi-user editing avec synchronisation en temps réel

**Technologies** :
- **Yjs** : CRDT pour synchronisation sans conflits
- **TipTap** : Éditeur riche (markdown, formatting)
- **Konva.js** : Canvas avancé (formes, texte, images)
- **Pusher** ou **Supabase Realtime** : WebSockets
- **WebRTC** : Audio/vidéo P2P (Agora ou custom)

**Architecture** :
```
┌─────────────┐
│  Browser A  │──┐
└─────────────┘  │
                 │ WebSocket
┌─────────────┐  │  ┌──────────────┐
│  Browser B  │──┼──│ Pusher/WS    │
└─────────────┘  │  │   Server     │
                 │  └──────────────┘
┌─────────────┐  │
│  Browser C  │──┘
└─────────────┘

        Yjs CRDT synchronization
```

**Tâches** :
1. Intégrer Yjs + TipTap pour éditeur collaboratif
2. Remplacer Canvas HTML5 par Konva.js
3. Setup Pusher channels par session
4. Cursors collaboratifs (Yjs awareness)
5. Présence indicators (qui est en ligne)
6. WebRTC audio/vidéo (Agora SDK ou simple-peer)

### 9.2 Phase 4 : Fichiers & Ressources (3-4 semaines)

**Objectif** : Upload, stockage et partage de fichiers

**Technologies** :
- **Supabase Storage** : S3-compatible file storage
- **React Dropzone** : Drag & drop upload
- **PDF.js** : PDF viewer

**Tâches** :
1. API routes `/api/files` (upload, list, delete)
2. Supabase Storage buckets par workspace
3. Upload component (drag & drop)
4. File list dans workspace detail
5. File viewer (images, PDF preview)

### 9.3 Phase 5 : Fonctionnalités avancées (1-2 mois)

**Chat intégré** :
- WebSocket messages
- Markdown support
- File attachments

**Notifications** :
- Pusher ou Supabase Realtime
- Email notifications (Resend ou SendGrid)
- In-app notification center

**Analytics** :
- Temps d'étude par matière
- Graphiques (Recharts ou Chart.js)
- Export CSV

**Mode sombre** :
- Tailwind dark mode
- Theme toggle (localStorage)

---

## 10. Annexes

### 10.1 Commandes utiles

```bash
# Development
npm run dev                     # Start dev server
npm run dev:local               # Start on localhost only
npm run build                   # Production build
npm run start                   # Start production server
npm run lint                    # Run ESLint

# Database
npx prisma generate             # Generate Prisma client
npx prisma db push              # Sync schema to DB (dev)
npx prisma migrate dev          # Create migration
npx prisma migrate deploy       # Apply migrations (prod)
npx prisma studio               # Open Prisma Studio GUI

# Utilities
npm run network                 # Show network info (IP for mobile testing)
```

### 10.2 Structure de projet complète

```
StudySpace/
├── .claude/                    # MVP Documentation
│   ├── IDEA.md
│   ├── PRD.md
│   ├── ARCHI.md
│   └── TASKS/
│       ├── Task-1.md
│       └── ...
├── .github/                    # GitHub config (future)
│   └── workflows/
│       └── deploy.yml
├── .next/                      # Next.js build output (gitignored)
├── app/                        # Next.js App Router
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── invite/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── motion.tsx
│   └── AnimatedCounter.tsx
├── data/
│   └── landingPageData.ts
├── generated/                  # Prisma generated (gitignored)
│   └── prisma/
├── lib/
│   ├── auth/
│   ├── stores/
│   ├── supabase/
│   ├── animations.ts
│   ├── api-response.ts
│   ├── auth-errors.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── favicon.ico
│   └── ...
├── scripts/
│   └── show-network-info.js
├── .env.local                  # Environment variables (gitignored)
├── .eslintrc.json
├── .gitignore
├── CLAUDE.md                   # Project instructions
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── proxy.ts                    # Auth middleware
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### 10.3 Dépendances clés

**Production** :
```json
{
  "next": "16.0.5",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "^5",
  "@prisma/client": "^7.0.1",
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.86.0",
  "zustand": "^5.0.9",
  "zod": "^4.1.13",
  "react-hook-form": "^7.67.0",
  "framer-motion": "^12.23.24",
  "axios": "^1.13.2",
  "lucide-react": "^0.555.0",
  "tailwindcss": "^4"
}
```

**Dev** :
```json
{
  "prisma": "^7.0.1",
  "eslint": "^9",
  "babel-plugin-react-compiler": "1.0.0"
}
```

### 10.4 Ressources et documentation

**Official Docs** :
- Next.js : https://nextjs.org/docs
- Prisma : https://www.prisma.io/docs
- Supabase : https://supabase.com/docs
- Tailwind CSS : https://tailwindcss.com/docs
- shadcn/ui : https://ui.shadcn.com
- Zustand : https://zustand-demo.pmnd.rs
- Zod : https://zod.dev
- Framer Motion : https://www.framer.com/motion

**Phase 3B (Future)** :
- Yjs : https://docs.yjs.dev
- TipTap : https://tiptap.dev
- Konva.js : https://konvajs.org
- Pusher : https://pusher.com/docs

---

**Document approuvé pour référence technique MVP Phase 3A** ✅
**Maintenu par** : Équipe StudySpace
