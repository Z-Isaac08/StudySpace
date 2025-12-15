# CLAUDE.md - Prisma Directory

This directory contains the Prisma ORM configuration and database schema.

## Directory Structure

```
prisma/
├── schema.prisma           # Database schema definition
└── migrations/             # Database migration files
```

## Schema Overview

### Models

```prisma
// schema.prisma

generator client {
  provider        = "prisma-client-js"
  output          = "../generated/prisma"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ USERS ============
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String?  @map("password_hash")
  name         String
  avatar       String?
  lastLoginAt  DateTime? @map("last_login_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  workspaces        WorkspaceMember[]
  sessions          Session[]
  files             File[]
  createdWorkspaces Workspace[]

  @@map("users")
}

// ============ WORKSPACES ============
model Workspace {
  id          String        @id @default(uuid())
  name        String
  description String?
  tag         WorkspaceTag  @default(autre)
  inviteCode  String        @unique @map("invite_code")
  createdById String        @map("created_by_id")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  // Relations
  createdBy   User              @relation(fields: [createdById], references: [id])
  members     WorkspaceMember[]
  sessions    Session[]
  files       File[]

  @@map("workspaces")
}

model WorkspaceMember {
  id          String     @id @default(uuid())
  userId      String     @map("user_id")
  workspaceId String     @map("workspace_id")
  role        MemberRole @default(MEMBER)
  joinedAt    DateTime   @default(now()) @map("joined_at")

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
  @@index([userId])
  @@index([workspaceId])
  @@map("workspace_members")
}

// ============ SESSIONS ============
model Session {
  id          String    @id @default(uuid())
  workspaceId String    @map("workspace_id")
  createdById String    @map("created_by_id")
  title       String?
  startedAt   DateTime  @default(now()) @map("started_at")
  endedAt     DateTime? @map("ended_at")
  duration    Int?      // Duration in seconds
  canvasState Json?     @map("canvas_state")
  editorState Json?     @map("editor_state")
  createdAt   DateTime  @default(now()) @map("created_at")

  // Relations
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdBy User      @relation(fields: [createdById], references: [id])

  @@index([workspaceId])
  @@index([createdById])
  @@index([startedAt])
  @@map("sessions")
}

// ============ FILES ============
model File {
  id          String   @id @default(uuid())
  workspaceId String   @map("workspace_id")
  uploadedById String  @map("uploaded_by_id")
  name        String
  size        Int      // Size in bytes
  mimeType    String   @map("mime_type")
  url         String   // Supabase Storage URL
  uploadedAt  DateTime @default(now()) @map("uploaded_at")

  // Relations
  workspace  Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  uploadedBy User      @relation(fields: [uploadedById], references: [id])

  @@index([workspaceId])
  @@index([uploadedById])
  @@map("files")
}

// ============ ENUMS ============
enum WorkspaceTag {
  maths
  info
  physique
  chimie
  svt
  langues
  droit
  autre
}

enum MemberRole {
  OWNER
  MEMBER
}
```

## Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (DESTRUCTIVE)
npx prisma migrate reset
```

## Usage Patterns

### Importing Prisma Client

```typescript
import prisma from '@/lib/prisma'
```

### Basic Queries

```typescript
// Find user by ID
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// Find user by email
const user = await prisma.user.findUnique({
  where: { email }
})

// Create user
const user = await prisma.user.create({
  data: {
    id: supabaseUser.id,  // Use Supabase Auth ID
    email,
    name,
  }
})

// Update user
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: newName, lastLoginAt: new Date() }
})

// Upsert user
const user = await prisma.user.upsert({
  where: { id: userId },
  update: { lastLoginAt: new Date() },
  create: { id: userId, email, name }
})
```

### Workspace Queries

```typescript
// Get user's workspaces with counts
const workspaces = await prisma.workspace.findMany({
  where: {
    members: { some: { userId } }
  },
  include: {
    _count: {
      select: {
        members: true,
        sessions: true,
        files: true,
      }
    }
  }
})

// Create workspace with owner
const workspace = await prisma.workspace.create({
  data: {
    name,
    tag,
    inviteCode: generateInviteCode(),
    createdById: userId,
    members: {
      create: {
        userId,
        role: 'OWNER'
      }
    }
  }
})

// Get workspace with all relations
const workspace = await prisma.workspace.findUnique({
  where: { id: workspaceId },
  include: {
    members: {
      include: { user: true }
    },
    sessions: {
      take: 50,
      orderBy: { startedAt: 'desc' }
    },
    files: true,
    _count: {
      select: { members: true, sessions: true, files: true }
    }
  }
})

// Join workspace
const member = await prisma.workspaceMember.create({
  data: {
    userId,
    workspaceId,
    role: 'MEMBER'
  }
})
```

### Session Queries

```typescript
// Create session
const session = await prisma.session.create({
  data: {
    workspaceId,
    createdById: userId,
    title: 'Study Session',
  }
})

// End session with state
const session = await prisma.session.update({
  where: { id: sessionId },
  data: {
    endedAt: new Date(),
    duration: calculateDuration(session.startedAt),
    canvasState,
    editorState,
  }
})

// Get workspace sessions
const sessions = await prisma.session.findMany({
  where: { workspaceId },
  include: { createdBy: true },
  orderBy: { startedAt: 'desc' },
  take: 50
})
```

### Permission Checks

```typescript
// Check if user is workspace member
const member = await prisma.workspaceMember.findFirst({
  where: { userId, workspaceId }
})
const isMember = !!member

// Check if user is workspace owner
const owner = await prisma.workspaceMember.findFirst({
  where: { userId, workspaceId, role: 'OWNER' }
})
const isOwner = !!owner
```

## Invite Code Generation

```typescript
import { createId } from '@paralleldrive/cuid2'

function generateInviteCode(): string {
  return createId().slice(0, 8).toUpperCase()
}
// Output: "ABCD1234"
```

## Best Practices

1. **Use transactions for related operations**:
   ```typescript
   await prisma.$transaction([
     prisma.workspace.delete({ where: { id } }),
     // Related records deleted via cascade
   ])
   ```

2. **Select only needed fields**:
   ```typescript
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, name: true, email: true }
   })
   ```

3. **Use includes sparingly** - Only include relations you need

4. **Add indexes for frequently queried fields** - Already done in schema

5. **Use `@map` for snake_case** - Database uses snake_case, code uses camelCase

## Troubleshooting

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Schema drift detected"
```bash
npx prisma db push  # Development
npx prisma migrate dev  # Or create a migration
```

### "Cannot find module '@/generated/prisma'"
- Check that `generated/` folder exists
- Run `npx prisma generate`
- Restart TypeScript server

### Testing with different database
```bash
DATABASE_URL="postgresql://..." npx prisma db push
```
