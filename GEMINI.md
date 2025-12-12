# GEMINI.md - Instructions pour l'assistant IA

## 📋 Contexte du projet

**Nom du projet :** StudySpace  
**Type :** Plateforme web de collaboration pour étudiants (MVP Beta)  
**Stack technique :** Next.js 16 (canary), React 18, TypeScript, TailwindCSS, shadcn/ui, Supabase  
**Objectif :** Permettre aux étudiants de réviser ensemble à distance avec visio + tableau blanc + éditeur d'équations + gestion de fichiers dans une interface unifiée.

**Statut actuel :** Phase de développement MVP

- ✅ Landing page avec animations
- ✅ Authentification Supabase + Zustand
- ⏳ Workspaces collaboratifs
- ⏳ Tableau blanc temps réel
- ⏳ Éditeur d'équations

---

## 🛠️ Stack technique (État actuel)

### Frontend

- **Framework :** Next.js 16 (canary) avec App Router
- **UI Library :** React 18
- **Language :** TypeScript 5.x (strict mode)
- **Styling :** TailwindCSS 3.4
- **Components :** shadcn/ui (Radix UI + Tailwind)
- **Animations :** Framer Motion 11
- **State Management :** Zustand (auth store actuel)
- **HTTP Client :** Axios (remplace fetch)
- **Forms :** React Hook Form + Zod
- **Icons :** Lucide React
- **Font :** Plus Jakarta Sans (Google Fonts)

### Backend & Services

- **Backend :** Next.js API Routes
- **Database :** PostgreSQL via Supabase
- **ORM :** Prisma 5.x
- **Auth :** Supabase Auth (email/password)
- **Storage :** Supabase Storage (future)
- **Proxy :** Next.js 16 Proxy (remplace middleware)

### Outils futurs (non implémentés)

- **Visio :** À décider (Agora SDK ou Daily.co)
- **Canvas :** À décider (Konva.js ou Fabric.js)
- **Équations :** MathLive
- **Editor collaboratif :** Yjs + TipTap

---

## 📐 Conventions de code

### Nommage

**Variables & Fonctions :** `camelCase`

```typescript
const userId = 123;
const workspaceName = "Maths";
function createWorkspace() {}
```

**Classes & Types :** `PascalCase`

```typescript
interface User {}
type WorkspaceTag = "maths" | "info";
```

**Constantes globales :** `UPPER_SNAKE_CASE`

```typescript
const MAX_FILE_SIZE = 50_000_000;
```

**Composants React :** `PascalCase.tsx`

```typescript
// Fichier : WorkspaceCard.tsx
export function WorkspaceCard() {}
```

**Hooks custom :** `use[Name].ts`

```typescript
// Fichier : useWorkspace.ts
export function useWorkspace() {}
```

**Stores Zustand :** `[name]-store.ts`

```typescript
// Fichier : auth-store.ts
export const useAuthStore = create();
export const useAuth = () => useAuthStore();
```

### Structure de fichiers (Actuelle)

```
app/
  (auth)/              # Route group auth (login, register)
    layout.tsx         # Layout auth partagé
    login/page.tsx
    register/page.tsx
  dashboard/           # Page dashboard
    page.tsx
  api/auth/            # API routes Supabase
    login/route.ts
    register/route.ts
    logout/route.ts
    me/route.ts
  layout.tsx           # Root layout
  page.tsx             # Landing page
  globals.css          # Styles globaux + design system

components/
  ui/                  # shadcn/ui components
  AnimatedCounter.tsx  # Composants custom

lib/
  stores/
    auth-store.ts      # Zustand auth state
  supabase/
    client.ts          # Client browser
    server.ts          # Client server
    proxy.ts           # Proxy helper
  api-response.ts      # Helpers réponses API
  prisma.ts            # Prisma client
  validations.ts       # Schémas Zod

data/
  landingPageData.ts   # Données landing page

prisma/
  schema.prisma        # Schema DB

proxy.ts               # Next.js 16 Proxy (ex-middleware)
```

### TypeScript strict

**TOUJOURS :**

```typescript
// ✅ BON
interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: () => void;
}

function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {}
```

**JAMAIS `any` :**

```typescript
// ❌ INTERDIT
const data: any = await axios.get();

// ✅ BON
const { data }: AxiosResponse<ApiResponse<Workspace>> = await axios.get();
```

### API Calls avec Axios

**Utiliser Axios au lieu de fetch :**

```typescript
// ✅ BON
const { data } = await axios.post("/api/auth/login", {
  email,
  password,
});

// ❌ NE PAS utiliser fetch
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### Zustand State Management

**Pattern recommandé :**

```typescript
// Stores : lib/stores/[name]-store.ts
export const useMyStore = create<MyStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        data: null,

        // Actions
        setData: (data) => set({ data }),
      }),
      { name: "my-storage" }
    ),
    { name: "MyStore" }
  )
);

