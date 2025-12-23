# Task 7 : Fonctionnalités Avancées (Phase 5)

**Statut** : 🔜 À faire
**Priorité** : Basse
**Estimation** : 3-4 semaines
**Phase** : Phase 5 - Features avancées

---

## Objectif

Ajouter des fonctionnalités secondaires pour améliorer l'expérience utilisateur : chat intégré, notifications, analytics d'étude, mode sombre.

---

## Sous-tâches

### 7.1 Chat intégré

- [ ] **Créer modèle Message** dans Prisma
  ```prisma
  model Message {
    id          String   @id @default(uuid())
    workspaceId String
    userId      String
    content     String   @db.Text
    createdAt   DateTime @default(now())

    workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
    user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([workspaceId])
    @@index([createdAt])
    @@map("messages")
  }
  ```

- [ ] **API routes messages**
  - `GET /api/workspaces/[id]/messages` - List messages
  - `POST /api/workspaces/[id]/messages` - Send message

- [ ] **WebSocket pour real-time chat**
  ```typescript
  // Pusher channel
  const channel = pusher.subscribe(`workspace-${workspaceId}-chat`);

  channel.bind('new-message', (message) => {
    setMessages(prev => [...prev, message]);
  });

  // Send message
  const sendMessage = async (content: string) => {
    await axios.post(`/api/workspaces/${workspaceId}/messages`, { content });
    // Pusher trigger in API route
  };
  ```

- [ ] **Chat UI component**
  - Liste messages (scrollable)
  - Input + Send button
  - Timestamp + author name
  - Support markdown (optionnel)

- [ ] **Intégrer dans SessionPage**
  - Sidebar chat (draggable/resizable)
  - Toggle show/hide

### 7.2 Notifications

- [ ] **Créer modèle Notification**
  ```prisma
  model Notification {
    id        String   @id @default(uuid())
    userId    String
    type      NotificationType
    title     String
    message   String?
    read      Boolean  @default(false)
    data      Json?    // Extra data (workspaceId, sessionId, etc.)
    createdAt DateTime @default(now())

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId, read])
    @@map("notifications")
  }

  enum NotificationType {
    NEW_SESSION
    WORKSPACE_INVITE
    MESSAGE_MENTION
    FILE_UPLOADED
  }
  ```

- [ ] **API routes notifications**
  - `GET /api/notifications` - List user notifications
  - `PUT /api/notifications/[id]/read` - Mark as read
  - `PUT /api/notifications/mark-all-read` - Mark all as read

- [ ] **Notification center UI**
  - Bell icon in header (badge with count)
  - Dropdown avec liste notifications
  - Clic → redirect to relevant page

- [ ] **Push notifications** (optionnel)
  - Email notifications (Resend ou SendGrid)
  - Browser push (Service Worker)

### 7.3 Analytics d'étude

- [ ] **Dashboard analytics page** (`/dashboard/analytics`)
  - Graphique temps d'étude par jour/semaine/mois
  - Temps total par matière (workspace tags)
  - Sessions les plus longues
  - Workspaces les plus actifs

- [ ] **Créer API analytics**
  ```typescript
  // GET /api/analytics/study-time
  const sessions = await prisma.session.findMany({
    where: {
      createdById: userId,
      endedAt: { not: null },
    },
    select: {
      duration: true,
      startedAt: true,
      workspace: {
        select: { tag: true },
      },
    },
  });

  // Aggregate by day, tag, etc.
  const byDay = sessions.reduce((acc, session) => {
    const day = session.startedAt.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + (session.duration || 0);
    return acc;
  }, {});

  return successResponse({ byDay, byTag, total });
  ```

- [ ] **Charts avec Recharts**
  ```bash
  npm install recharts
  ```

  ```typescript
  import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

  <LineChart data={studyTimeData} width={600} height={300}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="minutes" stroke="#8884d8" />
  </LineChart>
  ```

- [ ] **Export CSV**
  - Bouton "Exporter les données"
  - Générer CSV avec sessions, durée, dates
  - Download automatique

### 7.4 Mode sombre

- [ ] **Setup Tailwind dark mode**
  ```javascript
  // tailwind.config.ts
  module.exports = {
    darkMode: 'class', // or 'media'
    // ...
  };
  ```

- [ ] **Créer ThemeProvider** (`components/ThemeProvider.tsx`)
  ```typescript
  'use client';
  import { createContext, useContext, useState, useEffect } from 'react';

  type Theme = 'light' | 'dark' | 'system';

  const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
  }>({ theme: 'system', setTheme: () => {} });

  export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored) setTheme(stored);
    }, []);

    useEffect(() => {
      localStorage.setItem('theme', theme);

      const root = document.documentElement;
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }, [theme]);

    return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  export const useTheme = () => useContext(ThemeContext);
  ```

- [ ] **Theme toggle button**
  ```typescript
  import { MoonIcon, SunIcon } from 'lucide-react';
  import { useTheme } from '@/components/ThemeProvider';

  export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
    );
  }
  ```

- [ ] **Ajouter classes dark: dans composants**
  ```typescript
  <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
    ...
  </div>
  ```

- [ ] **Mettre à jour CSS variables** (`app/globals.css`)
  ```css
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    /* ... */
  }
  ```

