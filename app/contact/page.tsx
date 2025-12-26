import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import { Github, Mail, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | StudySpace",
  description: "Contactez l'équipe StudySpace pour toute question ou suggestion",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Nous contacter
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
              Une question ? On est là pour vous aider
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Que ce soit pour un bug, une suggestion ou juste dire bonjour,
              nous sommes à l&apos;écoute !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Support Email */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle>Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Pour toute question technique ou problème avec votre compte
                </p>
                <a
                  href="mailto:support@studyspace.app"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  support@studyspace.app
                </a>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                  Réponse sous 24-48h
                </p>
              </CardContent>
            </Card>

            {/* General Email */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle>Contact général</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Pour les partenariats, presse ou autres demandes
                </p>
                <a
                  href="mailto:contact@studyspace.app"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  contact@studyspace.app
                </a>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                  Réponse sous 48-72h
                </p>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle>Données personnelles</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Pour exercer vos droits RGPD (accès, suppression, portabilité)
                </p>
                <a
                  href="mailto:privacy@studyspace.app"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  privacy@studyspace.app
                </a>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                  Réponse sous 30 jours (délai légal)
                </p>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle>Feedback & Suggestions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Une idée pour améliorer StudySpace ? On veut l&apos;entendre !
                </p>
                <a
                  href="mailto:feedback@studyspace.app"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  feedback@studyspace.app
                </a>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                  Toutes les idées sont lues 👀
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Social Media */}
          <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Suivez-nous sur les réseaux
              </h2>
              <div className="flex justify-center gap-6">
                <a
                  href="https://twitter.com/studyspace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  <Twitter className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
                <a
                  href="https://github.com/studyspace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  <Github className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Link */}
          <div className="mt-12 text-center p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Votre question a peut-être déjà une réponse dans notre FAQ
            </p>
            <a
              href="/#faq"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Voir la FAQ →
            </a>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
