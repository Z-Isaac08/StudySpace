# TASK-0: Fixes Critiques UX & Temps Réel (PRIORITÉ ABSOLUE)

**Status**: 🔴 EN COURS
**Créé le**: 2025-12-27
**Priorité**: CRITIQUE - À faire AVANT tout autre développement

---

## 🎯 Objectifs

Corriger les bugs critiques d'UX et de synchronisation temps réel identifiés lors des tests.

---

## 🐛 Problèmes Identifiés

### 1. ❌ Synchronisation temps réel ne fonctionne pas
**Symptôme**: Écrire dans navigateur 1 n'apparaît pas dans navigateur 2

**Logs du problème**:
```
Navigateur 1 (envoie): "Event sent" client-yjs-update ✅
Navigateur 2 (reçoit): "Event recd" client-yjs-update ✅
Navigateur 2 (erreur): "No callbacks on presence-session-xxx for client-yjs-update" ❌
```

**Cause**: Le navigateur 2 reçoit les événements Pusher mais n'a pas de listener enregistré pour `client-yjs-update`.

**Raison probable**:
- L'éditeur ne monte que quand on clique sur l'onglet "Éditeur"
- Les listeners Pusher sont dans `CollaborativeEditor` (s'enregistrent trop tard)
- Race condition : channel souscrit avant que les listeners soient prêts

**Solution**: Déplacer la connexion Pusher au niveau `SessionPage` (dès l'ouverture de la session, pas juste dans l'éditeur).

---

### 2. ⏱️ Auto-save trop fréquent

**Actuel**:
- Éditeur HTML: **5 secondes** → Trop fréquent, surcharge DB
- Yjs state: **10 secondes** → Peut être allongé
- Canvas: **60 secondes** ✅ OK

**Recommandé**:
- Éditeur HTML: **20-30 secondes**
- Yjs state: **30 secondes**
- Canvas: **60 secondes** (garder)

**Impact**: Réduit les requêtes DB de ~80% sans affecter l'UX.

---

### 3. 💾 Indicateur "Sauvegardé à XX:XX" ne se met pas à jour

**Symptôme**: L'heure affichée reste figée malgré les auto-saves.

**Cause**:
- `lastEditorSaveTime` mis à jour uniquement dans `onSave` du `CollaborativeEditor`
- Mais l'auto-save interne (toutes les 5s) ne remonte pas l'info au parent
- Seule la sauvegarde HTML via `onSave` met à jour l'heure

**Solution**:
- Option A: Afficher deux indicateurs séparés (Canvas + Éditeur)
- Option B: Callback dans auto-save Yjs pour remonter l'info
- Option C: Supprimer l'indicateur temps (pas essentiel)

---

### 4. 🏷️ Session active pas mise en évidence

**Symptôme**: On n'est obligé d'aller dans l'onglet session avant de voir la session active un mieux serait de le signifier quand un user rentre dans le workspace et qu'une session est en cours



---

### 5. 🗑️ Suppression de session → Tab reset

**Symptôme**:
1. User est sur l'onglet "Sessions" du workspace
2. User supprime une session
3. Chargement s'affiche
4. Après le chargement, l'onglet actif bascule vers "Membres"

**Cause**: `fetchWorkspace()` recharge toutes les données et reset l'état UI.

**Solution**: Optimistic update
```ts
// Au lieu de
await deleteSession(id);
await fetchWorkspace(); // ❌ Recharge tout

// Faire
await deleteSession(id);
setStudySessions(prev => prev.filter(s => s.id !== id)); // ✅ Update local
```

---

### 6. 🔗 Système d'invitation non fonctionnel

**À vérifier**:
- [ ] Le code d'invitation s'affiche-t-il correctement ?
- [ ] Le lien d'invitation peut-il être copié ?
- [ ] Peut-on rejoindre un workspace avec le code ?
- [ ] L'API `/api/workspaces/join` fonctionne-t-elle ?

**Action**: Tester manuellement puis créer ticket séparé si besoin.

---

### 7. 🎭 Logique de session unique active

**Question design**: Peut-on créer une session pendant qu'une autre est en cours ?

**Options**:
- **A** (Actuel): Plusieurs sessions simultanées autorisées
- **B**: Une seule session active à la fois (bloquer création)
- **C**: Demander confirmation "Session en cours, voulez-vous la terminer ?"

**Décision attendue**: À discuter avec l'utilisateur.

---

### 8. 🚪 Quitter vs Terminer une session

**Actuellement**:
- Seul bouton "Terminer" (met `endedAt`)
- Fermer l'onglet ne fait rien (session reste ouverte)

**Problème**:
- Sessions zombies (ouvertes mais personne dedans)
- Pas de distinction entre "pause" et "fin définitive"

**Solution proposée**:
- **Quitter** (naviguer ailleurs) → Session reste ouverte, peut y revenir
- **Terminer** → Session fermée définitivement (`endedAt`)
- **Auto-terminer** sessions ouvertes depuis >24h (cron job)

---

### 9. 🌐 Temps réel pour TOUTE la session, pas juste l'éditeur

**Problème actuel**:
```
SessionPage
  └─ TabsContent "editor"
      └─ CollaborativeEditor
          └─ Pusher se connecte ICI ❌
```

**Problème**:
- Pusher ne se connecte que si on ouvre l'onglet Éditeur
- Canvas n'a pas de temps réel
- Presence ne fonctionne que dans l'éditeur

**Solution idéale**:
```
SessionPage (se connecte à Pusher dès le mount) ✅
  ├─ Presence globale (qui est dans la session)
  ├─ TabsContent "whiteboard"
  │   └─ Canvas (écoute events canvas)
  └─ TabsContent "editor"
      └─ CollaborativeEditor (écoute events yjs)
```

**Bénéfices**:
- Voir qui est dans la session AVANT d'ouvrir l'éditeur
- Possibilité de sync le canvas en temps réel
- Architecture plus propre (1 connexion Pusher par session)

---

## 📋 Plan d'Implémentation

### Phase 1: Fixer le temps réel (CRITIQUE)
1. ✅ Activer "Client Events" dans Pusher Dashboard (FAIT)
2. 🔄 Déplacer connexion Pusher de `CollaborativeEditor` vers `SessionPage`
3. 🔄 Passer le channel Pusher en props à `CollaborativeEditor`
4. 🔄 Tester sync entre 2 navigateurs
5. 🔄 Ajouter logs de debug pour valider

### Phase 2: Optimiser auto-save
1. Modifier intervals dans `CollaborativeEditor`:
   - HTML content: 5s → 30s
   - Yjs state: 10s → 30s
2. Garder canvas à 60s

### Phase 3: Améliorer UX Session
1. Badge "En cours" sur session active
2. Fix tab reset après suppression (optimistic update)
3. Mettre à jour indicateur de sauvegarde (ou le supprimer)

### Phase 4: Fonctionnalités avancées (si temps)
1. Tester système d'invitation
2. Implémenter logique session unique (selon décision)
3. Distinction Quitter/Terminer

---

## 🎯 Critères de Succès

### Must-Have (Phase 1)
- [x] Client events activés dans Pusher
- [ ] Écrire dans navigateur 1 apparaît en temps réel dans navigateur 2
- [ ] Presence indicators affichent les 2 utilisateurs
- [ ] Aucun log "No callbacks on..." dans la console

### Should-Have (Phase 2-3)
- [ ] Auto-save réduit à 30s (editor + yjs)
- [ ] Badge "En cours" visible sur session active
- [ ] Suppression de session ne change pas d'onglet

### Nice-to-Have (Phase 4)
- [ ] Système d'invitation fonctionnel
- [ ] Gestion propre des sessions multiples

---

## 🔧 Fichiers à Modifier

### Phase 1 (Temps réel)
- `app/(dashboard)/dashboard/session/[id]/page.tsx` - Ajouter connexion Pusher
- `components/editor/CollaborativeEditor.tsx` - Recevoir channel en props
- `lib/hooks/use-session-presence.ts` - Nouveau hook (optionnel)

### Phase 2 (Auto-save)
- `components/editor/CollaborativeEditor.tsx` - Modifier intervals

### Phase 3 (UX)
- `app/(dashboard)/dashboard/workspace/[id]/page.tsx` - Badge session active
- `lib/hooks/use-study-session.ts` - Optimistic update suppression

---

## 📊 Tests de Validation

### Test 1: Synchronisation temps réel
1. Ouvrir session dans Chrome
2. Ouvrir MÊME session dans Firefox
3. Écrire "Test sync" dans Chrome
4. ✅ "Test sync" apparaît dans Firefox dans <1 seconde
5. ✅ Les 2 navigateurs affichent "2 online"

### Test 2: Auto-save optimisé
1. Écrire du texte
2. Attendre 30 secondes
3. ✅ Console log "💾 Saved Yjs state to database"
4. ✅ Pas de spam de logs toutes les 5s

### Test 3: Session active visible
1. Créer session "Session A"
2. Ouvrir "Session A"
3. Retourner à la page workspace
4. ✅ Badge "En cours" sur "Session A"
5. ✅ Bordure colorée sur la carte

---

## ⚠️ Notes Importantes

- **Client Events Pusher**: Activés le 27/12/2025 ✅
- **Credentials Pusher**: App ID `2095441`, Cluster `eu`
- **Channel pattern**: `presence-session-{sessionId}`
- **Event names**: `client-yjs-update` (client → client via Pusher)

---

## 🚀 Prochaines Étapes

1. Commencer par Phase 1 (temps réel) - CRITIQUE
2. Valider avec test 2 navigateurs
3. Passer aux optimisations UX (Phase 2-3)
4. Repasser en revue avec l'utilisateur

---

**Dernière mise à jour**: 2025-12-27 22:00
