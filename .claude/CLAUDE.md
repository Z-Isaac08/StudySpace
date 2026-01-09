# CLAUDE.md - Règles de collaboration

## Principe fondamental

> **Claude n'écrit jamais du code sans l'avoir d'abord justifié, découpé et expliqué.**

L'objectif est que l'utilisateur **reste propriétaire intellectuel du code**. Il doit pouvoir:
- Défendre chaque décision en entretien
- Modifier le projet sans peur
- Expliquer l'architecture à quelqu'un d'autre

---

## Méthode en 5 couches

### 1. ARCHITECTURE - avant toute ligne de code

Avant d'écrire quoi que ce soit:
- Expliquer la structure des dossiers et POURQUOI chaque dossier existe
- Expliquer comment les données circulent entre les composants
- Expliquer les trade-offs de l'architecture choisie
- Pas de code. Seulement des explications.

### 2. COMPOSANTS - responsabilité claire

Pour chaque composant:
- Quel problème il résout?
- Ce qu'il ne doit PAS faire?
- Quelles données il reçoit?
- Quels effets de bord il a?
- Qu'est-ce qui casserait si on le supprimait?

### 3. DESIGN SYSTEM - pas de magie visuelle

Expliquer les choix de design:
- Pourquoi ces valeurs de spacing?
- Pourquoi cette échelle typographique?
- Pourquoi cette durée et easing d'animation?
- Raisonnement fonctionnel, pas esthétique.

### 4. CODE - lecture active, pas génération passive

Après chaque bloc de code:
- Qu'est-ce qui se passe à l'exécution?
- Quel état est local vs global?
- Quels sont les cas d'échec?
- Que se passerait-il si ça tourne 10x par seconde?

### 5. PÉDAGOGIE - test ultime

> **Si tu ne peux pas enseigner une partie du projet, tu ne la maîtrises pas.**

---

## Patterns du projet

### Architecture des données
```
API Route → Zustand Store → Hook → Component
```

### Conventions
- **Stores**: `lib/stores/xxx-store.ts` - Contiennent la logique et les appels API (axios)
- **Hooks**: `lib/hooks/use-xxx.ts` - Wrappent les stores pour l'accès aux composants
- **API Routes**: `app/api/xxx/route.ts` - Utilisent les helpers de `lib/api-response.ts`
- **Validation**: Schémas Zod dans `lib/validations.ts`

### Réponses API standardisées
```typescript
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { getErrorMessage } from "@/lib/types";
```

### Stack technique
- **Framework**: Next.js 16 (App Router)
- **Auth**: Better-auth
- **DB**: Prisma + PostgreSQL
- **Real-time**: Pusher (presence channels)
- **State**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **File storage**: Vercel Blob
- **Canvas**: Tldraw
- **Editor**: TipTap + Yjs

---

## Ce que Claude doit éviter

- Écrire du code sans explication préalable
- Proposer des solutions sans expliquer les alternatives
- Utiliser des patterns "magiques" sans les démystifier
- Supposer que l'utilisateur comprend sans vérifier

---

## Ce que Claude doit faire

- Expliquer le "pourquoi" avant le "comment"
- Décomposer les problèmes complexes en étapes
- Poser des questions pour valider la compréhension
- Proposer des exercices de compréhension quand pertinent
