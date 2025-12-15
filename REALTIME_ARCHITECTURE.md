# Architecture Temps Réel - StudySpace

**Status**: Design Document
**Date**: 2025-01-15
**Version**: 1.0

---

## 🎯 Objectif

Ce document définit l'architecture temps réel de StudySpace pour les fonctionnalités collaboratives. Il est basé sur une analyse brutale de la complexité réelle et propose une approche viable pour éviter la dette technique.

---

## ⚠️ Principes Non Négociables

### 1. **Une seule connexion WebSocket par utilisateur**
- Pas de sockets multiples par feature
- Pas de polling / setInterval
- Architecture centralisée autour d'un "Realtime Core"

### 2. **État déterministe et cohérent**
- Pas de conflits d'état entre features
- Synchronisation via une seule source de vérité
- Gestion appropriée des reconnexions

### 3. **Sécurité et permissions**
- Validation côté serveur de toutes les actions
- RLS strict sur les données
- Pas de confiance aveugle au client

---

## 🏗️ Architecture Cible

```
┌─────────────────────────────────────────────┐
│              Client (Browser)               │
│  ┌─────────────────────────────────────┐   │
│  │   React Components                  │   │
│  │   ├─ Presence Hook                  │   │
│  │   ├─ Whiteboard Hook                │   │
│  │   ├─ Editor Hook (Yjs)              │   │
│  │   └─ WebRTC Hook (later)            │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │   WebSocket Client (Single)         │   │
│  │   - Auto-reconnect                  │   │
│  │   - Heartbeat                       │   │
│  │   - Message queue                   │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │ WSS
                  │
┌─────────────────▼───────────────────────────┐
│         WebSocket Server (Node.js)          │
│  ┌─────────────────────────────────────┐   │
│  │   Connection Manager                │   │
│  │   ├─ Authentication                 │   │
│  │   ├─ Session Management             │   │
│  │   └─ Workspace/Room Management      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Realtime Core                     │   │
│  │   ├─ Presence System                │   │
│  │   ├─ Whiteboard State               │   │
│  │   ├─ Yjs Sync Provider              │   │
│  │   └─ WebRTC Signaling (later)       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Persistence Layer                 │   │
│  │   ├─ Snapshots (périodiques)        │   │
│  │   ├─ Session logs                   │   │
│  │   └─ Metadata sync to Postgres      │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 📋 Priorités d'Implémentation

### Sprint 1: Foundation - Presence System 🔴 CRITIQUE
**Objectif**: Établir la base temps réel sans laquelle tout le reste est bancal

#### Fonctionnalités
- Liste des utilisateurs en ligne dans un workspace
- Indicateurs de présence (online/idle/away)
- Position des curseurs en temps réel
- Heartbeat pour détecter les déconnexions

#### Stack Technique
- **WebSocket Server**: Socket.io ou Supabase Realtime
- **État en mémoire**: Redis ou in-memory Map
- **Protocole**: JSON messages avec types strictement typés

#### Modèle de données (mémoire)
```typescript
interface Presence {
  userId: string;
  workspaceId: string;
  sessionId: string;
  state: 'active' | 'idle' | 'away';
  cursor?: { x: number; y: number };
  lastSeen: Date;
  metadata?: {
    currentTool?: string; // editing, drawing, viewing
    currentSection?: string; // whiteboard, editor, files
  };
}
```

#### API Messages
```typescript
// Client → Server
{
  type: 'presence:join',
  workspaceId: string,
  sessionId: string
}

{
  type: 'presence:update',
  state: PresenceState,
  cursor?: { x, y }
}

{
  type: 'presence:leave'
}

// Server → Client
{
  type: 'presence:user-joined',
  user: UserPresence
}

{
  type: 'presence:user-left',
  userId: string
}

{
  type: 'presence:state-changed',
  userId: string,
  state: PresenceState
}

{
  type: 'presence:cursor-moved',
  userId: string,
  cursor: { x, y }
}
```

#### Composants UI
- `<OnlineUsers>` - Liste des utilisateurs connectés
- `<UserCursor>` - Curseurs des autres utilisateurs
- `<PresenceIndicator>` - Badge de statut sur les avatars

#### Livrables Sprint 1
- [ ] WebSocket server configuré
- [ ] Connexion/déconnexion avec auth
- [ ] Broadcast de présence dans un workspace
- [ ] Affichage liste users online
- [ ] Curseurs collaboratifs basiques
- [ ] Heartbeat et auto-reconnect
- [ ] Tests de charge (10-20 users simultanés)

---

### Sprint 2: Whiteboard Collaboratif 🟠 HAUTE PRIORITÉ
**Objectif**: Feature temps réel simple avec feedback visuel immédiat

#### Fonctionnalités
- Dessin collaboratif sur canvas HTML
- Actions: draw, erase, clear
- Couleurs et épaisseurs de trait
- Undo local (pas de CRDT encore)

#### Architecture
```typescript
interface WhiteboardAction {
  id: string;
  userId: string;
  timestamp: number;
  action:
    | { type: 'draw'; points: Point[]; color: string; width: number }
    | { type: 'erase'; points: Point[] }
    | { type: 'clear' };
}

