# Task 3 : Real-time Collaboration Setup (Phase 3B - Part 1)

**Statut** : 🔜 À faire
**Priorité** : Moyenne
**Estimation** : 2-3 semaines
**Phase** : Phase 3B - Collaboration temps réel

---

## Objectif

Implémenter la synchronisation en temps réel pour l'éditeur de notes avec Yjs + TipTap, permettant à plusieurs utilisateurs d'éditer simultanément.

---

## Sous-tâches

### 3.1 Setup Yjs & WebSockets

- [ ] **Installer dépendances Yjs**
  ```bash
  npm install yjs y-websocket y-protocols
  npm install --save-dev @types/yjs
  ```

- [ ] **Choisir backend WebSocket**
  - **Option A : Pusher** (managed, payant après free tier)
  - **Option B : Supabase Realtime** (gratuit, limité)
  - **Option C : Custom WebSocket server** (Node.js + ws)

  **Recommandation** : Pusher pour MVP (setup rapide, scalable)

- [ ] **Installer Pusher** (si choisi)
  ```bash
  npm install pusher pusher-js
  ```

- [ ] **Configurer Pusher**
  - Créer app sur pusher.com
  - Ajouter credentials dans `.env.local` :
    ```
    PUSHER_APP_ID=...
    PUSHER_KEY=...
    PUSHER_SECRET=...
    PUSHER_CLUSTER=eu
    NEXT_PUBLIC_PUSHER_KEY=...
    NEXT_PUBLIC_PUSHER_CLUSTER=eu
    ```

- [ ] **Créer Pusher client** (`lib/pusher/client.ts`)
  ```typescript
  import Pusher from 'pusher-js';

  export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });
  ```

- [ ] **Créer Pusher server** (`lib/pusher/server.ts`)
  ```typescript
  import Pusher from 'pusher';

  export const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });
  ```

### 3.2 Intégrer TipTap (Éditeur riche)

- [ ] **Installer TipTap**
  ```bash
  npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
  ```

- [ ] **Créer composant TipTapEditor** (`components/TipTapEditor.tsx`)
  ```typescript
  'use client';
  import { useEditor, EditorContent } from '@tiptap/react';
  import StarterKit from '@tiptap/starter-kit';
  import Collaboration from '@tiptap/extension-collaboration';
  import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
  import * as Y from 'yjs';
  import { WebsocketProvider } from 'y-websocket';

  export default function TipTapEditor({ sessionId, userId, userName }) {
    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      'ws://localhost:1234', // WebSocket server
      `session-${sessionId}`,
      ydoc
    );

    const editor = useEditor({
      extensions: [
        StarterKit,
        Collaboration.configure({ document: ydoc }),
        CollaborationCursor.configure({
          provider,
          user: { name: userName, color: getRandomColor() },
        }),
      ],
    });

    return <EditorContent editor={editor} />;
  }
  ```

- [ ] **Styliser TipTap editor**
  - Ajouter CSS dans `app/globals.css`
  - Toolbar avec boutons (bold, italic, heading, etc.)
  - Cursors collaboratifs colorés

### 3.3 WebSocket Server (Custom ou Pusher)

#### Option A : Pusher (Recommandé MVP)

- [ ] **Créer API route presence** (`app/api/sessions/[id]/presence/route.ts`)
  ```typescript
  import { pusher } from '@/lib/pusher/server';
  import { getCurrentUser } from '@/lib/auth/session';

  export async function POST(request, { params }) {
    const user = await getCurrentUser();
    const { id } = await params;

    // Trigger presence event
    await pusher.trigger(`presence-session-${id}`, 'user-joined', {
      userId: user.id,
      userName: user.name,
    });

    return successResponse({ message: 'Joined' });
  }
  ```

- [ ] **Subscribe to presence channel** (client)
  ```typescript
  const channel = pusher.subscribe(`presence-session-${sessionId}`);

  channel.bind('user-joined', (data) => {
    console.log(`${data.userName} joined`);
    // Update presence UI
  });
  ```

#### Option B : Custom WebSocket Server (Advanced)

- [ ] **Créer serveur WebSocket** (`server/websocket.ts`)
  ```typescript
  import { WebSocketServer } from 'ws';
  import * as Y from 'yjs';
  import { setupWSConnection } from 'y-websocket/bin/utils';

  const wss = new WebSocketServer({ port: 1234 });

  wss.on('connection', (ws, req) => {
    setupWSConnection(ws, req);
  });

  console.log('WebSocket server running on ws://localhost:1234');
  ```

- [ ] **Ajouter script dans package.json**
  ```json
  {
    "scripts": {
      "ws-server": "node server/websocket.ts"
    }
  }
  ```

- [ ] **Run WebSocket server en parallèle**
  ```bash
  # Terminal 1
  npm run dev

  # Terminal 2
  npm run ws-server
  ```

