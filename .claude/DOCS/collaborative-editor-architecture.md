# Architecture de l'Éditeur Collaboratif - De 0 à 100

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEUR A                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │  TipTap     │───▶│  Yjs Doc    │───▶│  PusherProvider     │  │
│  │  Editor     │    │  (CRDT)     │    │  (WebSocket)        │  │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘  │
└────────────────────────────────────────────────────┼────────────┘
                                                     │
                                                     ▼
                                          ┌─────────────────────┐
                                          │   PUSHER SERVER     │
                                          │   (Cloud WebSocket) │
                                          └──────────┬──────────┘
                                                     │
                                                     ▼
┌────────────────────────────────────────────────────┼────────────┐
│                        UTILISATEUR B               │            │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────▼──────────┐  │
│  │  TipTap     │◀───│  Yjs Doc    │◀───│  PusherProvider     │  │
│  │  Editor     │    │  (CRDT)     │    │  (WebSocket)        │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Étape 1: Yjs - Le cœur de la collaboration

### Qu'est-ce que Yjs?

**Yjs** est une librairie de **CRDT** (Conflict-free Replicated Data Types). En gros:
- Chaque utilisateur a une copie locale du document
- Les modifications sont **mergées automatiquement** sans conflits
- Pas besoin de serveur central pour résoudre les conflits

### Comment ça marche?

```typescript
// lib/yjs/utils.ts
import * as Y from "yjs";

// 1. Créer un document Yjs
const ydoc = new Y.Doc();

// 2. Créer un "fragment" pour le texte (TipTap l'utilise)
const yXmlFragment = ydoc.getXmlFragment("default");

// Ce fragment est PARTAGÉ entre tous les utilisateurs
// Quand User A tape "Hello", ça modifie yXmlFragment
// Cette modification est envoyée aux autres via le Provider
```

### Structure du Y.Doc

```
Y.Doc
├── XmlFragment("default")  ← Contenu TipTap (texte, formatage)
├── Map("awareness")        ← Qui est connecté, position curseur
└── ... autres données partagées
```

### Pourquoi CRDT?

Imagine que User A et User B tapent en même temps à la même position:
- User A tape "Hello"
- User B tape "World"