interface WhiteboardState {
  actions: WhiteboardAction[];
  version: number; // Pour détecter les conflits
}
```

#### Protocole
- Pas de CRDT (trop complexe pour MVP)
- Actions sérialisées en ordre d'arrivée serveur
- Snapshot périodique en DB (toutes les 5 min ou à la fermeture)

#### Gestion des conflits
- **Option 1 (MVP)**: Last-write-wins, pas de résolution
- **Option 2 (later)**: Operational Transformation basique
- **Option 3 (future)**: CRDT avec Yjs

#### UI Components
- `<CollaborativeCanvas>` - Canvas principal
- `<DrawingTools>` - Barre d'outils (couleur, épaisseur, gomme)
- `<WhiteboardPresence>` - Qui dessine en ce moment

#### Optimisations
- Throttling des events de dessin (16ms = 60fps max)
- Compression des points (Douglas-Peucker algorithm)
- Canvas offscreen pour rendering performant

#### Livrables Sprint 2
- [ ] Canvas HTML avec drawing basique
- [ ] Broadcast des actions de dessin
- [ ] Synchronisation état whiteboard
- [ ] Toolbar (couleurs, épaisseur, clear)
- [ ] Indicateurs "qui dessine"
- [ ] Snapshot périodique en DB
- [ ] Performance test (1000+ points dessinés)

---

### Sprint 3: Real-time Editor (Yjs + TipTap) 🟡 COMPLEXE
**Objectif**: Édition collaborative de texte avec CRDT

⚠️ **WARNING**: Cette feature est LA plus complexe. Sous-estimer = catastrophe.

#### Stack
- **CRDT**: Yjs (battle-tested, utilisé par Notion, Figma)
- **Éditeur**: TipTap (basé sur ProseMirror)
- **Sync**: y-websocket provider
- **Persistence**: y-indexeddb (client) + snapshots DB (serveur)

#### Architecture Yjs
```typescript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { TiptapEditor } from '@tiptap/core';

// Document Yjs partagé
const ydoc = new Y.Doc();
const ytext = ydoc.getText('content');

// Provider WebSocket (sync automatique)
const provider = new WebsocketProvider(
  'wss://your-server.com',
  'session-id',
  ydoc,
  {
    connect: true,
    awareness: {
      // Cursors, sélections des autres users
    }
  }
);

// TipTap avec binding Yjs
const editor = new TiptapEditor({
  extensions: [
    StarterKit,
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider: provider,
    }),
  ],
});
```

#### Awareness (Cursors & Selections)
```typescript
provider.awareness.setLocalStateField('user', {
  name: currentUser.name,
  color: generateColor(currentUser.id),
});

provider.awareness.on('change', () => {
  const states = provider.awareness.getStates();
  // Update UI avec curseurs des autres users
});
```

#### Persistence
- **Client**: y-indexeddb pour offline-first
- **Server**: Snapshots Yjs compressés toutes les 30s ou à la déconnexion
- **DB Schema**:
```sql
CREATE TABLE editor_snapshots (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  snapshot BYTEA NOT NULL, -- Yjs state vector compressé
  version INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Challenges à gérer
1. **Syncing initial**: Snapshot → apply updates → live sync
2. **Permissions**: Read-only vs edit mode
3. **Offline**: Résolution conflits au reconnect
4. **Performance**: Large documents (>100k chars)
5. **Sécurité**: Validation server-side des updates

#### Livrables Sprint 3
- [ ] Yjs doc partagé par session
- [ ] TipTap avec Collaboration extension
- [ ] Cursors et sélections des autres users
- [ ] Persistence snapshots Yjs
- [ ] Recovery après déconnexion
- [ ] Permissions (read/write)
- [ ] Performance test (10 users editing simultanément)
- [ ] Tests edge cases (conflits, corrupted state)

---

### Sprint 4: File Upload System 🟢 FACILE
**Objectif**: Upload et partage de fichiers dans workspaces

#### Architecture
- **Storage**: Supabase Storage ou AWS S3
- **Metadata**: PostgreSQL
- **Security**: Signed URLs avec expiration
- **RLS**: Strict workspace permissions

#### DB Schema
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id),
  name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  CONSTRAINT files_workspace_fk FOREIGN KEY (workspace_id)
    REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_files_workspace ON files(workspace_id)
  WHERE deleted_at IS NULL;
