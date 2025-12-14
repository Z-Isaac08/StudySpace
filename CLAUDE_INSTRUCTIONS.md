# CLAUDE_INSTRUCTIONS.md - Instructions pour Claude AI

Ce document contient les instructions spécifiques pour guider Claude lors du développement de StudySpace.

## 🎯 Contexte du Projet

**StudySpace** est une plateforme collaborative de révision pour étudiants, construite avec:
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- **Backend**: Next.js API Routes, Prisma 7, PostgreSQL via Supabase
- **Auth**: Supabase Auth avec cookies
- **UI**: shadcn/ui (19 composants installés)
- **État**: Zustand pour l'auth
- **Langue**: Interface en **FRANÇAIS**

## 📋 État Actuel du Projet

### ✅ Complété (Phase 1-2)
- Landing page (SEO, animations, WCAG)
- Système d'authentification complet
- Dashboard avec sidebar/header
- Gestion des workspaces (CRUD, invite codes)
- Page détail workspace (membres, sessions, fichiers tabs)
- WorkspaceCard component avec tags colorés
- Session creation via API

### 🚧 À Implémenter (Phase 3+)
1. **Collaborative Whiteboard** (PRIORITÉ)
2. Real-time Editor (Yjs + TipTap)
3. File Upload System
4. WebRTC Video/Audio
5. Real-time Presence

## 🎨 Design System & Conventions

### Couleurs
```typescript
// Primaire
primary-500: #3B82F6 (bleu)

// Tags de matière
tag-maths: #3B82F6 (bleu)
tag-info: #10B981 (vert)
tag-physique: #8B5CF6 (violet)
tag-chimie: #F59E0B (orange)
tag-svt: success (vert)
tag-langues: #EC4899 (rose)
tag-droit: #EAB308 (jaune)

// Feedback
success-500: #22C55E
error-500: #EF4444
warning-500: #F59E0B
info-500: #0EA5E9
```

### Typographie
- **Police**: Inter (déjà chargée)
- **Titres**: h1 (text-3xl), h2 (text-2xl), h3 (text-xl)
- **Corps**: text-base (16px)
- **Small**: text-sm (14px)

### Spacing
- Utiliser **uniquement des multiples de 4** (space-2, space-4, space-6, etc.)
- Padding des cards: `p-4` ou `p-6`
- Gap entre éléments: `gap-4` ou `gap-6`

### Composants Standards
Toujours utiliser les composants shadcn/ui existants:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// etc.
```

## 📝 Conventions de Code

### Nommage
```typescript
// Fichiers
- Composants: PascalCase.tsx (WorkspaceCard.tsx)
- Utilitaires: camelCase.ts (formatDate.ts)
- Hooks: use*.ts (useWorkspace.ts)

// Variables
const userId = "123"              // camelCase
const MAX_FILE_SIZE = 50_000_000  // UPPER_SNAKE_CASE pour constantes
const isLoading = true            // is/has/can pour booléens

// Fonctions
function createWorkspace() {}     // camelCase, verbe infinitif
function handleClick() {}         // handle* pour event handlers
function isValidEmail() {}        // is/has/can pour prédicats
```

### Structure des Composants
```typescript
"use client" // Seulement si nécessaire

