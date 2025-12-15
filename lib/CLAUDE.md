# CLAUDE.md - Lib Directory

This directory contains shared utilities, configurations, and core logic.

## Directory Structure

```
lib/
├── stores/
│   └── auth-store.ts       # Zustand auth state management
├── supabase/
│   ├── client.ts           # Browser Supabase client
│   ├── server.ts           # Server Supabase client
│   └── proxy.ts            # Session proxy utilities
├── auth/
│   └── session.ts          # Auth helpers & guards
├── validations.ts          # All Zod validation schemas
├── api-response.ts         # API response utilities
├── auth-errors.ts          # Error message mapping (French)
├── animations.ts           # Framer Motion presets
├── prisma.ts               # Prisma client singleton
└── utils.ts                # General utilities
```

## Key Files

### `validations.ts` - Zod Schemas

All API input validation schemas are defined here:

```typescript
import { z } from 'zod'

// User schemas
export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Workspace schemas
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(3),
  tag: z.enum(['maths', 'info', 'physique', 'chimie', 'svt', 'langues', 'droit', 'autre']).optional(),
})

// Session schemas
export const CreateSessionSchema = z.object({
  workspaceId: z.string().uuid(),
})

export const EndSessionSchema = z.object({
  sessionId: z.string().uuid(),
  canvasState: z.any().optional(),
  editorState: z.any().optional(),
})

// Infer types
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type LoginInput = z.infer<typeof LoginSchema>
// ...
```

### `api-response.ts` - Response Helpers

```typescript
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: Array<{ path: string; message: string }>
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data },
    { status }
  )
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: message },
    { status }
  )
}

export function validationError(error: ZodError) {
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      error: 'Validation échouée',
      details: error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    },
    { status: 400 }
  )
}
```

### `auth/session.ts` - Auth Helpers

```typescript
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

// Get current authenticated user with Prisma profile
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const profile = await prisma.user.findUnique({
    where: { id: user.id }
  })

  return profile
}

// Throw if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Non autorisé')
  return user
}

// Check workspace ownership
export async function isWorkspaceOwner(userId: string, workspaceId: string) {
  const member = await prisma.workspaceMember.findFirst({
    where: { userId, workspaceId, role: 'OWNER' }
  })
  return !!member
}

// Check workspace membership
export async function isWorkspaceMember(userId: string, workspaceId: string) {
  const member = await prisma.workspaceMember.findFirst({
    where: { userId, workspaceId }
  })
  return !!member
}
```

### `stores/auth-store.ts` - Zustand Store

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true })
        const { data } = await axios.post('/api/auth/login', { email, password })
        set({ user: data.data, isAuthenticated: true, isLoading: false })
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        await axios.post('/api/auth/register', { name, email, password })
        set({ isLoading: false })
      },

      logout: async () => {
        await axios.post('/api/auth/logout')
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        try {
          const { data } = await axios.get('/api/auth/me')
          set({ user: data.data, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) }
  )
)
```

### `auth-errors.ts` - Error Mapping

Maps Supabase error codes to French user-friendly messages:

```typescript
export const authErrorMessages: Record<string, string> = {
  'invalid_credentials': 'Email ou mot de passe incorrect',
  'email_not_confirmed': 'Veuillez vérifier votre email',
  'user_already_exists': 'Un compte existe déjà avec cet email',
  'weak_password': 'Le mot de passe doit contenir au moins 8 caractères',
  'over_request_rate_limit': 'Trop de tentatives, réessayez plus tard',
  // ...
}

export function getAuthErrorMessage(code: string): string {
  return authErrorMessages[code] || 'Une erreur est survenue'
}
```

### `animations.ts` - Framer Motion Presets

```typescript
export const durations = {
  ultraFast: 0.1,
  fast: 0.2,
  standard: 0.3,
  slow: 0.5,
}

export const easings = {
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
}

export const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
  // ... more variants
}
```

### `prisma.ts` - Prisma Client

```typescript
import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

### `utils.ts` - Utilities

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Supabase Clients

### Browser Client (`supabase/client.ts`)
- Used in client components
- Created with `createBrowserClient()`

### Server Client (`supabase/server.ts`)
- Used in API routes and server components
- Created with `createServerClient()` using cookies

## Best Practices

1. **Add new schemas to `validations.ts`** - Keep all validation centralized
2. **Use `getCurrentUser()` in API routes** - Always verify authentication
3. **Check permissions before operations** - Use `isWorkspaceMember()` / `isWorkspaceOwner()`
4. **Use the Zustand store for auth state** - Don't create separate auth state
5. **Use error mapping for user messages** - Keep messages in French