```

#### API Routes
```typescript
// Upload
POST /api/workspaces/[id]/files
  → Generate signed upload URL
  → Return { uploadUrl, fileId }

// Client uploads directly to S3/Supabase
// Then confirm:
POST /api/workspaces/[id]/files/[fileId]/confirm
  → Save metadata to DB

// List
GET /api/workspaces/[id]/files
  → Return files with signed download URLs (1h expiry)

// Delete
DELETE /api/workspaces/[id]/files/[fileId]
  → Soft delete + cleanup storage
```

#### UI Features
- Drag & drop upload
- Preview (images, PDFs)
- Download
- Delete (owner only)
- File type icons
- Size limits (ex: 10MB max)

#### Livrables Sprint 4
- [ ] Supabase Storage bucket configuré
- [ ] Upload API avec signed URLs
- [ ] File metadata in DB
- [ ] RLS policies
- [ ] UI drag & drop
- [ ] Preview modal
- [ ] Delete avec confirmation
- [ ] Tests (upload, download, delete)

---

### Sprint 5: WebRTC (Audio/Video) 🔵 OPTIONNEL MVP
**Objectif**: Communication vocale/vidéo dans sessions

⚠️ **À NE PAS FAIRE TROP TÔT**
WebRTC double la complexité (NAT traversal, STUN/TURN, peer connections).

#### Quand l'implémenter
- **Après** que tout le reste soit stable
- **Après** load testing avec 20+ users
- **Si** le budget permet un serveur TURN

#### Architecture Minimale
- **Signaling**: Via le WebSocket existant
- **STUN**: Google STUN servers (gratuit)
- **TURN**: coturn self-hosted ou Twilio (payant)
- **Fallback**: Audio-only si video fail

#### Signaling Messages
```typescript
// Offer/Answer SDP exchange
{
  type: 'webrtc:offer',
  to: userId,
  sdp: RTCSessionDescription
}

{
  type: 'webrtc:answer',
  to: userId,
  sdp: RTCSessionDescription
}

