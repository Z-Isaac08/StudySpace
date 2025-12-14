# Guide de Correction WCAG 2.2 - StudySpace

## ✅ Déjà Corrigé (Commit f678d84)

- [x] Messages d'erreur avec `role="alert"` et `aria-live="assertive"`
- [x] Messages de succès avec `role="status"` et `aria-live="polite"`
- [x] Bouton de visibilité du mot de passe avec `aria-label` et `aria-pressed`
- [x] Icônes décoratives marquées avec `aria-hidden="true"`
- [x] Focus indicators améliorés avec `focus-visible:ring-2`

---

## 🔴 CRITIQUES - À Implémenter Immédiatement

### 1. Skip-to-Main-Content Link (WCAG 2.4.1)

**Fichier**: `app/(dashboard)/layout.tsx`

**Ajouter avant le contenu** :
```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip link - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
      >
        Aller au contenu principal
      </a>

      <Sidebar onLogout={handleLogout} />

      <div className="pl-64">
        <Header user={user} onLogout={handleLogout} />

        {/* Main content with ID */}
        <main id="main-content" className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Aussi à ajouter dans** :
- `app/page.tsx` (landing page)
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`

---

### 2. Fix Register Page (comme Login)

**Fichier**: `app/(auth)/register/page.tsx`

Appliquer les mêmes correctifs que login.tsx :

```typescript
{/* Success Alert */}
{success && (
  <MotionDiv
    role="status"
    aria-live="polite"
    // ... rest
  >

{/* Error Alert */}
{error && (
  <MotionDiv
    role="alert"
    aria-live="assertive"
    // ... rest
  >

{/* Password Toggle Buttons */}
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
  aria-pressed={showPassword}
  className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
>
  {showPassword ? (
    <EyeOff className="h-5 w-5" aria-hidden="true" />
  ) : (
    <Eye className="h-5 w-5" aria-hidden="true" />
  )}
</button>

{/* Confirm Password Toggle - même chose */}
```

---

### 3. Annoncer les États de Chargement

**Fichier**: `app/(dashboard)/dashboard/page.tsx`

```typescript
{workspacesLoading ? (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    className="grid gap-4 md:grid-cols-3"
  >
    <span className="sr-only">Chargement des workspaces en cours...</span>
    {[1, 2, 3].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 w-24 rounded bg-muted"></div>
          <div className="mt-4 h-3 w-32 rounded bg-muted"></div>
        </CardContent>
      </Card>
    ))}
  </div>
) : (
  // ... rest
)}
```

**Aussi dans** :
- `app/(dashboard)/dashboard/workspaces/page.tsx` (lignes 273-278)

---

### 4. Fix Dialog Join Workspace

**Fichier**: `app/(dashboard)/dashboard/workspaces/page.tsx` (lignes 216-219)

```typescript
{joinError && (
  <p role="alert" aria-live="polite" className="text-sm text-error-500">
    {joinError}
  </p>
)}
```

---

### 5. Table de Comparaison - Icônes Accessibles

**Fichier**: `app/page.tsx` (lignes 429-442)

```typescript
<td className="p-4 text-center">
  {row.discord ? (
    <>
      <Check className="h-5 w-5 text-success-500 mx-auto" aria-hidden="true" />
      <span className="sr-only">Oui</span>
    </>
  ) : (
    <>
      <X className="h-5 w-5 text-error-500 mx-auto" aria-hidden="true" />
      <span className="sr-only">Non</span>
    </>
  )}
</td>
```

Répéter pour toutes les colonnes : `discord`, `realTime`, `screenshare`, `voice`.

---

## 🟠 HAUTE PRIORITÉ

### 6. Améliorer Focus des Liens

**Fichier**: `app/page.tsx` (footer et navigation)

Ajouter à **TOUS les liens** :

```typescript
<Link
  href="/features"
  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded"
>
  Fonctionnalités
</Link>
```

**Liens à corriger** :
- Footer (lignes 635-665)
- Navigation principale
- Liens dans les cartes de workspace

---

### 7. Icônes Décoratives - aria-hidden

**Fichiers multiples**

Ajouter `aria-hidden="true"` à toutes les icônes décoratives :

```typescript
// ❌ AVANT
<FolderKanban className="h-4 w-4 text-primary" />

// ✅ APRÈS
<FolderKanban className="h-4 w-4 text-primary" aria-hidden="true" />
```

**Fichiers concernés** :
- `app/(dashboard)/dashboard/page.tsx` (lignes 77, 97, 117, 155, 172, 188)
- `components/workspace/WorkspaceCard.tsx` (lignes 136, 151, 155, 172, 192)
- `app/page.tsx` (blobs décoratifs lignes 52-58)

