# PRD - Product Requirements Document
## StudySpace - Plateforme Collaborative d'Étude

**Version** : 1.0 (MVP Phase 3A)
**Date** : Décembre 2025
**Statut** : MVP Beta - Sessions basiques implémentées

---

## 1. Vue d'ensemble du produit

### 1.1 Résumé exécutif

StudySpace est une plateforme web collaborative conçue pour permettre aux étudiants de travailler ensemble efficacement dans des espaces de travail organisés, avec des outils intégrés (tableau blanc, éditeur de notes) et un système de sessions chronométrées avec sauvegarde automatique.

### 1.2 Objectifs du produit

**Objectif principal** : Fournir un espace de travail collaboratif unifié pour remplacer l'utilisation dispersée de multiples outils (Google Docs + Discord + Miro).

**Objectifs secondaires** :
- Améliorer la productivité des étudiants avec sessions chronométrées
- Faciliter le partage de ressources et notes entre pairs
- Offrir une interface moderne, performante et mobile-first
- Permettre la collaboration synchrone et asynchrone

### 1.3 Utilisateurs cibles

| Persona | Description | Besoins principaux |
|---------|-------------|-------------------|
| **Étudiant universitaire** | 18-25 ans, travaille en groupe sur projets | Collaboration en temps réel, partage de notes |
| **Étudiant prépa** | 17-20 ans, révisions intensives | Organisation par matière, sessions chronométrées |
| **Groupe d'étude** | 3-10 étudiants, même cursus | Espace centralisé, historique de sessions |
| **Étudiant à distance** | Tout âge, cours en ligne | Outils asynchrones, sauvegarde automatique |

---

## 2. Problèmes et solutions

### 2.1 Problèmes identifiés

#### Problème 1 : Outils dispersés
**Impact** : Perte de temps, friction cognitive, données éparpillées
**Fréquence** : Quotidienne
**Gravité** : Élevée

**Situation actuelle** :
- Étudiant A utilise Google Docs pour notes + Discord pour audio + Miro pour schémas
- Doit jongler entre 3+ applications
- Perte de contexte à chaque changement d'outil
- Difficulté à retrouver les ressources

#### Problème 2 : Pas de traçabilité du travail
**Impact** : Impossible de mesurer temps d'étude, risque de perte de données
**Fréquence** : Hebdomadaire
**Gravité** : Moyenne