// Hook convenience
export const useMyData = () => {
  const store = useMyStore();
  return {
    data: store.data,
    setData: store.setData,
  };
};
```

### Styling avec Tailwind

**Utiliser `bg-linear-*` au lieu de `bg-gradient-*` :**

```typescript
// ✅ BON
<div className="bg-linear-to-br from-primary-600 to-primary-400">

// ❌ ÉVITER (Next.js convention)
<div className="bg-gradient-to-br from-primary-600 to-primary-400">
```

**Responsive mobile-first :**

```typescript
<div className="flex flex-col sm:flex-row md:gap-8">
```

**Classes conditionnelles avec cn() :**

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes"
)}>
```

---

## 🎨 Design System

### Palette de couleurs

```
Primary (Bleu):     #3B82F6
Success (Vert):     #22C55E
Error (Rouge):      #EF4444
Warning (Orange):   #F59E0B
Info (Bleu ciel):   #0EA5E9

Neutral 50:  #FAFAFA
Neutral 900: #171717
```

### Typography

- **Font :** Plus Jakarta Sans (Google Fonts)
- **Hiérarchie :**
  ```
  h1: text-4xl (36px) font-bold
  h2: text-3xl (30px) font-bold
  h3: text-2xl (24px) font-semibold
  body: text-base (16px)
  ```

### Animations

```
Ultra fast: 100ms (hover)
Fast:       200ms (dropdowns)
Standard:   300ms (modals)
Slow:       500ms (page transitions)

Easing: ease-out par défaut
```

---

## 🚫 Règles strictes

### TOUJOURS

✅ **TypeScript strict** - Pas de `any`, typer toutes les fonctions  
✅ **Axios pour API calls** - Pas de fetch  
✅ **Zustand pour state global** - Pas de React Context pour auth  
✅ **"use client"** quand nécessaire - Hooks, events, browser APIs  
✅ **Accessibilité** - aria-labels, keyboard navigation  
✅ **Responsive** - Mobile-first  
✅ **Error handling** - try/catch avec messages clairs  
✅ **console.log pour debugging** - Avec emojis pour tracer (📨, ✅, ❌, 🔐, 💾, 💥)

### JAMAIS

❌ **fetch()** - Utiliser axios  
❌ **React Context pour auth** - Utiliser Zustand  
❌ **`any` en TypeScript** - Toujours typer  
❌ **Secrets en dur** - Utiliser `.env.local`  
❌ **Code dupliqué** - Extraire en fonctions/composants  
❌ **Composants > 200 lignes** - Découper  
❌ **Inline styles** - Utiliser Tailwind  
❌ **`bg-gradient-*`** - Utiliser `bg-linear-*`

---

## 📝 Architecture décisions

### Authentification : Supabase (pas Firebase)

**Choix :**

- ✅ Supabase Auth + Zustand
- ✅ API routes (`/api/auth/*`)
- ✅ Prisma pour user profiles
- ✅ Cookies gérés par Supabase

**Raisons :**

- PostgreSQL relationnel meilleur pour workspaces
- Row Level Security intégré
- Bon pour collaboration temps réel
- Déjà setup, fonctionne

### Next.js 16 Proxy (ex-Middleware)

**Fichier :** `proxy.ts` (root)
**Function :** `export async function proxy(request: NextRequest)`

**Matcher pattern :** Exclut API, static files, images

---

## 🎯 Cas d'usage spécifiques

### API Route avec Supabase

```typescript
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create Supabase client
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Use Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(data);
  } catch (error: any) {
    console.error("Error:", error);
    return errorResponse(error.message, 500);
  }
}
```

### Zustand Store Pattern

```typescript
import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MyState {
  data: Data | null;
  isLoading: boolean;
}

interface MyActions {
  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyState & MyActions>()(
  devtools(
    persist(
      (set) => ({
        data: null,
        isLoading: false,

        fetchData: async () => {
          set({ isLoading: true });
          try {
            const { data } = await axios.get("/api/data");
            set({ data: data.data, isLoading: false });
          } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.message);
          }
        },
      }),
      { name: "my-storage" }
    ),
    { name: "MyStore" }
  )
);
```

---

## Philosophie de développement

### MVP First

- Un MVP fonctionnel > un produit parfait
- Implémenter le strict nécessaire
- Optimiser quand les données le justifient

### Code Quality

- Simplicité > Complexité
- Code lisible > Code clever
- DRY mais pas à l'excès

### User Experience

- Loading states partout
- Messages d'erreur clairs
- Feedback immédiat

---

## 🎯 Objectif du projet

**MVP Beta (500 early adopters) :**

- Landing page ✅
- Auth Supabase ✅
- Workspaces collaboratifs ⏳
- Tableau blanc ⏳
- Visio ⏳
- Partage fichiers ⏳

**Success Metrics :**

- 100 utilisateurs actifs en 3 mois
- Performance (Lighthouse > 90)
- Code maintenable et scalable

**Ton succès = Le succès de StudySpace.** 🚀
