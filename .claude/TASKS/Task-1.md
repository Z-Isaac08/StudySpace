# Task 1 : Setup & Optimisation MVP Phase 3A

**Statut** : 🔜 À faire
**Priorité** : Haute
**Estimation** : 1-2 jours
**Phase** : Post-MVP Cleanup

---

## Objectif

Nettoyer le code MVP Phase 3A, optimiser les performances, et préparer le déploiement en production.

---

## Sous-tâches

### 1.1 Code Cleanup

- [ ] **Retirer la variable `sessions` unused** dans `app/(dashboard)/dashboard/workspace/[id]/page.tsx` ligne 92
  - Variable non utilisée car la page utilise `workspace.sessions` de l'API
  - Optionnel : Retirer aussi `fetchSessions` si non nécessaire

- [ ] **Vérifier tous les imports unused** avec ESLint
  ```bash
  npm run lint
  ```

- [ ] **Nettoyer les console.log** de debug dans le code
  - Chercher : `console.log`, `console.warn` (garder `console.error`)
  - Remplacer par un logger si nécessaire (future)

### 1.2 Performance Optimizations

- [ ] **Optimiser les images** de la landing page
  - Convertir en WebP si nécessaire
  - Ajouter `priority` aux images above-the-fold
  - Vérifier tailles avec `next/image`

- [ ] **Vérifier bundle size**
  ```bash
  npm run build
  # Analyser output .next/
  ```

- [ ] **Lazy load composants lourds**
  - Canvas component (session page)
  - Framer Motion animations (si impact)
  ```typescript
  const Canvas = dynamic(() => import('./Canvas'), { ssr: false });
  ```

### 1.3 SEO & Meta Tags

- [ ] **Ajouter metadata à toutes les pages**
  ```typescript
  // app/(dashboard)/dashboard/page.tsx
  export const metadata = {
    title: 'Dashboard | StudySpace',
    description: 'Gérez vos espaces de travail collaboratifs'
  };
  ```

- [ ] **Vérifier robots.txt et sitemap.xml**
  - Créer `public/robots.txt`
  - Générer sitemap automatique (Next.js 16)

- [ ] **Ajouter Open Graph images**
  - OG image pour landing page
  - OG image par défaut pour autres pages

### 1.4 Accessibility (WCAG 2.1 AA)

- [ ] **Audit avec Lighthouse**
  - Chrome DevTools → Lighthouse
  - Fixer les issues d'accessibilité

- [ ] **Tester navigation au clavier**
  - Tab order correct
  - Focus visible sur tous les éléments interactifs

- [ ] **Ajouter aria-labels manquants**
  - Canvas : `aria-label="Tableau blanc collaboratif"`
  - Boutons icon-only : `aria-label="..."`

### 1.5 Tests utilisateurs (Beta privée)

- [ ] **Recruter 5-10 early adopters**
  - Étudiants universitaires français
  - Profils variés (maths, langues, sciences)

- [ ] **Créer formulaire de feedback**
  - Google Forms ou Tally
  - Questions : UX, bugs, features manquantes

- [ ] **Sessions d'observation**
  - 3-5 utilisateurs observés (screen share)
  - Noter frictions, confusions

- [ ] **Itérer sur feedback**
  - Prioriser bugs critiques
  - Quick wins UX (< 2h de dev)

---

## Critères d'acceptation

- ✅ 0 warnings ESLint
- ✅ Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- ✅ Aucun console.log en production
- ✅ Bundle size < 300 KB (JavaScript initial)
- ✅ Metadata complètes sur toutes les pages
- ✅ Navigation au clavier fonctionnelle
- ✅ Feedbacks de 5+ utilisateurs collectés

---

## Notes techniques

**Lighthouse audit** :
```bash
# Dev
npm run build && npm run start
# Open Chrome → DevTools → Lighthouse
```

**Bundle analyzer** (optionnel) :
```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Dynamic imports example** :
```typescript
import dynamic from 'next/dynamic';

const SessionCanvas = dynamic(() => import('@/components/SessionCanvas'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />
});
```

---

## Dépendances

- Aucune (tâche indépendante)

---

## Risques

- **Beta testers non disponibles** : Poster sur Discord/Reddit étudiants
- **Lighthouse score faible** : Prioriser Performance et Accessibility
- **Bugs critiques découverts** : Créer hotfix branch immédiatement