### 7.5 Profil utilisateur

- [ ] **Page profil** (`/dashboard/profile`)
  - Affichage infos : nom, email, avatar
  - Formulaire édition : nom, avatar
  - Changement de mot de passe

- [ ] **Upload avatar** (Supabase Storage)
  - Bucket `avatars`
  - Update User.avatar avec URL

- [ ] **API routes profil**
  - `GET /api/profile` - Get user profile
  - `PUT /api/profile` - Update profile
  - `PUT /api/profile/password` - Change password

### 7.6 Recherche globale

- [ ] **Search bar dans header**
  - Input avec icône loupe
  - Autocomplete results

- [ ] **API search endpoint**
  ```typescript
  // GET /api/search?q=...
  const query = searchParams.get('q');

  const [workspaces, sessions, files] = await Promise.all([
    prisma.workspace.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        members: { some: { userId: user.id } },
      },
      take: 5,
    }),
    prisma.session.findMany({
      where: {
        workspace: { members: { some: { userId: user.id } } },
        title: { contains: query, mode: 'insensitive' },
      },
      take: 5,
    }),
    prisma.file.findMany({
      where: {
        workspace: { members: { some: { userId: user.id } } },
        name: { contains: query, mode: 'insensitive' },
      },
      take: 5,
    }),
  ]);

  return successResponse({ workspaces, sessions, files });
  ```

- [ ] **Search results dropdown**
  - Catégories : Workspaces, Sessions, Fichiers
  - Clic → redirect to item

### 7.7 Onboarding

- [ ] **Tour guidé** pour nouveaux utilisateurs
  - Librairie : `react-joyride`
  ```bash
  npm install react-joyride
  ```

  ```typescript
  import Joyride from 'react-joyride';

  const steps = [
    {
      target: '.create-workspace-btn',
      content: 'Cliquez ici pour créer votre premier workspace',
    },
    {
      target: '.workspace-card',
      content: 'Vos workspaces apparaîtront ici',
    },
    // ...
  ];

  <Joyride steps={steps} run={isFirstVisit} />
  ```

- [ ] **Marquer onboarding comme complété**
  - Ajouter champ `User.hasCompletedOnboarding`
  - Update après tour

### 7.8 Intégrations

- [ ] **Google Calendar** (export sessions)
  - Bouton "Ajouter au calendrier"
  - Générer fichier .ics

- [ ] **Notion export**
  - API Notion pour exporter notes de session

- [ ] **Slack webhook** (notifications workspace)
  - Envoyer message Slack quand nouvelle session créée

### 7.9 Settings page

- [ ] **Page settings** (`/dashboard/settings`)
  - Tabs : Profil, Préférences, Notifications, Sécurité

- [ ] **Préférences**
  - Langue (FR/EN)
  - Timezone
  - Notifications email (on/off)

- [ ] **Sécurité**
  - Voir sessions actives
  - Déconnexion de tous les appareils
  - Historique de connexions

### 7.10 Mobile App (Future)

- [ ] **Évaluer React Native** ou **PWA**
  - PWA = moins de développement, installable
  - React Native = meilleure UX native

- [ ] **PWA Setup**
  ```bash
  npm install next-pwa
  ```

  ```javascript
  // next.config.ts
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
  });

  module.exports = withPWA(nextConfig);
  ```

- [ ] **manifest.json**
  ```json
  {
    "name": "StudySpace",
    "short_name": "StudySpace",
    "description": "Plateforme collaborative d'étude",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```

---

## Critères d'acceptation

### Chat
- ✅ Messages en temps réel
- ✅ Support markdown (optionnel)
- ✅ Historique sauvegardé

### Notifications
- ✅ Bell icon avec badge count
- ✅ Liste notifications
- ✅ Mark as read fonctionne

### Analytics
- ✅ Graphiques temps d'étude
- ✅ Breakdown par matière
- ✅ Export CSV

### Mode sombre
- ✅ Toggle light/dark fonctionne
- ✅ Préférence sauvegardée (localStorage)
- ✅ Respect de prefers-color-scheme

### Profil
- ✅ Édition nom, avatar
- ✅ Changement mot de passe

### Recherche
- ✅ Autocomplete workspaces, sessions, files
- ✅ Résultats pertinents

---

## Dépendances

- ✅ Phase 3B & 4 terminées

---

## Risques

- **Feature creep** : Trop de features ajoutées sans validation user
  - Mitigation : Prioriser avec feedback utilisateurs
- **Complexity overhead** : Code base devient difficile à maintenir
  - Mitigation : Modulariser, documenter, tester

---

## Ressources

- Recharts : https://recharts.org
- react-joyride : https://react-joyride.com
- next-pwa : https://github.com/shadowwalker/next-pwa
- Resend (emails) : https://resend.com
- SendGrid : https://sendgrid.com

---

## Priorisation (MoSCoW)

**Must have** :
- Mode sombre
- Profil utilisateur

**Should have** :
- Notifications
- Analytics basiques

**Could have** :
- Chat intégré
- Recherche globale
- Onboarding

**Won't have (MVP)** :
- Intégrations (Google Calendar, Notion)
- Mobile app