import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}
```

### API Routes Pattern
```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, validationError } from '@/lib/api-response'
import { getCurrentUser } from '@/lib/auth/session'
import { SomeSchema } from '@/lib/validations'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'auth
    const user = await getCurrentUser()
    if (!user) return errorResponse('Non autorisé', 401)

    // 2. Valider les données
    const body = await request.json()
    const validation = SomeSchema.safeParse(body)
    if (!validation.success) return validationError(validation.error)

    // 3. Logique métier
    const data = validation.data
    const result = await prisma.workspace.create({ data })

    // 4. Retourner la réponse
    return successResponse(result, 201)
  } catch (error) {
    console.error('[RESOURCE_POST]', error)
    return errorResponse('Erreur serveur', 500)
  }
}
```

## 🛠️ Workflows de Développement

### Ajouter une Nouvelle Feature

1. **Lire la documentation existante**
   - Consulter les CLAUDE.md dans `app/`, `lib/`, `components/`, `prisma/`
   - Vérifier les patterns existants

2. **Respecter les conventions**
   - Utiliser les helpers existants (`api-response.ts`, `validations.ts`)
   - Réutiliser les composants shadcn/ui
   - Suivre la structure de fichiers établie

3. **Validation Zod**
   - Toujours définir les schemas dans `lib/validations.ts`
   - Valider TOUS les inputs API

4. **Messages en Français**
   - Interface utilisateur: 100% français
   - Commentaires code: anglais OK
   - Erreurs utilisateur: français (voir `lib/auth-errors.ts`)

5. **Gestion des États**
   ```typescript
   // Loading
   const [isLoading, setIsLoading] = useState(false)

   // Error
   const [error, setError] = useState("")

   // Success feedback
   // Utiliser toast ou inline message
   ```

### Ajouter un Composant shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

Composants déjà installés (19):
- accordion, alert, avatar, badge, button, card, checkbox
- dialog, dropdown-menu, form, input, label, radio-group
- select, separator, table, tabs, tooltip

### Créer une Page Protégée

Les pages dans `app/(dashboard)/` sont automatiquement protégées par:
1. Le layout `(dashboard)/layout.tsx` qui vérifie l'auth
2. Le middleware `proxy.ts` qui redirige vers `/login`

```typescript
// Pas besoin de vérifier l'auth dans la page, c'est fait au niveau layout
export default function MyProtectedPage() {
  return <div>Contenu protégé</div>
}
```

## ⚠️ Règles Strictes

### ❌ À ÉVITER ABSOLUMENT

1. **Ne JAMAIS**:
   - Modifier les fichiers dans `generated/` (Prisma)
   - Créer des composants UI custom si shadcn/ui existe
   - Utiliser `any` en TypeScript
   - Mettre des secrets en dur (utiliser `process.env`)
   - Oublier la validation côté serveur
   - Ignorer les erreurs (toujours gérer try/catch)

2. **Ne PAS créer de nouveaux fichiers pour**:
   - Validations → ajouter dans `lib/validations.ts`
   - Helpers API → ajouter dans `lib/api-response.ts`
   - Utilitaires → ajouter dans `lib/utils.ts` ou créer fichier dédié

3. **Ne PAS mélanger les responsabilités**:
   - Logique métier → dans `lib/` ou services
   - UI → dans `components/`
   - API → dans `app/api/`

### ✅ À TOUJOURS FAIRE

1. **Accessibilité**:
   - Labels sur tous les inputs
   - aria-label sur les icônes seules
   - Navigation au clavier fonctionnelle
   - Contraste minimum 4.5:1

2. **Responsive**:
   - Tester sur mobile (min 375px)
   - Utiliser les breakpoints Tailwind (sm:, md:, lg:)
   - Mobile-first approach

3. **Performance**:
   - Images optimisées
   - Lazy loading si liste longue
   - Pagination pour grandes datasets

4. **Sécurité**:
   - Valider inputs côté serveur
   - Vérifier permissions workspace (owner/member)
   - Sanitize user inputs

## 🎯 Prochaines Features à Implémenter

### 1. Collaborative Whiteboard (PRIORITÉ)

**Contexte**: Le bouton "Commencer une session" existe mais ne fait que créer une entrée en DB. Il faut créer l'interface canvas.

**Structure à créer**:
```
app/(dashboard)/dashboard/workspace/[id]/session/[sessionId]/
└── page.tsx  # Canvas page

