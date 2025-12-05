import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
  authors: [{ name: "StudySpace" }],
  creator: "StudySpace",
  metadataBase: new URL("https://studyspace.com"), // TODO: Update with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "StudySpace - Révisez ensemble, simplement",
    description:
      "Arrêtez de jongler entre 4 apps pour réviser. Visio + Tableau + Équations + Fichiers en une seule interface. Beta privée gratuite.",
    siteName: "StudySpace",
    images: [
      {
        url: "/og-image.png", // TODO: Create OG image
        width: 1200,
        height: 630,
        alt: "StudySpace - Plateforme collaborative pour étudiants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySpace - Révisez ensemble, simplement",
    description:
      "Arrêtez de jongler entre 4 apps. Visio + Tableau + Équations + Fichiers en un seul endroit. Beta privée gratuite.",
    images: ["/og-image.png"], // TODO: Create Twitter card image
    creator: "@studyspace", // TODO: Update with actual Twitter handle if exists
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
  verification: {
    // TODO: Add when ready to verify with Google Search Console
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