### 3.4 Intégrer Yjs dans SessionPage

- [ ] **Remplacer textarea par TipTapEditor**
  ```typescript
  // app/(dashboard)/dashboard/session/[id]/page.tsx

  // AVANT
  <Textarea
    value={editorContent}
    onChange={(e) => setEditorContent(e.target.value)}
  />

  // APRÈS
  <TipTapEditor
    sessionId={sessionId}
    userId={user.id}
    userName={user.name}
  />
  ```

- [ ] **Gérer persistance Yjs ↔ PostgreSQL**
  - Sauvegarder Yjs document state en base (auto-save)
  - Restaurer state au chargement de session
  ```typescript
  // Save Yjs state
  const state = Y.encodeStateAsUpdate(ydoc);
  const base64 = Buffer.from(state).toString('base64');
  await updateSession(sessionId, { editorState: { yjs: base64 } });

  // Load Yjs state
  if (session.editorState?.yjs) {
    const state = Buffer.from(session.editorState.yjs, 'base64');
    Y.applyUpdate(ydoc, state);
  }
  ```

### 3.5 Indicateurs de présence

- [ ] **Créer composant PresenceIndicator**
  ```typescript
  // components/PresenceIndicator.tsx
  export default function PresenceIndicator({ users }) {
    return (
      <div className="flex items-center gap-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    );
  }
  ```

- [ ] **Ajouter au header de SessionPage**
  ```typescript
  <div className="flex justify-between">
    <h1>Session - {workspace.name}</h1>
    <PresenceIndicator users={onlineUsers} />
  </div>
  ```

- [ ] **Gérer join/leave events**
  ```typescript
  useEffect(() => {
    const channel = pusher.subscribe(`presence-session-${sessionId}`);

    channel.bind('pusher:member_added', (member) => {
      setOnlineUsers(prev => [...prev, member.info]);
    });

    channel.bind('pusher:member_removed', (member) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== member.id));
    });

    return () => channel.unsubscribe();
  }, [sessionId]);
  ```

### 3.6 Tests collaboration

- [ ] **Tester avec 2+ navigateurs**
  - Ouvrir même session dans Chrome + Firefox
  - Éditer dans un navigateur → voir changements dans l'autre
  - Vérifier cursors collaboratifs

- [ ] **Tester conflits**
  - Éditer même ligne simultanément
  - Vérifier résolution CRDT (pas de conflits)

- [ ] **Tester network offline**
  - Couper réseau dans DevTools
  - Continuer à éditer
  - Reconnecter → changements synchronisés

- [ ] **Performance avec 10+ utilisateurs**
  - Simuler avec multiple tabs
  - Vérifier latence < 100ms

---

## Critères d'acceptation

- ✅ Éditeur TipTap remplace textarea
- ✅ Synchronisation temps réel entre 2+ utilisateurs
- ✅ Cursors collaboratifs visibles avec noms
- ✅ Présence indicators (qui est en ligne)
- ✅ Persistance Yjs state en base de données
- ✅ Aucun conflit lors d'édition simultanée
- ✅ Offline support (changements sync au reconnect)
- ✅ Latence < 100ms pour sync

---

## Architecture

```
┌─────────────┐                ┌─────────────┐
│  Browser A  │                │  Browser B  │
│  TipTap +   │                │  TipTap +   │
│  Yjs Client │                │  Yjs Client │
└──────┬──────┘                └──────┬──────┘
       │                              │
       │ WebSocket                    │ WebSocket
       │                              │
       └──────────┬───────────────────┘
                  │
         ┌────────▼─────────┐
         │  WebSocket       │
         │  Server          │
         │  (Pusher or      │
         │   y-websocket)   │
         └────────┬─────────┘
                  │
         ┌────────▼─────────┐
         │  Yjs CRDT        │
         │  Synchronization │
         └──────────────────┘
```

---

## Dépendances

- ✅ Task 1 & 2 terminés (MVP déployé)

---

## Risques

- **Pusher free tier limité** : 200k messages/jour, 100 concurrent connections
  - Mitigation : Upgrade plan si dépassé ($49/mois)
- **WebSocket server custom complexe** : Hosting séparé nécessaire
  - Mitigation : Utiliser Pusher pour MVP
- **Yjs state trop volumineux** : Documents longs peuvent être lourds
  - Mitigation : Compresser state (gzip), pagination si > 10k words

---

## Ressources

- Yjs Docs : https://docs.yjs.dev
- TipTap Docs : https://tiptap.dev
- Pusher Docs : https://pusher.com/docs
- y-websocket : https://github.com/yjs/y-websocket
- TipTap Collaboration : https://tiptap.dev/guide/collaborative-editing

---

## Notes

**Alternative à Pusher** : Liveblocks (collaboration-first platform)
- https://liveblocks.io
- Plus simple que Yjs custom
- Free tier : 100 MAU (Monthly Active Users)
