# 🗨️ Workspace Global Chat

Le **Global Chat** est votre espace de discussion permanent au sein d'un Workspace StudySpace. Contrairement aux sessions d'étude, ce chat est persistant et permet à tous les membres de collaborer, de s'organiser et de partager des informations à tout moment.

## ✨ Fonctionnalités Clés

- **Bulle Flottante (Option C)** : Une interface discrète accessible depuis n'importe quelle page du workspace.
- **Temps Réel** : Les messages s'affichent instantanément grâce à l'intégration Pusher.
- **Historique Persistant** : Retrouvez vos discussions même après avoir fermé votre navigateur.
- **Scoping Workspace** : Chaque workspace possède son propre canal de discussion sécurisé, réservé à ses membres.

## 🚀 Comment ça marche ?

1.  **Ouverture** : Cliquez sur la bulle flottante en bas à droite de votre écran. Elle s'agrandit pour devenir votre fenêtre de discussion.
2.  **Envoi** : Saisissez votre message et appuyez sur `Entrée`. Tous les membres connectés le verront immédiatement.
3.  **Lecture** : Les messages sont horodatés et affichent l'avatar de l'auteur pour une lecture fluide.
4.  **Notifications** : Un badge visuel sur la bulle vous indique si vous avez manqué des messages pendant votre absence.

## 🛠️ Détails Techniques (Aperçu)

- **Stockage** : Les messages sont sauvegardés dans une base de données PostgreSQL via Prisma.
- **Transport** : Utilisation de WebSockets via Pusher pour l'instantanéité.
- **UI** : Composants React animés avec Framer Motion pour une expérience "premium" et fluide.

---

> [!TIP]
> Utilisez le chat global pour fixer des rendez-vous de révision ! Une fois que tout le monde est d'accord, un membre peut lancer une **Session d'Étude** officielle.
