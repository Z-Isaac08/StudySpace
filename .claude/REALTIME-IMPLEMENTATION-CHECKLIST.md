# Checklist d'Implémentation - Éditeur Collaboratif

## Légende
- [x] Implémenté
- [ ] Non implémenté
- [~] Partiellement implémenté

---

## Critique (Bugs potentiels)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 33 | Désactiver History TipTap (conflit avec Yjs) | [x] | `components/editor/CollaborativeEditor.tsx` - Collaboration extension gère undo/redo |
| 14 | Couleur déterministe utilisateur | [x] | `lib/yjs/utils.ts` - `getUserColor()` |

---

## Haute Priorité - Architecture (#1-12)

### Hooks Composables (#1)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 1a | Hook `useYjsDocument` | [x] | `lib/hooks/use-yjs-document.ts` |
| 1b | Hook `usePusherSync` | [x] | `lib/hooks/use-pusher-sync.ts` |
| 1c | Hook `usePresence` | [x] | `lib/hooks/use-presence.ts` |
| 1d | Hook `useCollaborativeEditor` (orchestrateur) | [x] | `lib/hooks/use-collaborative-editor.ts` |
| 1e | Hook `useConnectionStatus` | [x] | `lib/hooks/use-connection-status.ts` |

### Provider Pattern (#2)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 2 | CollaborationContext provider | [~] | Intégré dans `useCollaborativeEditor` - Context React non créé séparément |

### PusherProvider Class (#3)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 3 | Classe `PusherProvider` dédiée | [x] | `lib/yjs/pusher-provider.ts` |

### Structure lib/yjs/ (#4)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 4a | `create-document.ts` | [x] | `lib/yjs/create-document.ts` |
| 4b | `awareness.ts` | [x] | `lib/yjs/awareness.ts` |
| 4c | `utils.ts` | [x] | `lib/yjs/utils.ts` |
| 4d | `pusher-provider.ts` | [x] | `lib/yjs/pusher-provider.ts` |
| 4e | `index.ts` (barrel export) | [x] | `lib/yjs/index.ts` |

### Types dédiés (#5)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 5 | Types collaboration/presence/editor | [x] | `lib/types/collaboration.ts`, `lib/types/index.ts` |

### Résilience Réseau (#8-12)

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 8 | Détection online/offline | [x] | `lib/hooks/use-connection-status.ts` |
| 9 | Indicateur statut sync | [x] | `components/editor/EditorStatusBar.tsx` |
| 10 | Reconnexion avec resync | [x] | `lib/yjs/pusher-provider.ts` - `forceResync()` |
| 11 | Backoff exponentiel | [x] | `lib/yjs/utils.ts` - `getBackoffDelay()`, `lib/yjs/pusher-provider.ts` |
| 12 | Provider résilient | [x] | `lib/yjs/pusher-provider.ts` - retry logic intégrée |

---

## Moyenne Priorité - UX (#13, #15-17, #32, #37)

### Présence Avancée

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 13 | États utilisateur (online/idle/editing) | [x] | `lib/types/collaboration.ts`, `lib/yjs/awareness.ts` |
| 15 | Composant `PresenceAvatars` | [x] | `components/editor/PresenceAvatars.tsx` |
| 17 | Tracking `lastActivity` | [x] | `lib/hooks/use-presence.ts`, `lib/yjs/awareness.ts` |

### Composants UI

| # | Fonctionnalité | Status | Fichier(s) |
|---|----------------|--------|------------|
| 32 | Banner offline | [x] | `components/editor/OfflineBanner.tsx` |
| 36 | `EditorSkeleton` | [x] | `components/editor/EditorSkeleton.tsx` |
| 37 | `EditorStatusBar` | [x] | `components/editor/EditorStatusBar.tsx` |

---

## Basse Priorité - Non Implémenté

### Channels Pusher (#6-7)

| # | Fonctionnalité | Status | Notes |
|---|----------------|--------|-------|
| 6 | Séparation channels private/presence | [ ] | Utilise un seul channel `presence-session-{id}` |
| 7 | Validation permissions document dans auth | [ ] | Auth globale seulement |

### Sécurité (#18-21)

| # | Fonctionnalité | Status | Notes |
|---|----------------|--------|-------|
| 18 | `canAccessDocument()` | [ ] | Non implémenté |
| 19 | `canEditDocument()` | [ ] | Non implémenté |
| 20 | Rate limiting | [ ] | Non implémenté |
| 21 | Validation taille update | [ ] | Non implémenté |

### Performance (#22-25)

| # | Fonctionnalité | Status | Notes |
|---|----------------|--------|-------|
| 22 | Debouncing broadcasts | [x] | `lib/yjs/pusher-provider.ts` |
| 23 | Compression updates | [ ] | Non implémenté |
| 24 | Garbage collection Yjs | [ ] | Non implémenté |
| 25 | Métriques/Monitoring | [ ] | Non implémenté |

### Persistance (#26-28)