**Situation actuelle** :
- Aucun chronomètre intégré
- Sauvegarde manuelle (risque d'oubli)
- Pas d'historique des sessions d'étude

#### Problème 3 : Collaboration difficile
**Impact** : Coordination complexe, conflits de versions
**Fréquence** : Quotidienne
**Gravité** : Élevée

**Situation actuelle** :
- Partage d'écran uniquement (pas de co-édition)
- Pas de système de présence
- Conflits lors de modifications simultanées

### 2.2 Solutions apportées

#### Solution 1 : Plateforme tout-en-un
**Implémentation** :
- Tableau blanc (Canvas HTML5) + Éditeur de notes dans une seule interface
- Tabs pour basculer rapidement entre les outils
- Interface unifiée avec design cohérent (shadcn/ui)

**Validation** : ✅ Implémenté dans MVP Phase 3A

#### Solution 2 : Sessions chronométrées avec auto-save
**Implémentation** :
- Création de session avec startedAt automatique
- Sauvegarde automatique toutes les 30 secondes (silent failures)
- Calcul de durée automatique à la fin de session
- Historique des sessions dans workspace

**Validation** : ✅ Implémenté dans MVP Phase 3A

#### Solution 3 : Collaboration (planifié Phase 3B)
**Implémentation future** :
- Yjs pour synchronisation CRDT (Conflict-free Replicated Data Types)
- WebSockets (Pusher) pour temps réel
- Curseurs et présence collaborative
- WebRTC pour audio/vidéo

**Validation** : 🔜 Planifié

---

## 3. Exigences fonctionnelles

### 3.1 Fonctionnalités MVP (Phase 3A) - ✅ IMPLÉMENTÉ

#### F1 : Authentification
- **F1.1** : Inscription par email/mot de passe avec validation Zod
- **F1.2** : Connexion avec session cookie-based (@supabase/ssr)
- **F1.3** : Réinitialisation de mot de passe par email
- **F1.4** : Vérification email obligatoire
- **F1.5** : Messages d'erreur en français (lib/auth-errors.ts)

**Critères d'acceptation** :
- ✅ Utilisateur peut créer un compte et recevoir email de vérification
- ✅ Connexion persistante via cookies sécurisés
- ✅ Redirection automatique si non authentifié (proxy.ts)

#### F2 : Gestion des Workspaces
- **F2.1** : Création de workspace avec nom, description, tag (matière)
- **F2.2** : Code d'invitation unique (cuid) généré automatiquement
- **F2.3** : Invitation de membres via code
- **F2.4** : Liste des workspaces de l'utilisateur
- **F2.5** : Modification de workspace (propriétaire uniquement)
- **F2.6** : Suppression de workspace avec cascade (propriétaire uniquement)
- **F2.7** : Gestion des membres : ajout, suppression, changement de rôle

**Critères d'acceptation** :
- ✅ Propriétaire peut inviter avec code unique
- ✅ Membres peuvent rejoindre avec code valide
- ✅ Seul propriétaire peut modifier/supprimer workspace
- ✅ Tags disponibles : maths, info, physique, chimie, svt, langues, droit, general, autre

#### F3 : Sessions d'étude
- **F3.1** : Création de session dans un workspace
- **F3.2** : Interface session avec header (workspace, durée, boutons)
- **F3.3** : Tabs : Whiteboard | Editor
- **F3.4** : Whiteboard : Canvas HTML5 avec dessin souris (noir, 2px)
- **F3.5** : Editor : Textarea pour notes textuelles
- **F3.6** : Auto-save toutes les 30 secondes (canvasState + editorState)
- **F3.7** : Bouton sauvegarde manuelle
- **F3.8** : Bouton "Terminer la session" avec confirmation
- **F3.9** : Calcul automatique de durée (en secondes)
- **F3.10** : Mode lecture seule pour sessions terminées
- **F3.11** : Historique des sessions dans workspace detail
- **F3.12** : Affichage timestamp dernière sauvegarde

**Critères d'acceptation** :
- ✅ Session démarre avec startedAt = now()
- ✅ Canvas permet dessiner au trait (mousedown, mousemove, mouseup)
- ✅ Auto-save ne bloque pas l'interface (async, silent failures)
- ✅ Canvas sauvegardé en base64 dataURL
- ✅ Editor sauvegardé en JSON { content: string }
- ✅ Duration calculé : (endedAt - startedAt) / 1000
- ✅ Sessions terminées non modifiables (endedAt !== null)

#### F4 : Interface utilisateur
- **F4.1** : Design responsive mobile-first (Tailwind CSS)
- **F4.2** : Composants shadcn/ui (New York style)
- **F4.3** : Animations Framer Motion avec prefers-reduced-motion
- **F4.4** : Landing page SEO-optimisée
- **F4.5** : Dashboard avec liste des workspaces
- **F4.6** : Navigation claire (sidebar desktop, mobile menu)

**Critères d'acceptation** :
- ✅ Interface utilisable sur mobile (320px) et desktop (1920px)
- ✅ Temps de chargement < 3 secondes
- ✅ Accessibilité WCAG 2.1 niveau AA
- ✅ Support navigateurs : Chrome, Firefox, Safari, Edge (dernières versions)

### 3.2 Fonctionnalités futures (Phase 3B+)

#### F5 : Collaboration temps réel (🔜 Phase 3B)
- **F5.1** : Synchronisation CRDT avec Yjs
- **F5.2** : Éditeur riche TipTap (markdown, formatting)
- **F5.3** : Whiteboard avancé (Konva.js : formes, texte, images)
- **F5.4** : Curseurs collaboratifs avec nom utilisateur
- **F5.5** : Indicateurs de présence (qui est en ligne)
- **F5.6** : WebRTC audio/vidéo (P2P ou Agora)

#### F6 : Fichiers et ressources (🔜 Phase 4)
- **F6.1** : Upload de fichiers (PDF, images, docs)
- **F6.2** : Stockage Supabase Storage
- **F6.3** : Liste des fichiers par workspace
- **F6.4** : Permissions de lecture/écriture
- **F6.5** : Aperçu de fichiers (PDF viewer, images)

#### F7 : Fonctionnalités avancées (🔜 Phase 5)
- **F7.1** : Chat intégré par workspace
- **F7.2** : Notifications (nouvelles sessions, messages)
- **F7.3** : Analytics d'étude (temps total, graphiques)
- **F7.4** : Mode sombre
- **F7.5** : Profil utilisateur avec avatar

---

## 4. Exigences non fonctionnelles

### 4.1 Performance
- **P1** : Temps de chargement initial < 3 secondes (First Contentful Paint)
- **P2** : Auto-save ne doit pas ralentir l'interface (async, non-blocking)
- **P3** : Canvas responsive à 60 FPS pendant le dessin
- **P4** : Base de données : requêtes < 200ms (indexation sur workspaceId, userId)

**Validation actuelle** :
- ✅ Next.js 16 avec React Compiler (optimisations automatiques)
- ✅ Prisma avec indexation sur clés étrangères
- ✅ Auto-save avec try/catch (ne bloque pas l'UI)

### 4.2 Sécurité
- **S1** : Authentification via Supabase Auth (bcrypt pour mots de passe)
- **S2** : Sessions cookie-based avec httpOnly, secure, sameSite
- **S3** : Validation de toutes les entrées utilisateur (Zod)
- **S4** : Protection CSRF (Next.js built-in)
- **S5** : RLS (Row Level Security) sur tables Supabase
- **S6** : Pas de localStorage pour données sensibles
- **S7** : Vérification des permissions (isWorkspaceMember, isWorkspaceOwner)

**Validation actuelle** :
- ✅ Tous les API routes vérifient authentication (getCurrentUser)
- ✅ Tous les inputs validés avec Zod schemas
- ✅ Session store sans localStorage
- ✅ Permissions vérifiées avant chaque action

### 4.3 Scalabilité
- **SC1** : Architecture stateless (horizontal scaling possible)
- **SC2** : Database pooling avec Prisma + pg
- **SC3** : Pagination sur listes (50 sessions max par requête)
- **SC4** : Lazy loading des composants lourds

**Préparation future** :
- 🔜 CDN pour assets statiques
- 🔜 Redis pour cache de sessions
- 🔜 WebSocket server séparé (Pusher ou custom)

### 4.4 Accessibilité (WCAG 2.1 AA)
- **A1** : Navigation au clavier complète
- **A2** : Screen reader support (aria-labels, semantic HTML)
- **A3** : Contraste minimum 4.5:1 pour texte
- **A4** : Respect de prefers-reduced-motion
- **A5** : Focus visible sur tous les éléments interactifs

**Validation actuelle** :
- ✅ shadcn/ui composants accessibles (Radix UI primitives)
- ✅ Animations Framer Motion avec prefers-reduced-motion
- ✅ Semantic HTML (header, main, nav, etc.)

### 4.5 Compatibilité
- **C1** : Navigateurs : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **C2** : Responsive : 320px (mobile) à 1920px+ (desktop)
- **C3** : TypeScript strict mode (0 errors)
- **C4** : Support touch events (canvas tactile prévu Phase 3B)

**Validation actuelle** :
- ✅ Next.js 16 avec polyfills automatiques
- ✅ Tailwind CSS responsive (mobile-first)
- ✅ TypeScript 5 en mode strict

---

## 5. Modèle de données (Prisma Schema)

### 5.1 Entités principales

#### User
```prisma
- id: UUID (PK)
- email: String (unique)
- passwordHash: String (nullable si OAuth)
- name: String
- avatar: String (nullable)
- lastLoginAt: DateTime (nullable)
- createdAt: DateTime (default: now)
- updatedAt: DateTime (auto)
```

**Relations** :
- `workspaces[]` (WorkspaceMember) - Workspaces dont l'utilisateur est membre
- `sessions[]` (Session) - Sessions créées par l'utilisateur
- `files[]` (File) - Fichiers uploadés
- `createdWorkspaces[]` (Workspace) - Workspaces créés par l'utilisateur

#### Workspace
```prisma
- id: UUID (PK)
- name: String
- description: String (nullable)
- tag: WorkspaceTag (enum, default: autre)
- inviteCode: String (unique, default: cuid())
- createdById: UUID (FK → User)
- createdAt: DateTime (default: now)
- updatedAt: DateTime (auto)
```

**Relations** :
- `createdBy` (User) - Créateur du workspace
- `members[]` (WorkspaceMember) - Liste des membres
- `sessions[]` (Session) - Sessions créées dans ce workspace
- `files[]` (File) - Fichiers partagés

**Enum WorkspaceTag** : `maths | info | physique | chimie | svt | langues | droit | general | autre`

#### WorkspaceMember
```prisma
- id: UUID (PK)
- userId: UUID (FK → User)
- workspaceId: UUID (FK → Workspace)
- role: MemberRole (enum, default: MEMBER)
- joinedAt: DateTime (default: now)
```

**Contraintes** :
- Unique: (userId, workspaceId) - Un utilisateur ne peut être qu'une fois dans un workspace
- Index: userId, workspaceId (performance)

**Enum MemberRole** : `OWNER | MEMBER`

#### Session
```prisma
- id: UUID (PK)
- workspaceId: UUID (FK → Workspace)
- createdById: UUID (FK → User)
- title: String (nullable)
- startedAt: DateTime (default: now)
- endedAt: DateTime (nullable)
- duration: Int (nullable, secondes)
- canvasState: Json (nullable)
- editorState: Json (nullable)
- createdAt: DateTime (default: now)
```

**Relations** :
- `workspace` (Workspace) - Workspace parent
- `createdBy` (User) - Créateur de la session

**Index** : workspaceId, createdById, startedAt (performance)

**Structure JSON** :
```typescript
// canvasState
{ dataURL: string } // Base64 image

// editorState
{ content: string } // Plain text (Phase 3A) ou TipTap JSON (Phase 3B)
```

#### File (🔜 Phase 4)
```prisma
- id: UUID (PK)
- workspaceId: UUID (FK → Workspace)
- uploadedById: UUID (FK → User)
- name: String
- size: Int (bytes)
- mimeType: String
- url: String (Supabase Storage URL)
- uploadedAt: DateTime (default: now)
```

### 5.2 Relations et cascade

**Cascade deletions** :
- Suppression User → Cascade WorkspaceMember, Session, File, Workspace (si créateur)
- Suppression Workspace → Cascade WorkspaceMember, Session, File

---

## 6. Architecture technique

### 6.1 Stack technologique

#### Frontend
- **Framework** : Next.js 16.0.5 (App Router, React 19.2.0)
- **Language** : TypeScript 5 (strict mode)
- **Styling** : Tailwind CSS v4 (CSS variables, mobile-first)
- **Components** : shadcn/ui (New York style) + Radix UI primitives
- **Animations** : Framer Motion 12.x
- **State** : Zustand 5.x (auth, workspaces, sessions)
- **Forms** : React Hook Form 7.x + Zod 4.x
- **HTTP** : Axios pour API calls
- **Icons** : Lucide React

#### Backend
- **API** : Next.js API Routes (`app/api/`)
- **Database** : PostgreSQL via Supabase
- **ORM** : Prisma 7 (@prisma/adapter-pg)
- **Auth** : Supabase Auth (email/password)
- **Session** : Cookie-based via @supabase/ssr

#### Infra & DevOps
- **Hosting** : Vercel (recommandé) ou autre plateforme Next.js
- **Database** : Supabase (PostgreSQL managed)
- **Storage** : Supabase Storage (fichiers - Phase 4)
- **Real-time** : Pusher ou Supabase Realtime (Phase 3B)
- **CI/CD** : GitHub Actions (à configurer)

### 6.2 Architecture des dossiers

```
StudySpace/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (dashboard)/              # Protected dashboard
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── workspace/[id]/   # Workspace detail
│   │   │   ├── session/[id]/     # Session interface
│   │   │   └── workspaces/       # Workspace list & create
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Auth endpoints
│   │   ├── workspaces/           # Workspace CRUD + join
│   │   └── sessions/             # Session CRUD + end
│   ├── invite/[code]/page.tsx    # Invite link handler
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + CSS variables
├── components/
│   ├── ui/                       # shadcn/ui components (19 components)
│   ├── motion.tsx                # Framer Motion wrappers
│   └── AnimatedCounter.tsx       # Reusable components
├── lib/
│   ├── stores/                   # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── workspace-store.ts
│   │   └── session-store.ts
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── auth/
│   │   └── session.ts            # Auth helpers (getCurrentUser, etc.)
│   ├── validations.ts            # Zod schemas
│   ├── api-response.ts           # API response utilities
│   ├── auth-errors.ts            # Error messages (French)
│   ├── animations.ts             # Framer Motion presets
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # Utility functions (cn, etc.)
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
├── data/
│   └── landingPageData.ts        # Landing page content
├── .claude/                      # MVP Documentation
│   ├── IDEA.md
│   ├── PRD.md
│   ├── ARCHI.md
│   └── TASKS/
├── proxy.ts                      # Session proxy middleware
├── generated/                    # Prisma generated types
└── public/                       # Static assets
```

### 6.3 Patterns d'architecture

#### Store Architecture Pattern
**Règle** : Aucun appel API direct dans les composants, tout passe par les stores Zustand.

**Exemple** :
```typescript
// ❌ BAD - Direct API call in component
const handleCreate = async () => {
  const { data } = await axios.post('/api/sessions', { workspaceId });
  // ...
}

// ✅ GOOD - Use store
const { createSession } = useSession();
const handleCreate = async () => {
  const session = await createSession(workspaceId);
  router.push(`/dashboard/session/${session.id}`);
}
```

#### API Response Pattern
**Règle** : Tous les API routes utilisent les helpers `lib/api-response.ts`.

```typescript
import { successResponse, errorResponse, validationError } from '@/lib/api-response';

// Success
return successResponse(data);           // 200
return successResponse(data, 201);      // 201 Created

// Errors
return errorResponse('Message', 400);   // Bad request
return validationError(zodError);       // Validation failed
return unauthorizedResponse();          // 401
return forbiddenResponse();             // 403
```

#### Validation Pattern
**Règle** : Toutes les validations dans `lib/validations.ts`, imports typés avec `z.infer`.

```typescript
// lib/validations.ts
export const CreateSessionSchema = z.object({
  workspaceId: z.string().min(1),
});
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

// API route
const validated = CreateSessionSchema.safeParse(body);
if (!validated.success) return validationError(validated.error);
```

---

## 7. Risques et mitigation

### 7.1 Risques techniques

| Risque | Probabilité | Impact | Mitigation | Statut |
|--------|-------------|--------|------------|--------|
| **Perte de données (auto-save échoue)** | Moyenne | Élevé | Silent failures + bouton sauvegarde manuelle + retry logic | ✅ Mitigé |
| **Performance dégradée (canvas lourd)** | Faible | Moyen | Limiter résolution canvas, debounce events | ✅ Mitigé |
| **Conflits de synchronisation (Phase 3B)** | Élevée | Élevé | Utiliser Yjs (CRDT) pour résolution automatique | 🔜 Planifié |
| **Scalabilité WebSockets** | Moyenne | Élevé | Pusher (managed) ou Redis Pub/Sub | 🔜 Planifié |
| **Quota Supabase dépassé** | Faible | Moyen | Monitoring + upgrade plan si besoin | ⚠️ Surveiller |

### 7.2 Risques produit

| Risque | Probabilité | Impact | Mitigation | Statut |
|--------|-------------|--------|------------|--------|
| **Adoption faible (utilisateurs préfèrent Miro + Google Docs)** | Moyenne | Élevé | USP claire : tout-en-un, gratuit, sessions chronométrées | 🔜 A valider |
| **Churn élevé (utilisateurs ne reviennent pas)** | Moyenne | Élevé | Onboarding guidé, notifications, analytics pour identifier friction | 🔜 A implémenter |
| **Feedback négatif sur UX** | Faible | Moyen | Tests utilisateurs, itérations rapides | 🔜 Planifié |
| **Concurrence (Notion, Miro gratuit)** | Élevée | Moyen | Focus sur niche étudiants, fonctionnalités spécifiques (sessions chronométrées) | ✅ Différenciation |

### 7.3 Risques business

| Risque | Probabilité | Impact | Mitigation | Statut |
|--------|-------------|--------|------------|--------|
| **Coûts infrastructure (scaling)** | Moyenne | Moyen | Démarrer avec free tiers, monetiser avant scaling | 🔜 Planifié |
| **Absence de modèle économique** | Élevée | Élevé | MVP gratuit pour traction, Premium à définir (Phase 5) | 🔜 A définir |
| **Problèmes légaux (RGPD, données étudiants)** | Faible | Élevé | CGU/CGV, politique de confidentialité, consentement explicite | 🔜 A implémenter |

---

## 8. Stratégie de lancement

### 8.1 Go-to-Market (Phase MVP)

#### Cible initiale
- **Segment** : Étudiants universitaires français (18-25 ans)
- **Géographie** : France (langue française)
- **Taille** : 50-100 early adopters

#### Canaux d'acquisition
1. **Communautés étudiantes** : Discord servers, groupes Facebook, Reddit (r/france, r/etudiant)
2. **Bouche-à-oreille** : Système d'invitation, partage de workspaces
3. **SEO** : Landing page optimisée ("plateforme étude collaborative", "outil révision en ligne")
4. **Partenariats** : Associations étudiantes, BDE

#### Message clé
> "StudySpace : Votre espace de travail collaboratif tout-en-un. Tableau blanc + Notes + Sessions chronométrées. Gratuit."

### 8.2 Métriques de succès (OKRs)

#### Objectif 1 : Validation du problème (1 mois)
- **KR1** : 50 inscriptions
- **KR2** : 10 workspaces créés
- **KR3** : 5 sessions > 15 minutes

#### Objectif 2 : Engagement (3 mois)
- **KR1** : 100 utilisateurs actifs mensuels (MAU)
- **KR2** : 40% de rétention hebdomadaire
- **KR3** : 10+ sessions/jour

#### Objectif 3 : Satisfaction (3 mois)
- **KR1** : NPS (Net Promoter Score) > 30
- **KR2** : 5+ feedbacks qualitatifs positifs
- **KR3** : < 5% taux de bug critique

### 8.3 Roadmap de lancement

#### Semaine 1-2 : Soft launch
- ✅ MVP Phase 3A déployé
- 🔜 Tests internes (5-10 utilisateurs)
- 🔜 Correction bugs critiques
- 🔜 Landing page finale avec CTA

#### Semaine 3-4 : Beta privée
- 🔜 Invitation de 20-30 early adopters
- 🔜 Collecte de feedback (formulaire + interviews)
- 🔜 Itérations rapides sur UX

#### Semaine 5-8 : Beta publique
- 🔜 Ouverture des inscriptions
- 🔜 Campagne sur communautés étudiantes
- 🔜 Monitoring metrics (Mixpanel ou Plausible)
- 🔜 Support utilisateurs (email ou Discord)

#### Mois 3-6 : Croissance & Phase 3B
- 🔜 Implémentation temps réel (Yjs + WebRTC)
- 🔜 Onboarding guidé
- 🔜 Système de notifications
- 🔜 Optimisations performance

---

## 9. Support et maintenance

### 9.1 Support utilisateurs

**Canaux** :
- Email : support@studyspace.com (à créer)
- Discord community (à créer)
- FAQ/Documentation (à créer)

**SLA** (MVP) :
- Réponse < 48h pour bugs critiques
- Réponse < 1 semaine pour questions

### 9.2 Monitoring

**Outils** :
- **Erreurs** : Sentry (crash reporting)
- **Analytics** : Plausible ou Mixpanel (privacy-friendly)
- **Performance** : Vercel Analytics
- **Uptime** : UptimeRobot

**Alertes** :
- Erreur 500 API routes
- Temps de réponse > 5 secondes
- Downtime > 5 minutes

### 9.3 Maintenance

**Fréquence** :
- Updates dépendances : Mensuel
- Backups base de données : Quotidien (Supabase auto)
- Security patches : Immédiat si CVE critique

---

## 10. Annexes

### 10.1 Glossaire

| Terme | Définition |
|-------|-----------|
| **Workspace** | Espace de travail collaboratif organisé par matière ou projet |
| **Session** | Période de travail chronométrée avec whiteboard + editor |
| **Canvas** | Tableau blanc HTML5 pour dessiner et schématiser |
| **Auto-save** | Sauvegarde automatique toutes les 30 secondes |
| **CRDT** | Conflict-free Replicated Data Type (synchronisation sans conflits) |
| **Yjs** | Librairie CRDT pour collaboration temps réel |
| **Store** | État global géré par Zustand (pattern similaire Redux) |

### 10.2 Références

- **Next.js 16 Docs** : https://nextjs.org/docs
- **Prisma Docs** : https://www.prisma.io/docs
- **Supabase Auth** : https://supabase.com/docs/guides/auth
- **shadcn/ui** : https://ui.shadcn.com
- **Yjs Docs** : https://docs.yjs.dev
- **Framer Motion** : https://www.framer.com/motion

### 10.3 Historique des versions

| Version | Date | Changements | Auteur |
|---------|------|-------------|--------|
| 1.0 | Déc 2025 | MVP Phase 3A - Sessions basiques implémentées | Claude |

---

**Document approuvé pour implémentation MVP Phase 3A** ✅
**Prochaine étape** : Phase 3B - Collaboration temps réel (Yjs + WebRTC)
