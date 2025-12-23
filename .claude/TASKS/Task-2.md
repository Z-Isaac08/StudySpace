# Task 2 : Déploiement Production (MVP Phase 3A)

**Statut** : 🔜 À faire
**Priorité** : Haute
**Estimation** : 1 jour
**Phase** : Production Deployment

---

## Objectif

Déployer le MVP Phase 3A en production sur Vercel avec configuration complète (database, auth, monitoring).

---

## Sous-tâches

### 2.1 Préparation Vercel

- [ ] **Créer compte Vercel** (si pas déjà fait)
  - Connecter GitHub account
  - Importer repo StudySpace

- [ ] **Configurer environment variables**
  - Vercel Dashboard → Project Settings → Environment Variables
  - Ajouter toutes les variables de `.env.local` :
    ```
    DATABASE_URL
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    NEXT_PUBLIC_APP_URL (https://studyspace-xxx.vercel.app)
    ```

- [ ] **Configurer build settings**
  - Build Command : `npm run build` (défaut)
  - Output Directory : `.next` (défaut)
  - Install Command : `npm install` (défaut)
  - Node Version : 20.x

### 2.2 Database Production

- [ ] **Vérifier Supabase Production DB**
  - Utiliser le même projet Supabase (ou créer projet prod séparé)
  - DATABASE_URL pointe vers production

- [ ] **Run migrations en production**
  ```bash
  npx prisma migrate deploy
  ```
  - Ou via Vercel build : ajouter dans `package.json` :
    ```json
    {
      "scripts": {
        "vercel-build": "prisma migrate deploy && next build"
      }
    }
    ```

- [ ] **Vérifier Row Level Security (RLS)**
  - Supabase Dashboard → Authentication → Policies
  - Tester avec utilisateur de test

- [ ] **Setup database backups**
  - Supabase : Backups automatiques (gratuit)
  - Vérifier fréquence dans dashboard

### 2.3 Domaine & SSL

- [ ] **Acheter domaine** (optionnel - MVP peut utiliser vercel.app)
  - Recommandé : `studyspace.app` ou `studyspace.fr`
  - Registrars : Namecheap, OVH, Gandi

- [ ] **Configurer DNS** (si domaine custom)
  - Vercel Dashboard → Domains → Add Domain
  - Ajouter A/CNAME records chez registrar
  - Attendre propagation DNS (24-48h max)

- [ ] **Vérifier SSL**
  - Vercel configure SSL automatiquement (Let's Encrypt)
  - Tester avec : https://www.ssllabs.com/ssltest/

### 2.4 Monitoring & Analytics

- [ ] **Activer Vercel Analytics**
  - Vercel Dashboard → Analytics → Enable
  - Gratuit : Web Vitals, Page Views

- [ ] **Setup Sentry** (error tracking)
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
  - Ajouter SENTRY_DSN dans env variables
  - Tester en triggering une erreur

- [ ] **Setup Plausible Analytics** (privacy-friendly)
  - Alternative : Google Analytics (si RGPD OK)
  - Script dans `app/layout.tsx`

- [ ] **Setup UptimeRobot**
  - Monitor : https://studyspace.vercel.app
  - Alert email si downtime > 5 min

### 2.5 Post-deployment Tests

- [ ] **Smoke tests**
  - ✅ Landing page charge
  - ✅ Inscription fonctionne + email reçu
  - ✅ Login fonctionne
  - ✅ Création workspace
  - ✅ Création session
  - ✅ Canvas drawing fonctionne
  - ✅ Auto-save fonctionne (attendre 30s)
  - ✅ End session calcule durée

- [ ] **Tester sur mobile**
  - iPhone Safari
  - Android Chrome
  - Responsive design OK

- [ ] **Vérifier logs Vercel**
  - Vercel Dashboard → Deployments → Latest → Logs
  - Aucune erreur 500

### 2.6 Documentation déploiement

- [ ] **Créer DEPLOYMENT.md**
  - Instructions pour redéployer
  - Rollback procedure
  - Environment variables list
  - Troubleshooting commun

- [ ] **Documenter monitoring**
  - Dashboard URLs (Vercel, Sentry, UptimeRobot)
  - Credentials (1Password ou autre)

---

## Critères d'acceptation

- ✅ App déployée sur Vercel (ou custom domain)
- ✅ HTTPS activé avec certificat valide
- ✅ Database migrations appliquées en prod
- ✅ Toutes les fonctionnalités testées et fonctionnelles
- ✅ Monitoring activé (Vercel Analytics + Sentry + UptimeRobot)
- ✅ Aucune erreur dans logs Vercel
- ✅ Lighthouse score prod > 90
- ✅ Documentation déploiement complète

---

## Commandes utiles

**Deploy manuel** (si pas auto-deploy) :
```bash
vercel --prod
```

**Run migrations prod** :
```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**Check build locally** :
```bash
npm run build
npm run start
# Test sur http://localhost:3000
```

**Vercel CLI** :
```bash
npm install -g vercel
vercel login
vercel env pull  # Download env variables
```

---

## Configuration Vercel recommandée

**vercel.json** (optionnel) :
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**package.json build script** :
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## Dépendances

- ✅ Task 1 terminé (code cleanup & optimizations)

---

## Risques

- **Migrations échouent en prod** : Backup DB avant migration, rollback si erreur
- **Environment variables manquantes** : Checklist complète avant deploy
- **SSL certificate delay** : Utiliser vercel.app temporairement
- **Database connection limite** : Upgrade Supabase plan si nécessaire (gratuit = 500 connections)

---

## Notes

**Free tiers limits (Vercel + Supabase)** :
- Vercel : 100 GB bandwidth/mois, fonction execution illimité
- Supabase : 500 MB database, 1 GB file storage, 2 GB bandwidth

**Monitoring dashboard access** :
- Vercel : https://vercel.com/dashboard
- Sentry : https://sentry.io
- UptimeRobot : https://uptimerobot.com
