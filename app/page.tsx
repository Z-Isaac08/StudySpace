"use client";

import { MotionDiv, MotionSection } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fadeUpVariants,
  fadeVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";
import {
  ArrowRight,
  Calculator,
  FileText,
  Pencil,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {/* Hero Section */}
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          className="relative overflow-hidden bg-primary-50 pt-24 pb-12 dark:bg-primary-900/10 sm:pt-32 sm:pb-16"
          aria-labelledby="hero-heading"
        >
          {/* Decorative Background - Hidden from screen readers */}
          <div
            className="absolute inset-0 bg-grid-neutral-900/[0.02] dark:bg-grid-neutral-50/[0.02]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <MotionDiv
              initial="hidden"
              animate="visible"
              variants={staggerContainerVariants}
              className="mx-auto max-w-4xl text-center"
            >
              {/* Badge */}
              <MotionDiv variants={staggerItemVariants}>
                <Badge
                  variant="outline"
                  className="mb-8 border-primary-200 bg-primary-100 text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  <Zap className="mr-2 h-3 w-3" aria-hidden="true" />
                  Plateforme d'étude collaborative
                </Badge>
              </MotionDiv>

              {/* Heading */}
              <MotionDiv variants={staggerItemVariants}>
                <h1
                  id="hero-heading"
                  className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-7xl"
                >
                  Étudiez ensemble,{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    réussissez mieux
                  </span>
                </h1>
              </MotionDiv>

              {/* Description */}
              <MotionDiv variants={staggerItemVariants}>
                <p className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  StudySpace réunit tous les outils dont vous avez besoin pour
                  réviser efficacement : vidéo, tableau blanc, éditeur partagé
                  et bien plus encore.
                </p>
              </MotionDiv>

              {/* CTA Buttons */}
              <MotionDiv
                variants={staggerItemVariants}
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
              >
                <Button size="lg" className="h-12 gap-2 px-8 text-base" asChild>
                  <Link
                    href="/register"
                    aria-label="Créer un compte gratuitement"
                  >
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/login" aria-label="Se connecter à votre compte">
                    Se connecter
                  </Link>
                </Button>
              </MotionDiv>
            </MotionDiv>

            {/* App Mockup - Semantic Image Role */}
            <MotionDiv
              variants={fadeUpVariants}
              className="mt-16 flow-root sm:mt-24"
            >
              <div
                className="rounded-xl bg-neutral-900/5 p-2 ring-1 ring-neutral-900/10 dark:bg-neutral-50/5 dark:ring-neutral-50/10 lg:-m-4 lg:rounded-2xl lg:p-4"
                role="img"
                aria-label="Aperçu de l'interface StudySpace montrant la visioconférence et le tableau blanc"
              >
                <div className="rounded-lg bg-background shadow-2xl ring-1 ring-neutral-900/10 dark:ring-neutral-50/10 overflow-hidden">
                  {/* Mockup Header */}
                  <div
                    className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                    aria-hidden="true"
                  >
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="mx-auto h-6 w-80 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50" />
                  </div>
                  {/* Mockup Content */}
                  <div
                    className="flex h-[400px] w-full bg-background dark:bg-neutral-950"
                    aria-hidden="true"
                  >
                    {/* Sidebar */}
                    <div className="hidden w-64 border-r border-neutral-200 bg-neutral-50/30 p-4 dark:border-neutral-800 dark:bg-neutral-900/30 md:block">
                      <div className="space-y-3">
                        <div className="h-8 w-3/4 rounded-md bg-primary-100 dark:bg-primary-900/30" />
                        <div className="h-4 w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                        <div className="h-4 w-2/3 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                        <div className="h-4 w-1/2 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                      </div>
                    </div>
                    {/* Main Area */}
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
                          <Video className="h-8 w-8" />
                        </div>
                        <div className="h-32 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
                          <Pencil className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="mt-4 h-48 rounded-lg border border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 p-4">
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                          <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
                          <div className="h-4 w-4/6 rounded bg-neutral-200 dark:bg-neutral-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Features Section */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="py-24 sm:py-32"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="features-heading"
                className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl"
              >
                Tous les outils en un seul endroit
              </h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                Une plateforme complète pour collaborer efficacement avec vos
                camarades.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => (
                <MotionDiv key={feature.name} variants={staggerItemVariants}>
                  <Card className="relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg h-full">
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: feature.color }}
                      aria-hidden="true"
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Stats Section */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="bg-primary-50 py-24 dark:bg-primary-900/10 sm:py-32"
          aria-labelledby="stats-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="stats-heading"
                className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl"
              >
                Rejoignez des milliers d'étudiants
              </h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                StudySpace aide déjà de nombreux étudiants à réussir ensemble.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {stats.map((stat) => (
                <MotionDiv
                  key={stat.label}
                  variants={staggerItemVariants}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* CTA Section */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="py-24 sm:py-32"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-primary-600 dark:bg-primary-700 p-12 text-center">
              <h2
                id="cta-heading"
                className="text-3xl font-bold text-white sm:text-4xl"
              >
                Prêt à booster vos révisions ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-50">
                Créez votre premier workspace et invitez vos amis dès
                maintenant. C'est gratuit !
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 gap-2 px-8 text-base"
                  asChild
                >
                  <Link
                    href="/register"
                    aria-label="S'inscrire et commencer maintenant"
                  >
                    Commencer maintenant
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </MotionSection>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
        role="contentinfo"
      >
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {new Date().getFullYear()} StudySpace. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: "Visioconférence",
    description:
      "Discutez en temps réel avec vos camarades grâce à la vidéo et l'audio haute qualité.",
    icon: Video,
    color: "hsl(221, 83%, 60%)", // Primary blue
  },
  {
    name: "Tableau blanc",
    description:
      "Dessinez, schématisez et expliquez vos concepts sur un tableau partagé interactif.",
    icon: Pencil,
    color: "hsl(258, 90%, 66%)", // Purple (physique)
  },
  {
    name: "Éditeur partagé",
    description:
      "Rédigez vos notes ensemble en temps réel avec un éditeur collaboratif puissant.",
    icon: FileText,
    color: "hsl(158, 64%, 52%)", // Green (info)
  },
  {
    name: "Équations LaTeX",
    description:
      "Écrivez des formules mathématiques complexes avec le support LaTeX intégré.",
    icon: Calculator,
    color: "hsl(346, 90%, 60%)", // Red (maths)
  },
  {
    name: "Espaces de travail",
    description:
      "Organisez vos sessions par matière et invitez vos groupes d'étude facilement.",
    icon: Users,
    color: "hsl(37, 90%, 60%)", // Orange (chimie)
  },
  {
    name: "Synchronisation temps réel",
    description:
      "Toutes les modifications sont synchronisées instantanément entre tous les participants.",
    icon: Zap,
    color: "hsl(48, 95%, 53%)", // Yellow (warning)
  },
];

const stats = [
  { value: "10K+", label: "Étudiants actifs" },
  { value: "500+", label: "Établissements" },
  { value: "50K+", label: "Sessions complétées" },
];
