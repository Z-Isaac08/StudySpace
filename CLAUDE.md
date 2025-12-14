# CLAUDE.md - StudySpace

## Project Overview

StudySpace is a collaborative study platform for students built with Next.js 16, enabling real-time collaboration through workspaces, study sessions, whiteboards, and shared editing.

**Status**: MVP Beta - Phase 2 (Authentication Complete)
**Current Branch**: `feature/workspaces`

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.5 (App Router)
- **React**: 19.2.0 with React Compiler enabled
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Components**: shadcn/ui (New York style) + Radix UI primitives
- **Animations**: Framer Motion 12.x
- **State**: Zustand 5.x for auth state
- **Forms**: React Hook Form 7.x + Zod 4.x
- **HTTP**: Axios for API calls
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes (app/api/)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 7 with @prisma/adapter-pg
- **Auth**: Supabase Auth (email/password)
- **Session**: Cookie-based via @supabase/ssr

## Project Structure

```
StudySpace/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group (login, register, etc.)
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── workspaces/    # Workspace CRUD + join
│   │   └── sessions/      # Study session management
│   ├── dashboard/         # Protected dashboard
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components (19 components)
│   ├── motion.tsx         # Framer Motion wrappers
│   └── AnimatedCounter.tsx
├── lib/
│   ├── stores/            # Zustand stores
│   │   └── auth-store.ts  # Auth state management
│   ├── supabase/          # Supabase clients
│   │   ├── client.ts      # Browser client
│   │   └── server.ts      # Server client
│   ├── auth/
│   │   └── session.ts     # Auth helpers & guards
│   ├── validations.ts     # All Zod schemas
│   ├── api-response.ts    # API response utilities
│   ├── auth-errors.ts     # Error message mapping (French)
│   ├── animations.ts      # Framer Motion presets
│   ├── prisma.ts          # Prisma client instance
│   └── utils.ts           # Utility functions (cn)
├── prisma/
│   └── schema.prisma      # Database models
├── data/
│   └── landingPageData.ts # Landing page content
├── proxy.ts               # Session proxy middleware
└── generated/             # Prisma generated types
```

## Key Commands

```bash
# Development
npm run dev                 # Start dev server (localhost:3000)

# Database
npx prisma generate         # Generate Prisma client
npx prisma db push          # Push schema to database
npx prisma studio           # Open Prisma Studio

# Build
npm run build               # Production build
npm run lint                # Run ESLint
```

## Code Conventions

### TypeScript
- Always use TypeScript, never JavaScript
- Enable strict mode (already configured)
- Use type inference where obvious, explicit types for function signatures
- Prefer `interface` for object shapes, `type` for unions/intersections

### Naming
- **Files**: kebab-case (`auth-store.ts`, `api-response.ts`)
- **Components**: PascalCase (`AnimatedCounter.tsx`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### API Routes
- Use Zod schemas from `lib/validations.ts` for all input validation
- Return responses using `lib/api-response.ts` helpers:
  ```typescript
  import { successResponse, errorResponse, validationError } from '@/lib/api-response'

  return successResponse(data)           // 200
  return successResponse(data, 201)      // 201 Created
  return errorResponse('Message', 400)   // Error with status
  return validationError(zodError)       // Validation failed
  ```
- Check authentication with `getCurrentUser()` from `lib/auth/session.ts`
- Check workspace permissions with `isWorkspaceMember()` / `isWorkspaceOwner()`

### Components
- Use shadcn/ui components from `components/ui/`
- Add new shadcn components via: `npx shadcn@latest add <component>`
- Use `cn()` utility for conditional classes
- Wrap animations with components from `components/motion.tsx`

### State Management
- Use Zustand for global state (auth only currently)
- Use React Hook Form for form state
- Local state with useState for component-specific needs

### Styling
- Use Tailwind CSS classes, avoid inline styles
- Design tokens defined in `app/globals.css` as CSS variables
- Color scale: primary, neutral, success, error, warning, info
- Animations respect `prefers-reduced-motion`

## Database Models

```
User ─────────────┬─ Workspaces (via WorkspaceMember)
                  ├─ Sessions (created sessions)
                  └─ Files (uploaded files)

Workspace ────────┬─ Members (WorkspaceMember)
                  ├─ Sessions
                  └─ Files

WorkspaceMember ── Links User ↔ Workspace (with role: OWNER | MEMBER)

Session ────────── Belongs to Workspace, created by User
                   Stores canvasState (JSON) and editorState (JSON)

File ───────────── Belongs to Workspace, uploaded by User
```

### Enums
- `WorkspaceTag`: maths, info, physique, chimie, svt, langues, droit, autre
- `MemberRole`: OWNER, MEMBER

## Authentication Flow

1. **Registration**: `/api/auth/register` → Supabase Auth → Email verification
2. **Login**: `/api/auth/login` → Validate → Upsert Prisma user profile → Return user
3. **Session**: Cookies managed by `@supabase/ssr`, refreshed by `proxy.ts`
4. **Protected routes**: `proxy.ts` redirects unauthenticated users to `/login`
5. **API protection**: Use `getCurrentUser()` to verify authentication

## API Endpoints

### Auth
- `POST /api/auth/register` - Register with name, email, password
- `POST /api/auth/login` - Login with email, password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Confirm password reset
- `POST /api/auth/resend-verification` - Resend verification email

### Workspaces
- `GET /api/workspaces` - List user's workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/[id]` - Get workspace details
- `PUT /api/workspaces/[id]` - Update workspace (owner only)
- `DELETE /api/workspaces/[id]` - Delete workspace (owner only)
- `POST /api/workspaces/join` - Join with invite code

### Sessions
- `GET /api/sessions?workspaceId=...` - List workspace sessions
- `POST /api/sessions` - Create session
- `POST /api/sessions/[id]/end` - End session with state

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Important Notes

1. **Language**: User-facing text is in **French**
2. **Error messages**: Mapped in `lib/auth-errors.ts` (French)
3. **Session proxy**: `proxy.ts` handles auth redirects for protected routes
4. **RLS**: Row Level Security enabled on Supabase tables
5. **React Compiler**: Enabled - automatic memoization, avoid manual useMemo/useCallback
6. **Validation**: All API inputs validated with Zod schemas in `lib/validations.ts`

## What's Implemented

- [x] Landing page with SEO, animations, WCAG compliance
- [x] Full authentication (register, login, logout, password reset, email verify)
- [x] Workspace CRUD with invite codes
- [x] Session creation and tracking
- [x] Database schema with relationships
- [x] UI component library (shadcn/ui)

## What's Next (Planned)

- [ ] Dashboard workspace cards UI
- [ ] Collaborative whiteboard (canvas state ready)
- [ ] Real-time editor (Yjs + TipTap)
- [ ] WebRTC video/audio
- [ ] File upload system
- [ ] Real-time presence indicators