---

### 8. Améliorer Boutons de Pagination

**Fichier**: `app/(dashboard)/dashboard/workspaces/page.tsx`

```typescript
<Button
  variant="outline"
  size="sm"
  onClick={handlePreviousPage}
  disabled={!pagination.hasPreviousPage}
  aria-label="Page précédente"
  aria-disabled={!pagination.hasPreviousPage}
>
  Précédent
</Button>

<Button
  variant="outline"
  size="sm"
  onClick={handleNextPage}
  disabled={!pagination.hasNextPage}
  aria-label="Page suivante"
  aria-disabled={!pagination.hasNextPage}
>
  Suivant
</Button>
```

---

## 🟡 MOYENNE PRIORITÉ

### 9. Améliorer Empty States

**Fichiers**: `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/dashboard/workspaces/page.tsx`

```typescript
<div
  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted"
  aria-hidden="true"
>
  <FolderKanban className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
</div>
```

---

### 10. Headers Sémantiques

Vérifier la hiérarchie des titres :

```typescript
// ✅ BON
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Sub-section</h3>

// ❌ MAUVAIS (éviter de sauter des niveaux)
<h1>Page Title</h1>
<h3>Section</h3> {/* Devrait être h2 */}
```

---

### 11. Bouton Copy Invite Code

**Fichier**: `components/workspace/WorkspaceCard.tsx` (lignes 165-176)

```typescript
<Button
  type="button"
  variant="ghost"
  size="sm"
  className={cn(
    "gap-2 text-xs text-muted-foreground transition-all duration-200",
    copied && "text-success-500"
  )}
  onClick={handleCopyInviteCode}
  aria-label="Copier le code d'invitation"
  aria-pressed={copied}
>
  <Copy
    className={cn("h-3 w-3 transition-transform duration-200", copied && "scale-125")}
    aria-hidden="true"
  />
  {copied ? "Copié !" : inviteCode}
</Button>
```

---

## 🟢 BASSE PRIORITÉ (Mais Recommandé)

### 12. Améliorer Not Found Page

**Fichier**: `app/not-found.tsx`

```typescript
<h1 className="mt-6 text-3xl font-bold..." role="alert">
  Erreur 404 : Page introuvable
</h1>
```

---

### 13. Ajouter sr-only Class Utility

**Fichier**: `app/globals.css`

Vérifier que cette classe existe :

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 📊 Testing Checklist

### Tests Manuels :

- [ ] Navigation complète au clavier (Tab, Shift+Tab, Enter, Espace)
- [ ] Skip link fonctionne (Tab dès le chargement de la page)
- [ ] Messages d'erreur annoncés au screen reader
- [ ] États de chargement annoncés
- [ ] Tous les boutons ont des labels clairs
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Icônes décoratives ignorées par screen reader

### Outils Automatisés :

```bash
# Installer axe-core
npm install --save-dev @axe-core/react

# Dans votre code (development only)
import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

### Extensions Navigateur :

1. **axe DevTools** (Chrome/Firefox)
2. **WAVE** (WebAIM)
3. **Lighthouse** (Chrome DevTools > Lighthouse > Accessibility)

### Screen Readers :

- **Windows** : NVDA (gratuit) ou JAWS
- **macOS** : VoiceOver (Cmd + F5)
- **Linux** : Orca

---

## 📝 Checklist Globale

### Critiques (Faire d'abord) :
- [x] Messages d'erreur avec role="alert"
- [x] Messages de succès avec role="status"
- [x] Boutons password toggle accessibles
- [ ] Skip-to-main-content sur toutes les pages
- [ ] Annonces de chargement
- [ ] Fix dialog errors
- [ ] Fix table comparison icons

### Haute Priorité :
- [ ] Focus indicators sur tous les liens
- [ ] aria-hidden sur icônes décoratives
- [ ] Améliorer boutons pagination
- [ ] Fix register page (comme login)

### Moyenne Priorité :
- [ ] Empty states sémantiques
- [ ] Hiérarchie headers
- [ ] Bouton copy accessible

### Basse Priorité :
- [ ] Not found page role="alert"
- [ ] Tests automatisés
- [ ] Audit de contraste de couleurs

---

## 🎯 Impact Attendu

Après toutes les corrections :

- **WCAG 2.2 Level AA** : ~95% conforme
- **Screen Reader** : Navigation fluide et complète
- **Keyboard Only** : 100% accessible
- **Color Contrast** : À auditer avec outil (peut nécessiter ajustements de couleurs)

---

## 📚 Ressources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

**Dernière mise à jour** : Commit f678d84
**Status** : 20% complété (4/20 issues corrigées)