// ICE candidates
{
  type: 'webrtc:ice-candidate',
  to: userId,
  candidate: RTCIceCandidate
}
```

#### UI Basique
- Toggle audio/video
- Mute/unmute
- Participants grid
- Screen sharing (bonus)

#### Livrables Sprint 5
- [ ] Signaling via WS existant
- [ ] Peer connections setup
- [ ] Audio streaming
- [ ] Video streaming (optionnel)
- [ ] Mute/unmute controls
- [ ] TURN server configuré
- [ ] Tests avec 5+ participants

---

## 🛠️ Stack Technique Recommandée

### Backend WebSocket Server
**Option A: Supabase Realtime (Recommandé pour MVP)**
- ✅ Déjà dans ta stack
- ✅ Auth intégrée avec Supabase
- ✅ Scaling géré
- ✅ Broadcast channels
- ❌ Moins flexible pour custom logic
- ❌ Pas de Yjs provider officiel

**Option B: Socket.io + Node.js (Recommandé pour scaling)**
- ✅ Contrôle total
- ✅ Rooms/namespaces built-in
- ✅ Reconnection automatique
- ✅ Middlewares pour auth
- ✅ y-socket.io pour Yjs
- ❌ Serveur à gérer
- ❌ Scaling horizontal complexe

**Option C: Liveblocks (SaaS, cher mais turnkey)**
- ✅ Presence, cursors, CRDT out-of-the-box
- ✅ Scaling automatique
- ✅ Yjs compatible
- ❌ Coût élevé (0.05$/MAU)
- ❌ Vendor lock-in

### Recommandation Finale
**Phase 1 (MVP)**: Supabase Realtime
**Phase 2 (Scaling)**: Migrer vers Socket.io + Redis

---

## 🚨 Pièges à Éviter (Leçons Apprises)

### 1. **Sous-estimer la latence**
- Afficher des optimistic updates
- Rollback si le serveur reject
- UI feedback immédiat même si sync prend 200ms

### 2. **Ignorer les reconnexions**
- Implémenter dès le début
- Resync state après reconnect
- File d'attente pour messages perdus

### 3. **Négliger les permissions temps réel**
- Valider TOUTES les actions côté serveur
- Pas de confiance client
- RLS + custom checks

### 4. **Sauver à chaque keystroke**
- Debounce les saves (5s minimum)
- Snapshots périodiques
- Sauvegarde à la déconnexion

### 5. **Oublier le scaling horizontal**
- Redis pub/sub pour multi-instances
- Sticky sessions ou room affinity
- Load balancing awareness

### 6. **Ignorer l'offline mode**
- IndexedDB pour cache local
- Sync queue au reconnect
- Conflict resolution strategy

---

## 📊 Métriques de Succès

### Performance
- **Latence** < 100ms pour actions simples (presence, cursor)
- **Latence** < 200ms pour whiteboard drawing
- **Latency** < 300ms pour editor sync
- **Throughput** > 100 messages/sec par workspace
- **Reconnect time** < 2s

### Scalabilité
- **10 users** simultanés par workspace (MVP)
- **50 users** simultanés par workspace (target)
- **1000 workspaces** actifs simultanément
- **Server CPU** < 70% à pleine charge
- **Memory** < 2GB par instance

### Fiabilité
- **Uptime** > 99.5%
- **Message loss** < 0.1%
- **Sync conflicts** < 1% des edits

---

## 🧪 Plan de Tests

### Tests Unitaires
- Message serialization/deserialization
- Presence state transitions
- Whiteboard action validation
- Yjs document operations

### Tests d'Intégration
- WebSocket connection/disconnection
- Room join/leave
- Message broadcast
- Persistence save/load

### Tests de Charge
- 10 users simultanés dans 1 workspace
- 100 messages/sec sustained
- 1000 whiteboard points dessinés
- Memory leak check (6h run)

### Tests End-to-End
- Scénario complet: join → collaborate → leave
- Reconnection après network failure
- Concurrent editing sans corruption
- Cross-browser compatibility

---

## 📅 Timeline Estimée

**Sprint 1 (Presence)**: 1-2 semaines
**Sprint 2 (Whiteboard)**: 1-2 semaines
**Sprint 3 (Editor Yjs)**: 2-3 semaines ⚠️ Le plus complexe
**Sprint 4 (Files)**: 1 semaine
**Sprint 5 (WebRTC)**: 2-3 semaines (optionnel)

**Total MVP (sans WebRTC)**: 5-8 semaines
**Total complet**: 7-11 semaines

---

## 🎓 Ressources d'Apprentissage

### Yjs
- [Yjs Documentation](https://docs.yjs.dev/)
- [Yjs + TipTap Guide](https://tiptap.dev/guide/collaborative-editing)
- [Kevin Jahns (Yjs creator) Blog](https://blog.kevinjahns.de/)

### WebRTC
- [WebRTC for the Curious](https://webrtcforthecurious.com/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

### Socket.io
- [Socket.io Docs](https://socket.io/docs/v4/)
- [Scaling Socket.io](https://socket.io/docs/v4/using-multiple-nodes/)

### Supabase Realtime
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Presence Example](https://supabase.com/docs/guides/realtime/presence)

---

## ✅ Checklist Pre-Implementation

Avant de commencer Sprint 1, confirmer:

- [ ] **Stack décision**: Supabase Realtime ou Socket.io ?
- [ ] **Hébergement**: Serveur WS dédié ou Next.js API routes ?
- [ ] **Auth strategy**: Comment valider les WS connections ?
- [ ] **Scope MVP**: Jusqu'où aller pour la démo/beta ?
- [ ] **Budget serveur**: TURN servers pour WebRTC ?
- [ ] **Timeline**: Deadline pour MVP ?

---

## 🎯 Décision Recommandée

### Pour commencer MAINTENANT (Phase 1)
1. **Stack**: Supabase Realtime
2. **Scope**: Presence + Cursors uniquement
3. **Timeline**: 2 semaines
4. **Hébergement**: Serverless (Supabase géré)

### Avantages
- Démarrage rapide
- Pas de serveur à gérer
- Auth déjà en place
- Proof of concept viable

### Migration Path (Phase 2)
Si le MVP réussit → Migrer vers Socket.io + Redis pour:
- Plus de contrôle
- Yjs support natif
- Scaling horizontal
- Features avancées (whiteboard, editor)

---

## 📝 Notes Finales

Ce document est un **guide, pas une prison**. Adapter selon:
- Feedback utilisateurs
- Contraintes techniques découvertes
- Budget et timeline réels

**Principe clé**: Mieux vaut un système simple qui marche qu'un système complexe qui plante.

Commencer petit (Presence), valider l'architecture, puis itérer.

---

**Prochaine étape**: Obtenir validation de cette architecture avant d'écrire une ligne de code.