components/whiteboard/
├── Canvas.tsx           # Main canvas component
├── Toolbar.tsx          # Drawing tools (pen, eraser, shapes)
├── ColorPicker.tsx      # Color selection
└── ParticipantsList.tsx # Who's in the session
```

**Fonctionnalités minimum**:
- Canvas HTML5 avec dessins libres (pen tool)
- Outils: crayon, gomme, couleurs
- Bouton "Terminer session" qui sauvegarde le canvasState
- Appel API `POST /api/sessions/[id]/end` avec state

**Plus tard** (phase 2):
- Real-time sync avec WebSocket/Pusher
- Formes géométriques
- Texte

### 2. Real-time Editor

**Stack suggéré**: Yjs + TipTap
**Storage**: Session.editorState (JSON)

### 3. File Upload

**Stack**: Supabase Storage
**Modèle**: File (déjà en DB)
**UI**: Files tab dans workspace detail (marqué "coming soon")

## 📚 Ressources Importantes

### Documentation Interne
- `CLAUDE.md` (racine) - Vue d'ensemble complète
- `app/CLAUDE.md` - Routes et API patterns
- `lib/CLAUDE.md` - Utilitaires et validations
- `components/CLAUDE.md` - Composants UI
- `prisma/CLAUDE.md` - Schéma DB et queries
- `docs/StudySpace - Guide de développement.txt` - Guide complet (2000+ lignes)

### Liens Externes
- [shadcn/ui docs](https://ui.shadcn.com)
- [Next.js 15 docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Prisma docs](https://www.prisma.io/docs)

## 🐛 Debugging

### Erreurs Courantes

**1. "Prisma Client not generated"**
```bash
npx prisma generate
```

**2. "Module not found '@/generated/prisma'"**
```bash
npx prisma generate
# Puis restart du serveur dev
```

**3. API retourne 401**
- Vérifier que `getCurrentUser()` est appelé
- Vérifier que le cookie de session existe
- Tester avec l'utilisateur connecté

**4. Validation échoue**
- Vérifier le schema Zod dans `lib/validations.ts`
- Console.log le body avant validation
- Utiliser `validationError(error)` pour retourner détails

## 🎨 Exemples de Code

### Créer un Nouveau Composant UI

```typescript
// components/workspace/WorkspaceHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Users } from "lucide-react"

interface WorkspaceHeaderProps {
  name: string
  tag: string
  memberCount: number
  onSettingsClick: () => void
}

export function WorkspaceHeader({
  name,
  tag,
  memberCount,
  onSettingsClick
}: WorkspaceHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        <Badge variant="outline">{tag}</Badge>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {memberCount} membre{memberCount > 1 ? 's' : ''}
        </span>

        <Button variant="ghost" size="icon" onClick={onSettingsClick}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

### Créer une Route API

```typescript
// app/api/files/route.ts
import { NextRequest } from 'next/server'
import { successResponse, errorResponse, validationError } from '@/lib/api-response'
import { getCurrentUser } from '@/lib/auth/session'
import { UploadFileSchema } from '@/lib/validations'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return errorResponse('Non autorisé', 401)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const workspaceId = formData.get('workspaceId') as string

    // Validation
    const validation = UploadFileSchema.safeParse({
      workspaceId,
      name: file.name,
      size: file.size
    })
    if (!validation.success) return validationError(validation.error)

    // TODO: Upload to Supabase Storage
    // TODO: Create file record in DB

    return successResponse({ id: 'file-id' }, 201)
  } catch (error) {
    console.error('[FILES_POST]', error)
    return errorResponse('Erreur lors de l\'upload', 500)
  }
}
```

### Ajouter un Schema Zod

```typescript
// lib/validations.ts
export const UploadFileSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(255),
  size: z.number().max(50_000_000), // 50MB max
})

export type UploadFileInput = z.infer<typeof UploadFileSchema>
```

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev

# Build
npm run build
npm start

# Database
npx prisma generate       # Générer client Prisma
npx prisma db push        # Sync schema avec DB
npx prisma studio         # GUI pour la DB

# Linting
npm run lint

# Ajouter composant shadcn
npx shadcn@latest add <component>
```

## 📖 Philosophie de Développement

1. **Simplicité > Complexité**: Ne pas over-engineer
2. **Conventions > Configuration**: Suivre les patterns existants
3. **User Experience First**: Interface claire et française
4. **Accessibilité**: WCAG AA minimum
5. **Performance**: Lazy loading, optimisations
6. **Sécurité**: Validation, permissions, sanitization

## 🎯 Checklist Avant Commit

- [ ] Code lint sans erreur
- [ ] TypeScript strict (pas de `any`)
- [ ] Validation Zod pour inputs API
- [ ] Messages d'erreur en français
- [ ] Responsive testé (mobile + desktop)
- [ ] Accessibilité (labels, keyboard nav)
- [ ] Loading states gérés
- [ ] Error states gérés

---

**Maintenu par**: L'équipe StudySpace
**Dernière mise à jour**: Décembre 2024
**Version**: 1.0.0
