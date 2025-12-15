# CLAUDE.md - App Directory

This directory contains the Next.js 16 App Router structure.

## Directory Structure

```
app/
├── (auth)/                 # Route group - no URL segment added
│   ├── layout.tsx          # Shared auth layout (split screen design)
│   ├── login/page.tsx      # /login
│   ├── register/page.tsx   # /register
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── verify-email/page.tsx
├── api/                    # API routes
│   ├── auth/               # /api/auth/*
│   ├── workspaces/         # /api/workspaces/*
│   ├── sessions/           # /api/sessions/*
│   └── health/             # /api/health
├── dashboard/
│   └── page.tsx            # /dashboard (protected)
├── layout.tsx              # Root layout
├── page.tsx                # / (landing page)
├── globals.css             # Global styles & design tokens
├── robots.ts               # SEO robots.txt generation
└── sitemap.ts              # SEO sitemap generation
```

## Route Groups

### `(auth)` Group
- Parentheses mean this folder doesn't create a URL segment
- All auth pages share `layout.tsx` with split-screen design:
  - Left: Form content
  - Right: Animated gradient visual with stats
- Pages are client components (`"use client"`) for form interactivity

## API Route Patterns

All API routes follow this structure:

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, validationError } from '@/lib/api-response'
import { SomeSchema } from '@/lib/validations'
import { getCurrentUser } from '@/lib/auth/session'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return errorResponse('Non autorisé', 401)

    // ... logic
    return successResponse(data)
  } catch (error) {
    console.error('[RESOURCE_GET]', error)
    return errorResponse('Erreur serveur', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return errorResponse('Non autorisé', 401)

    const body = await request.json()
    const validation = SomeSchema.safeParse(body)
    if (!validation.success) return validationError(validation.error)

    // ... logic
    return successResponse(data, 201)
  } catch (error) {
    console.error('[RESOURCE_POST]', error)
    return errorResponse('Erreur serveur', 500)
  }
}
```

### Dynamic Routes
- `[id]` folders for single resource operations
- Example: `app/api/workspaces/[id]/route.ts` handles GET/PUT/DELETE

```typescript
// Accessing route params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // Next.js 15+ requires await
  // ...
}
```

## Page Patterns

### Server Components (Default)
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Can use async/await directly
  // Can fetch data server-side
  return <div>...</div>
}
```

### Client Components
```typescript
// app/(auth)/login/page.tsx
"use client"

import { useAuthStore } from '@/lib/stores/auth-store'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { login } = useAuthStore()
  const router = useRouter()
  // ...
}
```

## Layouts

### Root Layout (`layout.tsx`)
- Sets up HTML structure, fonts, metadata
- Wraps children with providers if needed
- Contains global metadata for SEO

### Auth Layout (`(auth)/layout.tsx`)
- Split-screen design
- Animated gradient background on right
- Responsive (hides visual on mobile)

## SEO Files

### `robots.ts`
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://studyspace.fr/sitemap.xml',
  }
}
```

### `sitemap.ts`
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://studyspace.fr', lastModified: new Date() },
    // ...
  ]
}
```

## Protected Routes

Routes under `/dashboard/*` are protected by `proxy.ts` middleware:
- Unauthenticated users → redirected to `/login`
- Authenticated users → session refreshed, proceed to page

## Best Practices

1. **API Routes**: Always validate input with Zod, always check auth
2. **Error Handling**: Use try/catch, log with context prefix (e.g., `[WORKSPACES_POST]`)
3. **Responses**: Use helpers from `@/lib/api-response`
4. **Client Components**: Only add `"use client"` when needed (forms, hooks, interactivity)
5. **Metadata**: Export metadata object for SEO on public pages
