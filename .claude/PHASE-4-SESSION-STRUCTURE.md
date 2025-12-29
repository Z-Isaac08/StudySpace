# PHASE 4 - STRUCTURE DE SESSION & RÉSUMÉ COLLABORATIF

## Date: 2025-12-28
## Statut: PLANIFICATION - À IMPLÉMENTER

---

## 🎯 OBJECTIF GLOBAL

Transformer les sessions StudySpace en **unités de travail structurées** avec un résultat clair et exploitable.

**Définition d'une session réussie:**
> Un document structuré qui contient ce qui a été compris/décidé, consultable plus tard sans se souvenir de qui a dit quoi.

**Test de validation:**
> Si quelqu'un revient 3 jours après (ou n'a pas participé), est-ce qu'il comprend ce qui s'est passé?

---

## 📐 ARCHITECTURE DES 3 ESPACES

### 1. 🖍️ CANVAS (Tableau blanc virtuel)

**Nature:**
- Espace de **réflexion temporaire**
- Brouillon collaboratif
- Mimique un tableau physique

**Comportement:**
- **Effaçable** (quand plus de place, on efface)
- Collaboratif temps réel (tous dessinent)
- Sauvegardé en **format natif tldraw** (JSON, pas PNG)
- Consultable après session (pas converti en image)

**Usage:**
- Résoudre exercice étape par étape
- Dessiner schémas, graphiques
- Calculs intermédiaires
- Réflexion visuelle collective

**Implémentation:**
- tldraw (déjà intégré)
- Sync via Yjs
- Bouton "Effacer sélection" + "Tout effacer" (avec confirmation)
- Auto-save toutes les 30s

---

### 2. 📝 RÉSUMÉ COLLABORATIF (Résultat de session)

**Nature:**
- **LE** livrable principal de la session
- Ce qui reste après la session
- Collaboratif (tous éditent en temps réel)

**Contenu (libre avec structure suggérée):**

```markdown
✅ **Compris**
- Multiplication AB ≠ BA
- Résultat exercice 5a):
  Matrix: [2,4; 1,3]
- Formule trouvée: det(A) = ad - bc

⚠️ **Flou / Partiellement compris**
- Déterminant 3×3 (formule ok, mais intuition géométrique manquante)
- Relation entre inverse et déterminant

❌ **Non compris / Bloqué**
- Condition exacte pour matrice inversible
- Pourquoi déterminant = 0 implique non inversible?

🧩 **À faire / TODO**
- [ ] Exercice 6 pour mardi
- [ ] Revoir vidéo Khan Academy sur déterminants
- [ ] Refaire 5b) individuellement
```

**Caractéristiques:**
- **Markdown riche**: formules LaTeX, code, images, liens
- **Structure suggérée** (✅ ⚠️ ❌ 🧩) mais supprimable si besoin contenu totalement libre
- **Édition collaborative temps réel** (curseurs visibles avec couleurs)
- **Persistant** (consultable après session terminée)

**Implémentation:**
- TipTap editor avec Yjs
- Template initial pré-rempli avec structure
- Extension Mathematics (@tiptap/extension-mathematics + KaTeX) pour équations
- Auto-save toutes les 30s
- Stocké dans `StudySession.summaryContent` (markdown string)

---

### 3. 📓 NOTES INDIVIDUELLES (Espace privé)

**Nature:**
- **Privé** (chacun voit uniquement les siennes)
- Espace de reformulation personnelle
- Pas collaboratif

**Contenu exemple:**

```markdown
# Mes notes - Session #5

J'ai compris la méthode ligne × colonne mais je dois:
- Refaire l'exercice 5b) seul pour vérifier
- Comprendre pourquoi AB ≠ BA (intuition géométrique?)

Questions à poser la prochaine fois:
- C'est quoi un déterminant "concrètement"?
- Lien avec les systèmes d'équations?

Points à réviser:
- Matrice identité (définition ok, mais usage?)
```

