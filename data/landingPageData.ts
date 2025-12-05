import {
  AlertCircle,
  Calculator,
  FileQuestion,
  FileText,
  Link2,
  Pencil,
  PlusCircle,
  Rocket,
  Shuffle,
  Users,
  UserRoundX,
  Zap,
} from "lucide-react";

// ============================================
// DATA - Pain Points
// ============================================
export const painPoints = [
  {
    icon: Shuffle,
    title: "Fragmentation",
    description:
      "Discord pour parler, Docs pour écrire, WhatsApp pour les fichiers, Zoom pour la vidéo... Épuisant.",
  },
  {
    icon: AlertCircle,
    title: "Équations impossibles",
    description:
      "Écrire des formules maths proprement ? Bonne chance avec Google Docs...",
  },
  {
    icon: FileQuestion,
    title: "Historique perdu",
    description:
      "\"C'était où déjà ce qu'on a fait mardi dernier ?\" - Tous les groupes, chaque semaine.",
  },
  {
    icon: UserRoundX,
    title: "Coordination chaotique",
    description:
      "Qui parle ? Qui dessine ? Où sont les fichiers ? 10 minutes perdues à chaque session.",
  },
];

// ============================================
// DATA - Features (AMÉLIORÉ)
// ============================================
export const features = [
  {
    name: "Tout-en-un",
    tagline: "4 apps → 1 fenêtre",
    description:
      "Visio, tableau, notes et fichiers au même endroit. Fini le chaos de basculer entre 4 applications.",
    icon: Zap,
    color: "hsl(221, 83%, 60%)",
    stat: "75% de temps gagné en setup",
  },
  {
    name: "Équations visuelles",
    tagline: "Pas de LaTeX compliqué",
    description:
      "Créez des équations en quelques clics, comme dans Word. Propre, rapide, sans prise de tête.",
    icon: Calculator,
    color: "hsl(346, 90%, 60%)",
    stat: "3x plus rapide que LaTeX",
  },
  {
    name: "Tableau blanc collaboratif",
    tagline: "Dessinez ensemble",
    description:
      "Schématisez, expliquez et résolvez des exercices sur un tableau partagé en temps réel.",
    icon: Pencil,
    color: "hsl(258, 90%, 66%)",
  },
  {
    name: "Historique automatique",
    tagline: "Comme un cahier numérique",
    description:
      "Chaque session est sauvegardée automatiquement. Retrouvez vos notes en 2 clics.",
    icon: FileText,
    color: "hsl(158, 64%, 52%)",
    stat: "0 minute à chercher vos notes",
  },
  {
    name: "Sync temps réel",
    tagline: "Instantané",
    description:
      "Ce que tu vois = ce que je vois. Modifications synchronisées pour tous en < 100ms.",
    icon: Users,
    color: "hsl(37, 90%, 60%)",
  },
  {
    name: "Zéro configuration",
    tagline: "30 secondes chrono",
    description:
      "Créez une salle, partagez le lien, commencez à travailler. C'est tout.",
    icon: Rocket,
    color: "hsl(48, 95%, 53%)",
    stat: "Aucune installation requise",
  },
];

// ============================================
// DATA - How it Works
// ============================================
export const steps = [
  {
    icon: PlusCircle,
    title: "Créer une salle",
    description:
      "Donnez un nom, choisissez une matière (Maths, Info, Physique...). C'est fait.",
    time: "10 secondes",
  },
  {
    icon: Link2,
    title: "Inviter vos potes",
    description:
      "Copiez le lien, envoyez-le sur WhatsApp. Ils cliquent et c'est parti.",
    time: "5 secondes",
  },
  {
    icon: Rocket,
    title: "Travailler ensemble",
    description:
      "Activez la cam, dessinez, écrivez des équations, partagez des fichiers. Tout est là.",
    time: "Productif immédiatement",
  },
];

// ============================================
// DATA - Comparison Table
// ============================================
export const comparisonRows = [
  {
    feature: "Interface unifiée",
    discord: false,
    zoom: false,
    studyspace: true,
  },
  {
    feature: "Visioconférence",
    discord: true,
    zoom: true,
    studyspace: true,
  },
  {
    feature: "Tableau blanc collaboratif",
    discord: false,
    zoom: true,
    studyspace: true,
  },
  {
    feature: "Éditeur d'équations WYSIWYG",
    discord: false,
    zoom: false,
    studyspace: true,
  },
  {
    feature: "Historique chronologique",
    discord: false,
    zoom: false,
    studyspace: true,
  },
  {
    feature: "Gratuit pour étudiants",
    discord: true,
    zoom: false,
    studyspace: true,
  },
  {
    feature: "Setup en < 30 secondes",
    discord: false,
    zoom: false,
    studyspace: true,
  },
];

// ============================================
// DATA - Stats (AMÉLIORÉ - Crédibles pour MVP)
// ============================================
export const stats = [
  {
    value: "100%",
    label: "Gratuit pendant la beta",
  },
  {
    value: "< 30s",
    label: "Pour créer une salle",
  },
  {
    value: "5-10",
    label: "Participants simultanés",
  },
];

// ============================================
// DATA - FAQ
// ============================================
export const faqs = [
  {
    question: "C'est vraiment gratuit ?",
    answer:
      "Oui, 100% gratuit pendant toute la beta. Les 500 premiers inscrits (early adopters) gardent l'accès gratuit à vie, même après le lancement officiel.",
  },
  {
    question: "Faut-il télécharger quelque chose ?",
    answer:
      "Non, StudySpace fonctionne directement dans votre navigateur. Compatible desktop, tablette et mobile. Aucune installation nécessaire.",
  },
  {
    question: "Combien de personnes peuvent rejoindre une salle ?",
    answer:
      "Jusqu'à 10 participants simultanés par salle. C'est largement suffisant pour la plupart des groupes de révision.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Chiffrement en transit (HTTPS/WSS), serveurs hébergés en Europe, conformité RGPD. Vos données ne sont jamais vendues à des tiers.",
  },
  {
    question: "Ça marche sur téléphone ?",
    answer:
      "Oui, StudySpace est responsive et fonctionne sur mobile. Cependant, l'expérience est optimale sur ordinateur ou tablette (écran plus grand = plus confortable pour le tableau blanc).",
  },
  {
    question: "Je peux inviter mes profs ?",
    answer:
      "Bien sûr ! StudySpace est parfait pour du tutorat, des sessions de Q&A avec un prof, ou des révisions encadrées.",
  },
  {
    question: "Qu'est-ce qui se passe après la beta ?",
    answer:
      "Les 500 early adopters gardent l'accès gratuit à vie. Pour les nouveaux utilisateurs, nous proposerons un plan freemium (gratuit avec limites + premium optionnel).",
  },
];
