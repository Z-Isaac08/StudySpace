# IDEA - StudySpace

## Vision

**StudySpace** est une plateforme collaborative d'étude en ligne permettant aux étudiants de travailler ensemble en temps réel, de partager des ressources et de créer des sessions d'étude productives dans des espaces de travail organisés.

## Problème

### Problèmes identifiés

1. **Isolation des étudiants** : Les étudiants travaillent souvent seuls sans possibilité de collaboration efficace avec leurs pairs
2. **Outils dispersés** : Les étudiants utilisent plusieurs applications (Google Docs, Discord, Zoom, Notion) créant une expérience fragmentée
3. **Manque de structure** : Pas de solution intégrée pour organiser les sessions d'étude par matière ou projet
4. **Difficulté de partage** : Complexité pour partager des notes, des schémas et des ressources en temps réel
5. **Pas de traçabilité** : Aucun moyen de mesurer le temps d'étude ou de sauvegarder automatiquement le travail

### Public cible

- **Étudiants universitaires** (18-25 ans) travaillant en groupe sur des projets ou révisions
- **Étudiants en prépa** cherchant des sessions d'étude structurées
- **Groupes d'étude** ayant besoin d'un espace centralisé
- **Étudiants à distance** nécessitant des outils de collaboration asynchrone et synchrone

## Solution

### Proposition de valeur

**Un espace de travail collaboratif tout-en-un pour étudiants**, combinant :

- **Workspaces** : Espaces organisés par matière (maths, physique, langues, etc.) avec système d'invitation
- **Sessions d'étude** : Sessions enregistrées avec sauvegarde automatique du travail (canvas + notes)
- **Tableau blanc collaboratif** : Canvas HTML5 pour dessiner, schématiser, annoter
- **Éditeur de notes** : Prise de notes en temps réel avec état sauvegardé
- **Gestion des membres** : Système de rôles (propriétaire/membre) avec permissions
- **Authentification sécurisée** : Inscription, connexion, réinitialisation de mot de passe via Supabase

### Caractéristiques clés (MVP)

#### ✅ Phase 1 : Landing & Authentication (Terminé)
- Page d'accueil SEO-optimisée avec animations Framer Motion
- Inscription/connexion par email avec vérification
- Réinitialisation de mot de passe
- Dashboard utilisateur

#### ✅ Phase 2 : Workspaces (Terminé)
- Création de workspace avec nom, description, tag (matière)
- Codes d'invitation uniques pour rejoindre
- Liste des workspaces utilisateur
- Gestion des membres (ajout, suppression, modification de rôle)
- Suppression de workspace (propriétaire uniquement)

#### ✅ Phase 3A : Sessions basiques (Terminé - MVP Actuel)
- Création de session dans un workspace
- Interface session avec :
  - **Whiteboard** : Canvas HTML5 pour dessiner (souris uniquement)
  - **Éditeur** : Zone de texte pour prendre des notes
  - **Auto-save** : Sauvegarde automatique toutes les 30 secondes
  - **Sauvegarde manuelle** : Bouton pour sauvegarder immédiatement
  - **Fin de session** : Calcul automatique de la durée
- Historique des sessions par workspace
- Mode lecture seule pour sessions terminées
- Design responsive (mobile-first)

#### 🔜 Phase 3B : Real-time & Collaboration (Planifié)
- Collaboration en temps réel (Yjs + WebSockets)
- Éditeur riche (TipTap avec extensions)
- Whiteboard avancé (Konva.js ou Fabric.js)
- Indicateurs de présence
- Curseurs collaboratifs
- WebRTC audio/vidéo

#### 🔜 Phase 4 : Fichiers & Ressources (Planifié)
- Upload de fichiers (PDF, images, documents)
- Stockage Supabase Storage
- Partage dans les workspaces
- Annotations sur documents

## Différenciation

### Avantages compétitifs

1. **Tout-en-un** : Combine tableau blanc, éditeur, audio/vidéo dans un seul outil
2. **Optimisé pour étudiants** : Tags par matière, sessions chronométrées, historique d'étude
3. **Gratuit et open-source** : Pas de paywall pour fonctionnalités essentielles
4. **Design moderne** : Interface intuitive avec Tailwind CSS et shadcn/ui
5. **Performance** : Next.js 16 avec React Compiler pour optimisations automatiques
6. **Mobile-first** : Utilisable sur tous les appareils

### Comparaison concurrents

| Fonctionnalité | StudySpace | Google Docs | Miro | Discord |
|----------------|------------|-------------|------|---------|
| Tableau blanc | ✅ | ❌ | ✅ | ❌ |
| Éditeur de texte | ✅ | ✅ | ❌ | ❌ |
| Audio/vidéo | 🔜 | ✅ | ✅ | ✅ |
| Organisation par matière | ✅ | ❌ | ❌ | ⚠️ |
| Sessions chronométrées | ✅ | ❌ | ❌ | ❌ |
| Gratuit | ✅ | ✅ | ❌ | ✅ |
| Conçu pour étudiants | ✅ | ❌ | ❌ | ⚠️ |

## Modèle économique (Futur)

### Version gratuite (MVP)
- Workspaces illimités
- Sessions illimités
- 5 Go de stockage
- Jusqu'à 10 membres par workspace

### Version Premium (Futur)
- 100 Go de stockage
- Enregistrement des sessions
- Intégrations (Google Drive, Notion)
- Analytics d'étude (temps passé, productivité)
- Thèmes personnalisés

## Métriques de succès

### Phase MVP
- ✅ Landing page fonctionnelle avec SEO
- ✅ Authentification complète (inscription, connexion, reset)
- ✅ Création et gestion de workspaces
- ✅ Sessions avec auto-save et historique
- ✅ 0 erreurs TypeScript en mode strict
- ✅ Design responsive sur mobile/desktop

### Phase croissance (Objectifs)
- 100 utilisateurs actifs en 3 mois
- 10+ sessions créées par jour
- Taux de rétention 40% (retour hebdomadaire)
- 50% des sessions durent plus de 15 minutes
- Temps de chargement < 2 secondes

## Roadmap future

### Court terme (1-2 mois)
- [ ] Collaboration en temps réel (Yjs)
- [ ] Éditeur riche (TipTap)
- [ ] Whiteboard avancé (Konva.js)
- [ ] WebRTC audio/vidéo

### Moyen terme (3-6 mois)
- [ ] Upload et partage de fichiers
- [ ] Système de notifications
- [ ] Chat intégré
- [ ] Mode sombre

### Long terme (6-12 mois)
- [ ] Analytics d'étude
- [ ] Intégrations tierces (Google Calendar, Notion)
- [ ] Mobile app (React Native)
- [ ] IA pour suggestions de ressources

## Résumé

**StudySpace** résout le problème de l'éparpillement des outils d'étude en offrant une plateforme unifiée où les étudiants peuvent créer des espaces de travail organisés, collaborer en temps réel sur un tableau blanc et un éditeur, et sauvegarder automatiquement leur progression. Le MVP actuel (Phase 3A) offre déjà une base solide avec authentification, workspaces, et sessions fonctionnelles, prêt pour l'ajout de fonctionnalités temps réel et de fichiers.