**Caractéristiques:**
- **Markdown libre** (pas de structure imposée)
- **Visible uniquement par l'auteur**
- **Pas de sync Yjs** (c'est local/privé)
- Auto-save toutes les 30s
- Consultable après session

**Implémentation:**
- TipTap editor simple (pas de collaboration)
- Table séparée: `SessionNote` (voir schema DB)
- Badge "Privé - visible uniquement par vous"
- Pas de curseurs collaboratifs

---

## 🎨 LAYOUT UI (OPTION B - SPLIT-SCREEN)

### Desktop (écran large ≥1024px)

```
┌──────────────────────────────────────────────────────────┐
│ 🎯 Objectif: Résoudre exercice 5 sur les matrices       │
│                                          [📓 Mes notes]  │ ← bouton top-right
├───────────────────────────┬──────────────────────────────┤
│                           │ 📝 RÉSUMÉ COLLABORATIF       │
│                           │                              │
│   🖍️ CANVAS               │ ✅ Compris                   │
│                           │ • Multiplication AB ≠ BA     │
│   (60% largeur)           │ • Résultat 5a): [2,4; 1,3]  │
│                           │                              │
│   Collaboratif            │ ⚠️ Flou                      │
│   Effaçable               │ • Déterminant 3×3 (formule   │
│   Temps réel              │   ok, intuition manquante)   │
│                           │                              │
│                           │ ❌ Non compris               │
│                           │ • Condition inversibilité    │
│                           │                              │
│                           │ 🧩 À faire                   │
│                           │ • [ ] Exercice 6             │
│                           │ • [ ] Vidéo déterminants     │
│                           │                              │
│                           │ (40% largeur)                │
└───────────────────────────┴──────────────────────────────┘
│ Présence: 👤 Isaac (canvas) 👤 Pearl (résumé) 👤 Caleb  │
└──────────────────────────────────────────────────────────┘
```

**Proportions:**
- Canvas: 60% largeur (gauche)
- Résumé: 40% largeur (droite)
- Hauteur: 100% viewport (plein écran)
- Résizable (drag divider pour ajuster)

**Bouton "Mes notes":**
- Position: Top-right (à côté de l'objectif)
- Comportement: Ouvre modal/sidebar plein écran ou 50% width
- Fermeture: Esc ou bouton "Retour à la session"
- Badge numérique si notes non vides

**Avantages:**
✅ Canvas et Résumé **toujours visibles en même temps**
✅ Pas de tabs → pas de confusion "qui voit quoi"
✅ Aller-retour constant: réfléchir (Canvas) → valider (Résumé)
✅ Notes perso accessibles sans perdre contexte

---

### Mobile (écran <1024px)

**Tabs obligatoires** (pas assez de place pour split):

```
┌────────────────────────────────────┐
│ 🎯 Objectif: Résoudre ex. 5       │
├────────────────────────────────────┤
│ [Canvas 🟢×3] [Résumé] [Mes notes]│ ← tabs avec indicateurs
├────────────────────────────────────┤
│                                    │
│   ... contenu du tab actif ...    │
│                                    │
│                                    │
└────────────────────────────────────┘
│ 👤×3 connectés                     │
└────────────────────────────────────┘
```

**Comportement:**
- Tabs individuels (chacun peut être sur un tab différent)
- **Indicateurs d'activité** sur les tabs:
  - `🟢×3` = 3 personnes sur Canvas
  - Badge numérique si activité récente
- **Notification** si quelqu'un écrit dans Résumé pendant que t'es sur Canvas
- Swipe gauche/droite pour changer de tab

---

### FUTURE: Avec Visio intégrée

**Option 1: Visio en overlay (floating)**

```
┌──────────────────────────────────────────────┐
│ 🎯 Objectif                   [Mes notes]    │
├─────────────────────┬────────────────────────┤
│                     │                        │
│   CANVAS (60%)      │   RÉSUMÉ (40%)         │
│                     │                        │
│  ┌──────────────┐   │                        │
│  │ 📹 Visio     │   │                        │ ← floating
│  │  🟢 Pearl    │   │                        │
│  │  🟢 Caleb    │   │                        │
│  └──────────────┘   │                        │
│                     │                        │
└─────────────────────┴────────────────────────┘
```

**Option 2: Visio en sidebar droit (resizable)**

```
┌────────────────────────────────────────────────────┐
│ 🎯 Objectif                         [Mes notes]    │
├──────────────────┬─────────────┬───────────────────┤
│                  │             │ 📹 VISIO          │
│   CANVAS (50%)   │ RÉSUMÉ      │                   │
│                  │ (30%)       │ 🟢 Pearl          │
│                  │             │ 🟢 Caleb          │
│                  │             │ 🔇 Isaac (mute)   │
│                  │             │                   │
│                  │             │ (20%)             │
└──────────────────┴─────────────┴───────────────────┘
```

**À décider plus tard** (Phase 5 - Visio intégration)

---

## 💾 SCHEMA BASE DE DONNÉES

### Table: `study_session` (modifiée)

```typescript
interface StudySession {
  // Existing fields
  id: string;
  workspaceId: string;
  createdById: string;
  startedAt: Date;
  endedAt?: Date;

  // États actuels (canvas + editor)
  canvasState?: { dataURL: string }; // REMPLACER par tldrawState
  editorState?: { content: string }; // DÉPRÉCIER (remplacé par summaryContent)
  yjsState?: number[];

  // NOUVEAUX CHAMPS
  objective?: string; // "Résoudre exercice 5 sur les matrices"
  summaryContent?: string; // Résumé collaboratif (markdown)
  tldrawState?: string; // JSON natif tldraw (pas PNG)
}
```

**Migrations à faire:**
1. Ajouter colonne `objective` (nullable string)
2. Ajouter colonne `summaryContent` (nullable text)
3. Ajouter colonne `tldrawState` (nullable text/json)
4. Déprécier `editorState` (garder pour rétrocompatibilité)

---

### Table: `session_note` (NOUVELLE)

```typescript
interface SessionNote {
  id: string;
  sessionId: string; // FK -> study_session.id
  userId: string; // FK -> user.id (propriétaire)
  content: string; // Markdown privé
  createdAt: Date;
  updatedAt: Date;
}

// Relations
SessionNote.belongsTo(StudySession, { foreignKey: 'sessionId' })
SessionNote.belongsTo(User, { foreignKey: 'userId' })

// Index
CREATE INDEX idx_session_note_user ON session_note(session_id, user_id);
CREATE UNIQUE INDEX idx_session_note_unique ON session_note(session_id, user_id);
```

**Contraintes:**
- Un user = une note par session (UNIQUE constraint)
- Cascade delete si session supprimée
- Privé: seul le owner peut lire/modifier

---

## 🔄 WORKFLOW UTILISATEUR

### Phase 1: Création de session

**Avant (actuel):**
```
Workspace → [Créer session] → Session démarre
```

**Après (avec objectif):**
```
Workspace → [Créer session]
  ↓
Modal: "Créer une session"
  • Objectif (optionnel): [Résoudre exercice 5]
  • [Annuler] [Créer]
  ↓
Session démarre avec objectif affiché en haut
```

---

### Phase 2: Pendant la session

**Utilisateur typique:**

1. **Arrivée dans session** (0-2 min)
   - Voit objectif en haut
   - Canvas + Résumé côte à côte
   - Rejoint Pusher presence channel

2. **Réflexion collaborative** (5-40 min)
   - Groupe dessine sur Canvas (schémas, calculs)
   - Discussion vocale (future: visio intégrée)
   - Quelqu'un efface Canvas quand plus de place

3. **Validation progressive** (pendant toute la session)
   - Dès qu'un point est clair → quelqu'un écrit dans Résumé
   - "✅ Résultat 5a) trouvé: [2,4; 1,3]"
   - Tous voient en temps réel (curseurs colorés)

4. **Notes personnelles** (5-10 min)
   - Pendant pause ou fin de session
   - Clic "Mes notes" → modal s'ouvre
   - Reformule pour soi, écrit questions perso
   - Ferme modal → retour Canvas+Résumé

5. **Auto-save continu**
   - Canvas: toutes les 30s → `tldrawState`
   - Résumé: toutes les 30s → `summaryContent` (Yjs sync)
   - Notes perso: toutes les 30s → `SessionNote.content`

---

### Phase 3: Fin de session

**Action: Clic "Terminer la session"**

**Comportement:**

1. **Sauvegarde finale** (automatique)
   - Canvas: dernier state tldraw JSON
   - Résumé: dernier state Yjs
   - Notes perso: dernier state (chaque user)

2. **Broadcast Pusher** (si pas auto-terminate)
   - Événement: `client-session-terminated`
   - Payload: `{ userId, sessionId }`
   - Tous les membres reçoivent notification

3. **Redirection**
   - Retour au workspace
   - Toast: "Session terminée avec succès"

**PAS de modal "Résumé final"** (le résumé est déjà écrit pendant la session)

**PAS de conversion Canvas en PNG** (gardé en JSON natif)

---

### Phase 4: Consultation post-session

**Dans workspace → Liste sessions:**

```
┌────────────────────────────────────────┐
│ Session #5 - Il y a 2 jours           │
│ 🎯 Résoudre exercice 5 sur matrices   │ ← objectif
│                                        │
│ Preview résumé:                        │
│ ✅ Exercice 5a) résolu: [2,4; 1,3]    │
│ ⚠️ Déterminant 3×3 encore flou...     │
│                                        │
│ Durée: 1h23 • 3 participants          │
│ [Voir détails]                         │
└────────────────────────────────────────┘
```

**Clic "Voir détails" → Page session (read-only):**

```
┌──────────────────────────────────────────────┐
│ Session #5 (terminée le 26/12 à 14h30)      │
│ 🎯 Objectif: Résoudre exercice 5            │
├─────────────────────┬────────────────────────┤
│                     │ 📝 RÉSUMÉ              │
│   CANVAS            │                        │
│   (lecture seule)   │ ✅ Compris             │
│                     │ • ...                  │
│   [Télécharger PNG] │                        │
│                     │ (lecture seule)        │
│                     │                        │
│                     │                        │
└─────────────────────┴────────────────────────┘
│ [Mes notes pour cette session] ← clic →     │
│ modal avec notes perso (éditable)           │
└──────────────────────────────────────────────┘
```

**Notes perso éditables APRÈS session** (seul cas d'édition post-mortem)

---

## 🚀 PLAN D'IMPLÉMENTATION

### Phase 4A - Fondations (priorité 1)

**Objectif:** Ajouter champ objectif + base résumé collaboratif

**Tasks:**

1. **Migration DB**
   - [ ] Ajouter colonne `objective` à `study_session`
   - [ ] Ajouter colonne `summaryContent` à `study_session`
   - [ ] Ajouter colonne `tldrawState` à `study_session`
   - [ ] Créer table `session_note`

2. **API Routes**
   - [ ] `PATCH /api/sessions/[id]` → update objective
   - [ ] `GET/POST /api/sessions/[id]/summary` → get/update summary
   - [ ] `GET/POST /api/sessions/[id]/notes` → get/update user's private notes

3. **Store + Hooks**
   - [ ] Ajouter `updateSessionObjective()`
   - [ ] Ajouter `fetchSummary()` / `saveSummary()`
   - [ ] Ajouter `fetchMyNotes()` / `saveMyNotes()`
   - [ ] Exposer via `useStudySession` hook

4. **UI - Modal création session**
   - [ ] Ajouter input "Objectif" (optionnel)
   - [ ] Sauvegarder dans DB à la création

5. **UI - Session page (layout split-screen)**
   - [ ] Refactor layout: Canvas 60% + Résumé 40%
   - [ ] Ajouter TipTap editor "Résumé collaboratif" (droite)
   - [ ] Sync résumé avec Yjs (comme CollaborativeEditor)
   - [ ] Template initial avec structure ✅ ⚠️ ❌ 🧩
   - [ ] Afficher objectif en header (éditable inline)

6. **UI - Bouton "Mes notes"**
   - [ ] Bouton top-right dans SessionPage
   - [ ] Modal/Dialog avec TipTap simple (pas collaboratif)
   - [ ] Badge "Privé - visible uniquement par vous"
   - [ ] Fetch/Save notes perso (API)

---

### Phase 4B - Polish (priorité 2)

7. **Canvas natif tldraw**
   - [ ] Sauvegarder `tldrawState` JSON (au lieu de PNG)
   - [ ] Load state au mount
   - [ ] Bouton "Effacer sélection" / "Tout effacer"

8. **Template résumé amélioré**
   - [ ] Ajouter extension Mathematics (@tiptap/extension-mathematics)
   - [ ] Support KaTeX pour équations LaTeX
   - [ ] Toolbar custom (boutons ✅ ⚠️ ❌ 🧩)

9. **Responsive mobile**
   - [ ] Tabs sur mobile (<1024px)
   - [ ] Indicateurs d'activité sur tabs
   - [ ] Notifications cross-tab

10. **Consultation post-session**
    - [ ] Preview résumé dans liste sessions
    - [ ] Page session read-only (si endedAt)
    - [ ] Bouton "Voir mes notes" (éditable post-session)

---

### Phase 4C - Optimisations (priorité 3)

11. **Performance**
    - [ ] Lazy load TipTap editors
    - [ ] Debounce auto-save (30s)
    - [ ] Optimistic updates

12. **UX améliorée**
    - [ ] Divider resizable entre Canvas/Résumé
    - [ ] Shortcuts clavier (Cmd+N pour "Mes notes")
    - [ ] Version history résumé (optionnel)

13. **Analytics**
    - [ ] Tracker temps passé par espace (Canvas vs Résumé vs Notes)
    - [ ] Nombre de caractères écrits dans résumé
    - [ ] Taux de complétion objectif

---

## 🎯 SUCCESS CRITERIA

**Phase 4 est réussie si:**

✅ **Objectif de session:**
- Visible en permanence pendant session
- Éditable inline
- Affiché dans liste sessions (workspace)

✅ **Résumé collaboratif:**
- Visible côte à côte avec Canvas (desktop)
- Édition temps réel avec curseurs colorés
- Template initial avec structure ✅ ⚠️ ❌ 🧩
- Support markdown + équations LaTeX
- Auto-save toutes les 30s
- Consultable après session (read-only)

✅ **Notes individuelles:**
- Modal/Dialog accessible via bouton
- Édition privée (pas de sync Yjs)
- Auto-save toutes les 30s
- Éditables APRÈS session terminée

✅ **Canvas:**
- Sauvegardé en JSON natif (pas PNG)
- Boutons effacer sélection / tout effacer

✅ **Layout:**
- Split-screen 60/40 sur desktop
- Tabs sur mobile avec indicateurs activité
- Pas de confusion "qui voit quoi"

---

## 📊 COMPARAISON AVANT/APRÈS

### AVANT (Phase 3B)

```
Session = Tabs séparés
├─ Canvas (tldraw)
├─ Éditeur collaboratif (TipTap + Yjs)
├─ Présence (avatars)
└─ Pas de structure résumé
    Pas de notes privées
    Pas d'objectif défini
```

**Problèmes:**
- Pas de résultat clair après session
- Confusion sur "qu'est-ce qu'on a compris?"
- Pas d'espace pour reformulation perso
- Canvas et éditeur séparés (switch constant)

---

### APRÈS (Phase 4)

```
Session = Espace structuré
├─ 🎯 Objectif (affiché en permanence)
├─ Canvas 60% + Résumé 40% (côte à côte)
│   ├─ Canvas: réflexion collaborative
│   └─ Résumé: résultat validé (✅ ⚠️ ❌ 🧩)
└─ Notes perso (modal, privé)
```

**Bénéfices:**
✅ Résultat clair et structuré après chaque session
✅ Test: "Si quelqu'un revient 3 jours après, il comprend?"
✅ Espace privé pour reformulation individuelle
✅ Canvas + Résumé visibles ensemble (aller-retour constant)
✅ Objectif rappelé en permanence (focus)

---

## 🔮 VISION LONG TERME

### Phase 5: Visio intégrée
- Floating video overlay ou sidebar
- Partage d'écran dans Canvas
- Enregistrement session (optionnel)

### Phase 6: AI Study Assistant
- Résumé auto-généré (GPT-4o-mini)
- Extraction TODO automatique
- Q&A sur historique workspace
- Flashcards depuis résumé

### Phase 7: Export & Partage
- Export PDF complet (objectif + résumé + canvas PNG)
- Partage session publique (lien read-only)
- Intégration Notion/Drive

---

## 📝 NOTES IMPORTANTES

### Décisions actées:

1. **Résumé = contenu libre avec structure suggérée** (pas rigide)
2. **Canvas sauvegardé en JSON tldraw** (pas PNG snapshot)
3. **Layout split-screen sur desktop** (pas tabs)
4. **Notes perso = modal/sidebar** (pas tab)
5. **Pas de modal "résumé final"** (écrit pendant session)
6. **Pas de rôle "facilitateur"** (responsabilité collective via visibilité curseurs)

### Principes fondamentaux:

> **Une session = unité de travail qui transforme une question floue en résultat clair.**

> **Le résumé s'écrit PENDANT la session, pas après.**

> **Canvas (réflexion) + Résumé (validation) = visibles en même temps.**

> **Notes perso = espace de compréhension individuelle (invisible aux autres).**

---

## 🚨 BLOCKERS POTENTIELS

1. **Performance Yjs avec 2 editors** (CollaborativeEditor + SummaryEditor)
   - Solution: Utiliser 2 Y.Docs séparés ou sub-documents

2. **Sync tldraw avec DB** (format JSON volumineux)
   - Solution: Compression gzip + lazy load

3. **Confusion utilisateur Canvas vs Résumé**
   - Solution: Labels clairs + onboarding

4. **Mobile layout complexe**
   - Solution: Tabs simples + indicateurs activité

---

## ✅ NEXT STEPS

1. **Créer ce fichier** (.claude/PHASE-4-SESSION-STRUCTURE.md) ✅
2. **Review avec user** (valider vision globale)
3. **Commencer Phase 4A** (migrations DB + API)
4. **Itérer sur UI** (split-screen layout)
5. **Test avec early adopters** (feedback)

---

**Dernière mise à jour:** 2025-12-28
**Auteur:** Claude Sonnet 4.5 + Isaac (StudySpace)
**Statut:** DRAFT - En attente validation