Avec un système classique, il y aurait un conflit. Avec CRDT:
- Chaque caractère a un ID unique basé sur le temps + client ID
- Les opérations sont **commutatives** (ordre n'importe pas)
- Résultat: "HelloWorld" ou "WorldHello" (déterministe, même résultat pour tous)

---

## Étape 2: Awareness - Savoir qui est là

### Qu'est-ce que Awareness?

C'est un système pour partager l'état "éphémère" des utilisateurs:
- Position du curseur
- Nom de l'utilisateur
- Couleur assignée
- Est-ce qu'il tape en ce moment?

### Implémentation

```typescript
// lib/yjs/utils.ts
import { Awareness } from "y-protocols/awareness";

const awareness = new Awareness(ydoc);

// Définir mon état local
awareness.setLocalState({
  user: {
    name: "Isaac",
    color: "#3B82F6",  // Bleu
  },
  cursor: { anchor: 10, head: 15 },  // Sélection
});

// Écouter les changements des autres
awareness.on("change", () => {
  const states = awareness.getStates();
  // Map<clientId, { user, cursor, ... }>

  states.forEach((state, clientId) => {
    console.log(`${state.user.name} est à la position ${state.cursor}`);
  });
});
```

### Couleurs déterministes

Chaque utilisateur a une couleur basée sur son ID (pas aléatoire):

```typescript
// lib/yjs/utils.ts
const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
];

export function getUserColor(userId: string): string {
  // Hash du userId pour obtenir un index stable
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}
```

---

## Étape 3: Provider - Le transport

### Pourquoi un Provider?

Yjs ne sait pas **comment** envoyer les données. Il faut un "Provider" pour:
- Envoyer les modifications aux autres
- Recevoir les modifications des autres
- Gérer la connexion/déconnexion

### Alternatives de Providers

| Provider | Description | Notre choix |
|----------|-------------|-------------|
| y-websocket | WebSocket self-hosted | ❌ Nécessite serveur |
| y-webrtc | Peer-to-peer | ❌ Complexe NAT traversal |
| y-indexeddb | Persistence locale | ✅ Pour offline |
| **PusherProvider** | WebSocket managé | ✅ Notre implémentation |

### Notre PusherProvider

On utilise **Pusher** (WebSocket managé) au lieu de y-websocket:

```typescript
// lib/yjs/pusher-provider.ts
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import * as awarenessProtocol from "y-protocols/awareness";
import type { Channel } from "pusher-js";

export class PusherProvider {
  private ydoc: Y.Doc;
  private awareness: Awareness;
  private channel: Channel;
  public synced: boolean = false;

  constructor(ydoc: Y.Doc, awareness: Awareness, channel: Channel) {
    this.ydoc = ydoc;
    this.awareness = awareness;
    this.channel = channel;

    this.setupYjsSync();
    this.setupAwarenessSync();
  }

  private setupYjsSync() {
    // 1. Écouter les modifications LOCALES du Y.Doc
    this.ydoc.on("update", (update: Uint8Array, origin: any) => {
      // Ne pas re-broadcast si c'est une update reçue d'un autre
      if (origin === this) return;

      // Envoyer aux autres via Pusher
      this.channel.trigger("client-yjs-update", {
        update: Array.from(update),
      });
    });

    // 2. Écouter les modifications des AUTRES via Pusher
    this.channel.bind("client-yjs-update", (data: { update: number[] }) => {
      const update = new Uint8Array(data.update);
      // Appliquer avec `this` comme origin pour éviter boucle
      Y.applyUpdate(this.ydoc, update, this);
    });
  }

  private setupAwarenessSync() {
    // 3. Synchroniser l'awareness (curseurs, présence)
    this.awareness.on("update", ({ added, updated, removed }) => {
      const changedClients = [...added, ...updated, ...removed];
      const update = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        changedClients
      );
      this.channel.trigger("client-yjs-awareness", {
        update: Array.from(update),
      });
    });

    this.channel.bind("client-yjs-awareness", (data: { update: number[] }) => {
      const update = new Uint8Array(data.update);
      awarenessProtocol.applyAwarenessUpdate(this.awareness, update, this);
    });
  }

  destroy() {
    // Cleanup
    this.awareness.setLocalState(null);
  }
}
```

### Flux des données détaillé

```
User A tape "Hello"
       │
       ▼
┌──────────────┐
│ TipTap Editor │ ──▶ Modifie le XmlFragment via Yjs
└──────────────┘
       │
       ▼
┌──────────────┐
│   Y.Doc      │ ──▶ Émet event "update" avec Uint8Array
└──────────────┘
       │
       ▼
┌──────────────┐
│ PusherProvider│ ──▶ Convertit en Array<number> (JSON-safe)
└──────────────┘     ──▶ channel.trigger("client-yjs-update", {...})
       │
       ▼ (Pusher Cloud - WebSocket)
       │
       ▼
┌──────────────┐
│ PusherProvider│ ◀── channel.bind("client-yjs-update", ...)
│   (User B)    │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Y.Doc      │ ◀── Y.applyUpdate(ydoc, update, origin)
│   (User B)    │     Le CRDT merge automatiquement
└──────────────┘
       │
       ▼
┌──────────────┐
│ TipTap Editor │ ◀── L'extension Collaboration observe le Y.Doc
│   (User B)    │     et met à jour l'UI automatiquement
└──────────────┘
```

---

## Étape 4: TipTap + Yjs

### Extensions TipTap pour collaboration

TipTap a des extensions officielles pour Yjs:

```typescript
// components/editor/CollaborativeEditor.tsx
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";

const editor = useEditor({
  extensions: [
    // Extension de base (bold, italic, lists, etc.)
    StarterKit.configure({
      history: false,  // ⚠️ IMPORTANT: Désactiver l'historique natif!
    }),

    // Extension collaboration - connecte TipTap au Y.Doc
    Collaboration.configure({
      document: ydoc,           // Notre Y.Doc partagé
      field: "default",         // Nom du XmlFragment à utiliser
    }),

    // Extension curseurs - affiche les curseurs des autres
    CollaborationCaret.configure({
      provider: pusherProvider,  // Notre provider pour l'awareness
      user: {
        name: "Isaac",
        color: "#3B82F6",
      },
    }),
  ],
});
```

### Pourquoi désactiver history?

TipTap a un système undo/redo natif (`Mod-z`, `Mod-Shift-z`), mais il ne comprend pas les modifications collaboratives.

**Problème sans désactiver:**
1. User A tape "Hello"
2. User B tape "World"
3. User A fait Undo
4. ❌ "Hello" ET "World" disparaissent (undo global)

**Solution avec Yjs UndoManager:**

```typescript
import { UndoManager } from "yjs";

const yXmlFragment = ydoc.getXmlFragment("default");
const undoManager = new UndoManager(yXmlFragment);

// Undo seulement MES modifications
undoManager.undo();
undoManager.redo();
```

Yjs track quel client a fait quelle modification, donc l'undo est **personnel**.

---

## Étape 5: Hook useCollaborativeEditor

Notre hook orchestre tout le lifecycle:

```typescript
// lib/hooks/use-collaborative-editor.ts
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { useState, useEffect, useRef } from "react";
import { PusherProvider } from "@/lib/yjs/pusher-provider";
import { getUserColor } from "@/lib/yjs/utils";

interface UseCollaborativeEditorProps {
  sessionId: string;
  userId: string;
  userName: string;
  pusherChannel: Channel | null;
  fetchYjsState: (sessionId: string) => Promise<number[] | null>;
  saveYjsState: (sessionId: string, state: number[]) => Promise<void>;
}

export function useCollaborativeEditor({
  sessionId,
  userId,
  userName,
  pusherChannel,
  fetchYjsState,
  saveYjsState,
}: UseCollaborativeEditorProps) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [awareness, setAwareness] = useState<Awareness | null>(null);
  const [provider, setProvider] = useState<PusherProvider | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("syncing");

  useEffect(() => {
    // Attendre que le channel Pusher soit prêt
    if (!pusherChannel) return;

    // 1. Créer le Y.Doc
    const doc = new Y.Doc();

    // 2. Créer l'Awareness
    const aware = new Awareness(doc);
    aware.setLocalState({
      user: {
        name: userName,
        color: getUserColor(userId),
      },
    });

    // 3. Charger l'état initial depuis la DB
    const loadInitialState = async () => {
      try {
        const savedState = await fetchYjsState(sessionId);
        if (savedState && savedState.length > 0) {
          // Appliquer l'état sauvegardé
          const update = new Uint8Array(savedState);
          Y.applyUpdate(doc, update);
          console.log("📥 Loaded saved Yjs state");
        }
        setIsLoaded(true);
        setSyncStatus("synced");
      } catch (error) {
        console.error("Failed to load Yjs state:", error);
        setSyncStatus("error");
        setIsLoaded(true); // Continue anyway with empty doc
      }
    };

    loadInitialState();

    // 4. Créer le Provider (connexion WebSocket via Pusher)
    const prov = new PusherProvider(doc, aware, pusherChannel);

    // 5. Auto-save périodique (toutes les 30 secondes)
    const saveInterval = setInterval(async () => {
      try {
        const state = Y.encodeStateAsUpdate(doc);
        await saveYjsState(sessionId, Array.from(state));
        console.log("💾 Auto-saved Yjs state");
      } catch (error) {
        console.error("Failed to save Yjs state:", error);
      }
    }, 30000);

    setYdoc(doc);
    setAwareness(aware);
    setProvider(prov);

    // Cleanup on unmount
    return () => {
      clearInterval(saveInterval);
      prov.destroy();
      aware.destroy();
      doc.destroy();
    };
  }, [pusherChannel, sessionId, userId, userName, fetchYjsState, saveYjsState]);

  return {
    ydoc,
    awareness,
    provider,
    isLoaded,
    syncStatus,
  };
}
```

---

## Étape 6: Persistance en DB

### Pourquoi sauvegarder?

Yjs est en mémoire. Si tous les utilisateurs quittent, le document est perdu.
On sauvegarde régulièrement en base de données.

### API Routes

```typescript
// app/api/sessions/[id]/yjs/route.ts

// GET - Charger l'état
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const session = await prisma.studySession.findUnique({
    where: { id },
    select: { yjsState: true },
  });

  // yjsState est stocké comme JSON (Array<number>)
  return successResponse({ yjsState: session?.yjsState || null });
}

// POST - Sauvegarder l'état
export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { yjsState } = await request.json();

  await prisma.studySession.update({
    where: { id },
    data: { yjsState },  // Array<number> stocké en JSON
  });

  return successResponse({ saved: true });
}
```

### Format du state

```typescript
// Encoder le document entier en binaire compact
const state = Y.encodeStateAsUpdate(ydoc);
// → Uint8Array(1234) - très compact!

// Convertir en JSON-safe pour stockage
const jsonState = Array.from(state);
// → [0, 1, 45, 23, 255, 128, ...]

// Restaurer depuis la DB
const restored = new Uint8Array(jsonState);
Y.applyUpdate(newDoc, restored);
// → Document restauré à l'identique!
```

### Schéma Prisma

```prisma
model StudySession {
  id          String    @id @default(uuid())
  // ... autres champs
  yjsState    Json?     // Stocke Array<number>
}
```

---

## Étape 7: Composant CollaborativeEditor

Le composant final qui assemble tout:

```typescript
// components/editor/CollaborativeEditor.tsx
"use client";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

import { useCollaborativeEditor } from "@/lib/hooks/use-collaborative-editor";
import { useStudySession } from "@/lib/hooks/use-study-session";
import { getUserColor } from "@/lib/yjs/utils";

interface CollaborativeEditorProps {
  sessionId: string;
  userId: string;
  userName: string;
  pusherChannel: Channel | null;
  onSave?: (content: string) => void;
}

export function CollaborativeEditor({
  sessionId,
  userId,
  userName,
  pusherChannel,
  onSave,
}: CollaborativeEditorProps) {
  const { fetchYjsState, saveYjsState } = useStudySession();

  // 1. Initialiser Yjs via notre hook
  const {
    ydoc,
    awareness,
    provider,
    isLoaded,
    syncStatus,
  } = useCollaborativeEditor({
    sessionId,
    userId,
    userName,
    pusherChannel,
    fetchYjsState,
    saveYjsState,
  });

  // 2. Créer l'éditeur TipTap avec extensions collaboration
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,  // Désactivé car Yjs gère l'historique
        }),
        // Connecter au Y.Doc (si disponible)
        ...(ydoc
          ? [
              Collaboration.configure({
                document: ydoc,
                field: "default",
              }),
            ]
          : []),
        // Afficher les curseurs des autres (si provider disponible)
        ...(provider
          ? [
              CollaborationCaret.configure({
                provider: provider,
                user: {
                  name: userName,
                  color: getUserColor(userId),
                },
              }),
            ]
          : []),
      ],
      editorProps: {
        attributes: {
          class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
        },
      },
    },
    [ydoc, provider]  // Recréer l'éditeur si ydoc/provider change
  );

  // 3. Auto-save HTML (legacy, en plus de Yjs)
  useEffect(() => {
    if (!editor || !onSave) return;

    const interval = setInterval(() => {
      onSave(editor.getHTML());
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, onSave]);

  // 4. Loading state
  if (!editor || !isLoaded) {
    return <div>Chargement de l'éditeur...</div>;
  }

  // 5. Render
  return (
    <div className="border rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          Italic
        </button>
        {/* ... autres boutons */}
      </div>

      {/* Status indicator */}
      <div className="px-2 py-1 text-xs text-gray-500">
        {syncStatus === "synced" && "✓ Synchronisé"}
        {syncStatus === "syncing" && "↻ Synchronisation..."}
        {syncStatus === "error" && "⚠ Erreur de sync"}
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
```

---

## Étape 8: Flux complet - Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER A ouvre la session                                      │
├─────────────────────────────────────────────────────────────────┤
│    a. SessionPage monte                                          │
│    b. Pusher.subscribe("presence-session-{id}")                 │
│    c. useCollaborativeEditor() s'initialise                     │
│    d. fetchYjsState() charge l'état depuis DB                   │
│    e. Y.applyUpdate() restaure le document                      │
│    f. PusherProvider se connecte au channel                     │
│    g. TipTap editor se crée avec Collaboration extension        │
│    h. isLoaded = true, UI s'affiche                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. USER B ouvre la même session                                 │
├─────────────────────────────────────────────────────────────────┤
│    a. Même processus que User A                                 │
│    b. Awareness détecte un nouveau membre                       │
│    c. User A voit le curseur de User B apparaître               │
│    d. Les deux documents sont synchronisés                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. USER A tape "Hello"                                          │
├─────────────────────────────────────────────────────────────────┤
│    a. Keypress → TipTap → Modifie XmlFragment                   │
│    b. Y.Doc émet "update" event                                 │
│    c. PusherProvider intercepte l'update                        │
│    d. channel.trigger("client-yjs-update", { update: [...] })   │
│    e. Pusher route vers User B                                  │
│    f. User B reçoit, Y.applyUpdate()                            │
│    g. TipTap de User B se met à jour automatiquement            │
│    h. Latence totale: ~50-100ms                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Auto-save (toutes les 30 secondes)                           │
├─────────────────────────────────────────────────────────────────┤
│    a. setInterval déclenche                                     │
│    b. Y.encodeStateAsUpdate(ydoc) → Uint8Array                  │
│    c. Array.from(state) → Array<number>                         │
│    d. POST /api/sessions/{id}/yjs                               │
│    e. prisma.studySession.update({ yjsState: [...] })           │
│    f. État persisté en DB                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. USER A ferme l'onglet                                        │
├─────────────────────────────────────────────────────────────────┤
│    a. useEffect cleanup s'exécute                               │
│    b. awareness.setLocalState(null)                             │
│    c. provider.destroy()                                        │
│    d. ydoc.destroy()                                            │
│    e. Pusher détecte déconnexion                                │
│    f. User B voit le curseur de User A disparaître              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. 3 jours plus tard, USER C ouvre la session                   │
├─────────────────────────────────────────────────────────────────┤
│    a. fetchYjsState() charge depuis DB                          │
│    b. Y.applyUpdate() restaure le document                      │
│    c. User C voit exactement ce que User A et B avaient écrit   │
│    d. Peut continuer à éditer normalement                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fichiers clés dans le projet

| Fichier | Rôle | Localisation |
|---------|------|--------------|
| `utils.ts` | Création Y.Doc, Awareness, couleurs | `lib/yjs/utils.ts` |
| `pusher-provider.ts` | Transport WebSocket via Pusher | `lib/yjs/pusher-provider.ts` |
| `use-collaborative-editor.ts` | Hook orchestrateur, gère lifecycle | `lib/hooks/use-collaborative-editor.ts` |
| `CollaborativeEditor.tsx` | Composant UI TipTap + extensions | `components/editor/CollaborativeEditor.tsx` |
| `route.ts` (yjs) | API persistance DB | `app/api/sessions/[id]/yjs/route.ts` |

---

## Dépendances npm

```json
{
  "dependencies": {
    "yjs": "^13.6.x",
    "y-protocols": "^1.0.x",
    "@tiptap/react": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "@tiptap/extension-collaboration": "^2.x",
    "@tiptap/extension-collaboration-caret": "^2.x",
    "pusher-js": "^8.x"
  }
}
```

---

## Points clés à retenir

1. **Yjs** = CRDT, merge automatique des conflits
2. **Awareness** = état éphémère (curseurs, présence)
3. **Provider** = transport (nous: Pusher WebSocket)
4. **TipTap extensions** = pont entre éditeur et Y.Doc
5. **Persistance** = sauvegarde périodique en DB
6. **Undo/Redo** = via Yjs UndoManager, pas TipTap natif

---

## Application à tldraw

Pour tldraw, le principe est identique:
- tldraw a son propre "store" au lieu de TipTap
- On connecte ce store à un `Y.Doc` via `@tldraw/yjs` ou `y-tldraw`
- Le Y.Doc sync via notre `PusherProvider` existant
- Persistance: `tldrawState` (JSON) au lieu de `yjsState`

La seule différence est le "binding" entre tldraw et Yjs, le reste de l'infra reste identique.
