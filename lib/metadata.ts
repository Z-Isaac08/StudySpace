import { Metadata } from "next";

/**
 * Base URL for the application
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Base metadata configuration for the application
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: "StudySpace",
  authors: [{ name: "StudySpace" }],
  creator: "StudySpace",
  publisher: "StudySpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Default OpenGraph configuration
 */
export const defaultOpenGraph = {
  type: "website" as const,
  locale: "fr_FR",
  siteName: "StudySpace",
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "StudySpace - Plateforme collaborative pour étudiants",
    },
  ],
};

/**
 * Default Twitter configuration
 */
export const defaultTwitter = {
  card: "summary_large_image" as const,
  creator: "@studyspace",
  images: ["/og-image.png"],
};

/**
 * Creates metadata for a page
 */
export function createMetadata({
  title,
  description,
  keywords,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title.includes("StudySpace")
    ? title
    : `${title} | StudySpace`;

  return {
    ...baseMetadata,
    title: fullTitle,
    description,
    keywords: keywords || [
      "plateforme collaborative étudiants",
      "révision en ligne",
      "étude en groupe",
    ],
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...defaultOpenGraph,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      ...defaultTwitter,
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : baseMetadata.robots,
  };
}

/**
 * Page-specific metadata configurations
 */
export const pageMetadata = {
  home: createMetadata({
    title: "StudySpace - Plateforme de révision collaborative pour étudiants",
    description:
      "Révisez ensemble efficacement avec StudySpace. Visio, tableau blanc, équations et fichiers dans une seule interface. Gratuit pendant la beta. 500 places limitées.",
    keywords: [
      "plateforme collaborative étudiants",
      "révision en ligne",
      "tableau blanc collaboratif",
      "visio étudiants",
      "éditeur équations",
      "étude en groupe",
      "outil révision",
    ],
  }),

  login: createMetadata({
    title: "Connexion",
    description:
      "Connectez-vous à StudySpace pour accéder à vos espaces de travail et sessions d'étude collaboratives.",
    path: "/login",
    noIndex: true,
  }),

  register: createMetadata({
    title: "Créer un compte",
    description:
      "Créez votre compte StudySpace gratuit et commencez à réviser en groupe dès aujourd'hui.",
    path: "/register",
    noIndex: true,
  }),

  forgotPassword: createMetadata({
    title: "Mot de passe oublié",
    description:
      "Réinitialisez votre mot de passe StudySpace en toute sécurité.",
    path: "/forgot-password",
    noIndex: true,
  }),

  resetPassword: createMetadata({
    title: "Réinitialiser le mot de passe",
    description: "Créez un nouveau mot de passe pour votre compte StudySpace.",
    path: "/reset-password",
    noIndex: true,
  }),

  verifyEmail: createMetadata({
    title: "Vérification de l'email",
    description:
      "Vérifiez votre adresse email pour activer votre compte StudySpace.",
    path: "/verify-email",
    noIndex: true,
  }),

  dashboard: createMetadata({
    title: "Tableau de bord",
    description:
      "Accédez à vos espaces de travail, sessions d'étude et statistiques sur StudySpace.",
    path: "/dashboard",
    noIndex: true,
  }),

  workspaces: createMetadata({
    title: "Mes espaces de travail",
    description:
      "Gérez vos espaces de travail collaboratifs et créez de nouveaux groupes d'étude.",
    path: "/dashboard/workspaces",
    noIndex: true,
  }),

  notFound: createMetadata({
    title: "Page non trouvée",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    path: "/404",
    noIndex: true,
  }),
};