| # | Fonctionnalité | Status | Notes |
|---|----------------|--------|-------|
| 26 | Versioning documents | [ ] | Non implémenté |
| 27 | Restauration version | [ ] | Non implémenté |
| 28 | Version schema doc | [ ] | Non implémenté |

### Gestion Erreurs (#29-31)

| # | Fonctionnalité | Status | Notes |
|---|----------------|--------|-------|
| 29 | Détection désync | [ ] | Non implémenté |
| 30 | Force resync serveur | [x] | `lib/yjs/pusher-provider.ts` |
| 31 | Mode lecture seule dégradé | [ ] | Non implémenté |

### Tests (#40-42)

| # | Fonctionnalité | Status | Notes |
|---|----------------|--------|-------|
| 40 | Tests collaboration | [ ] | Non implémenté |
| 41 | Tests E2E Playwright | [ ] | Non implémenté |
| 42 | Tests de charge | [ ] | Non implémenté |

---

## Fichiers Créés/Modifiés

### Nouveaux Fichiers

```
lib/
├── types/
│   ├── collaboration.ts    # Types pour collaboration
│   └── index.ts            # Barrel export
├── yjs/
│   ├── create-document.ts  # Factory Yjs document
│   ├── awareness.ts        # Helpers awareness
│   ├── utils.ts            # Utilitaires (couleurs, debounce, etc.)
│   ├── pusher-provider.ts  # Provider Yjs/Pusher
│   └── index.ts            # Barrel export
└── hooks/
    ├── use-yjs-document.ts       # Hook document Yjs
    ├── use-pusher-sync.ts        # Hook sync Pusher
    ├── use-presence.ts           # Hook présence
    ├── use-connection-status.ts  # Hook statut connexion
    ├── use-collaborative-editor.ts # Hook orchestrateur
    └── index.ts                  # Mis à jour avec exports

components/editor/
├── EditorStatusBar.tsx    # Barre de statut sync
├── EditorSkeleton.tsx     # Skeleton loading
├── OfflineBanner.tsx      # Banner hors ligne
├── PresenceAvatars.tsx    # Avatars présence
└── CollaborativeEditor.tsx # Refactorisé avec hooks
```

### Fichiers Modifiés

- `components/editor/CollaborativeEditor.tsx` - Refactorisé pour utiliser les nouveaux hooks
- `lib/hooks/index.ts` - Ajout des exports des nouveaux hooks

---

## Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                     CollaborativeEditor                      │
│                    (Client Component)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
│useCollaborative │ │ usePresence  │ │useConnectionStatus│
│     Editor      │ │              │ │                  │
└────────┬────────┘ └──────┬───────┘ └────────┬─────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      PusherProvider                          │
│  - Gère sync Yjs via Pusher                                 │
│  - Exponential backoff                                       │
│  - Resync automatique                                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│    Yjs Doc      │ │  Awareness   │ │   Pusher     │
│    (CRDT)       │ │  (Présence)  │ │   Channel    │
└─────────────────┘ └──────────────┘ └──────────────┘
```

---

## Prochaines Étapes Recommandées

1. **Tests** - Ajouter tests unitaires et E2E
2. **Sécurité** - Implémenter `canAccessDocument()` et `canEditDocument()`
3. **Performance** - Ajouter compression et garbage collection
4. **Versioning** - Implémenter snapshots et historique

---

## Notes pour Implémentation Future

### Mode Session Plein Écran (À FAIRE)

**Concept**: Quand une session démarre, elle prend tout l'écran avec une mise en page côte-à-côte:
- **Gauche**: Notes collaboratives (éditeur TipTap)
- **Droite**: Tableau blanc collaboratif

**Implémentation suggérée**:
1. Créer un route group `(session)` avec un layout minimal (sans sidebar/navbar)
2. Déplacer la page session vers `app/(session)/session/[id]/page.tsx`
3. Layout session avec seulement: header compact + bouton quitter
4. Disposition flexible: notes et whiteboard côte-à-côte (pas de tabs)

**Avantages**:
- Immersion totale dans la session d'étude
- Plus besoin de tabs pour basculer entre notes et whiteboard
- Meilleure expérience collaborative

**Structure de fichiers**:
```
app/
├── (dashboard)/          # Layout avec sidebar
│   └── dashboard/
│       └── ...
└── (session)/            # Layout minimal plein écran
    └── session/
        └── [id]/
            └── page.tsx
```

### Unification du Système de Présence (À CONSIDÉRER)

Actuellement deux systèmes de présence coexistent:
- `SessionPresence` - Utilise Pusher presence channel (simple: connecté/déconnecté)
- `PresenceAvatars` - Utilise Yjs Awareness (riche: online/idle/editing)

**Amélioration potentielle**:
- Étendre Yjs Awareness pour tracker l'activité whiteboard (état `drawing`)
- Fusionner les deux composants en un seul système unifié
- États possibles: `online`, `idle`, `editing` (notes), `drawing` (whiteboard)
