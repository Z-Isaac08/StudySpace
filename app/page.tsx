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
  CheckCircle2,
  FileText,
  Pencil,
  Quote,
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
          className="relative overflow-hidden bg-primary-50 pt-20 pb-16 dark:bg-primary-900/10 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28"
          aria-labelledby="hero-heading"
        >
          {/* Decorative Background - Hidden from screen readers */}
          <div
            className="absolute inset-0 bg-grid-neutral-900/[0.02] dark:bg-grid-neutral-50/[0.02]"
            aria-hidden="true"
          />

          {/* Floating Elements for Visual Interest */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/4 left-10 h-64 w-64 rounded-full bg-primary-200/20 blur-3xl dark:bg-primary-700/10" />
            <div className="absolute bottom-1/4 right-10 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl dark:bg-primary-600/10" />
          </div>

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
                  className="mb-6 border-primary-300 bg-primary-100/80 text-primary-700 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                >
                  <Zap className="mr-2 h-3 w-3" aria-hidden="true" />
                  Plateforme d'étude collaborative
                </Badge>
              </MotionDiv>

              {/* Heading */}
              <MotionDiv variants={staggerItemVariants}>
                <h1
                  id="hero-heading"
                  className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xlmd:text-7xl lg:text-8xl"
                >
                  Étudiez ensemble,{" "}
                  <span className="relative">
                    <span className="text-primary-600 dark:text-primary-400">
                      réussissez mieux
                    </span>
                    <svg
                      className="absolute -bottom-2 left-0 w-full text-primary-400/30 dark:text-primary-500/20"
                      height="12"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 10C50 3 100 1 150 2C200 3 250 5 298 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </MotionDiv>

              {/* Description */}
              <MotionDiv variants={staggerItemVariants}>
                <p className="mt-8 text-xl leading-8 text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                  StudySpace réunit tous les outils dont vous avez besoin pour
                  réviser efficacement : vidéo, tableau blanc, éditeur partagé
                  et bien plus encore.
                </p>
              </MotionDiv>

              {/* CTA Buttons */}
              <MotionDiv
                variants={staggerItemVariants}
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
              >
                <Button
                  size="lg"
                  className="h-14 gap-2 px-10 text-lg shadow-lg shadow-primary-500/20"
                  asChild
                >
                  <Link
                    href="/register"
                    aria-label="Créer un compte gratuitement"
                  >
                    Commencer gratuitement
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg border-2"
                  asChild
                >
                  <Link href="/login" aria-label="Se connecter à votre compte">
                    Se connecter
                  </Link>
                </Button>
              </MotionDiv>

              {/* Social Proof */}
              <MotionDiv
                variants={staggerItemVariants}
                className="mt-12 flex items-center justify-center gap-8 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success-500" />
                  <span>Gratuit pour toujours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success-500" />
                  <span>Aucune carte requise</span>
                </div>
              </MotionDiv>
            </MotionDiv>

            {/* App Mockup - Semantic Image Role */}
            <MotionDiv
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-20 flow-root sm:mt-28"
            >
              <div
                className="rounded-2xl bg-linear-to-b from-neutral-100/80 to-neutral-200/40 p-2 ring-1 ring-neutral-900/10 backdrop-blur dark:from-neutral-900/40 dark:to-neutral-800/20 dark:ring-neutral-50/10 lg:-m-4 lg:rounded-3xl lg:p-4"
                role="img"
                aria-label="Aperçu de l'interface StudySpace montrant la visioconférence et le tableau blanc"
              >
                <div className="rounded-xl bg-background shadow-2xl ring-1 ring-neutral-900/10 dark:ring-neutral-50/10 overflow-hidden">
                  {/* Mockup Header */}
                  <div
                    className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80"
                    aria-hidden="true"
                  >
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        3 participants en ligne
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded bg-neutral-200 dark:bg-neutral-700" />
                      <div className="h-6 w-6 rounded bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                  </div>
                  {/* Mockup Content */}
                  <div
                    className="flex h-[450px] w-full bg-background dark:bg-neutral-950"
                    aria-hidden="true"
                  >
                    {/* Sidebar */}
                    <div className="hidden w-72 border-r border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50 md:block">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="h-6 w-24 rounded bg-neutral-300 dark:bg-neutral-700" />
                          <div className="h-10 w-full rounded-lg bg-primary-100 border-l-4 border-primary-500 p-2 dark:bg-primary-900/30">
                            <div className="h-4 w-3/4 rounded bg-primary-200 dark:bg-primary-800" />
                          </div>
                          <div className="h-10 w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                          </div>
                          <div className="h-10 w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                            <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
                          </div>
                        </div>
                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="h-5 w-20 rounded bg-neutral-300 dark:bg-neutral-700 mb-2" />
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary-200 dark:bg-primary-800" />
                              <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-success-200 dark:bg-success-800" />
                              <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-warning-200 dark:bg-warning-800" />
                              <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Main Area */}
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        {/* Video Grid */}
                        <div className="space-y-3">
                          <div className="h-36 rounded-lg border-2 border-neutral-200 dark:border-neutral-800 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
                            <Video className="h-10 w-10 text-neutral-400" />
                            <div className="absolute bottom-2 left-2 right-2 h-6 bg-neutral-900/80 backdrop-blur rounded flex items-center px-2">
                              <div className="h-3 flex-1 rounded bg-neutral-700" />
                            </div>
                          </div>
                          <div className="h-28 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-center">
                            <Users className="h-8 w-8 text-neutral-400" />
                          </div>
                        </div>
                        {/* Whiteboard */}
                        <div className="rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 relative">
                          <Pencil className="absolute top-4 right-4 h-6 w-6 text-neutral-300 dark:text-neutral-600" />
                          <div className="space-y-3">
                            <div className="h-2 w-32 rounded-full bg-primary-300 dark:bg-primary-700" />
                            <div className="flex gap-2">
                              <div className="h-16 w-16 rounded-lg bg-warning-200 dark:bg-warning-800/30" />
                              <div className="flex-1space-y-1">
                                <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                                <div className="h-2 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
                              </div>
                            </div>
                            <div className="h-24 rounded border border-neutral-200 dark:border-neutral-700" />
                          </div>
                        </div>
                        {/* Editor/Notes Area - Spans full width bottom */}
                        <div className="col-span-2 rounded-lg border border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-neutral-400" />
                            <div className="h-3 w-24 rounded bg-neutral-300 dark:bg-neutral-700" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                            <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                            <div className="h-2 w-4/5 rounded bg-neutral-200 dark:bg-neutral-700" />
                            <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                            <div className="h-2 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                          </div>
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
              <Badge variant="outline" className="mb-4">
                <Zap className="mr-2 h-3 w-3" />
                Fonctionnalités
              </Badge>
              <h2
                id="features-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Tous les outils en un seul endroit
              </h2>
              <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                Une plateforme complète pour collaborer efficacement avec vos
                camarades.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => (
                <MotionDiv key={feature.name} variants={staggerItemVariants}>
                  <Card className="group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 h-full">
                    <div
                      className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: feature.color }}
                      aria-hidden="true"
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                    {/* Decorative gradient on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-primary-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Rejoignez des milliers d'étudiants
              </h2>
              <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
                StudySpace aide déjà de nombreux étudiants à réussir ensemble.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {stats.map((stat) => (
                <MotionDiv
                  key={stat.label}
                  variants={staggerItemVariants}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-6xl font-bold bg-linear-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600">
                    {stat.value}
                  </div>
                  <div className="mt-3 text-lg font-medium text-neutral-700 dark:text-neutral-300">
                    {stat.label}
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Testimonials Section */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="py-24 sm:py-32"
          aria-labelledby="testimonials-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                <Quote className="mr-2 h-3 w-3" />
                Témoignages
              </Badge>
              <h2
                id="testimonials-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Ce que disent nos utilisateurs
              </h2>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {testimonials.map((testimonial, index) => (
                <MotionDiv key={index} variants={staggerItemVariants}>
                  <Card className="p-8 h-full flex flex-col">
                    <Quote className="h-8 w-8 text-primary-300 dark:text-primary-700 mb-4" />
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 flex-1">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                        style={{ backgroundColor: testimonial.color }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </Card>
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
            <Card className="relative overflow-hidden bg-linear-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 p-12 text-center sm:p-16">
              {/* Decorative elements */}
              <div
                className="absolute inset-0 bg-grid-white/[0.05]"
                aria-hidden="true"
              />
              <div
                className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative">
                <h2
                  id="cta-heading"
                  className="text-4xl font-bold text-white sm:text-5xl"
                >
                  Prêt à booster vos révisions ?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-50">
                  Créez votre premier workspace et invitez vos amis dès
                  maintenant. C'est gratuit et aucune carte bancaire n'est
                  requise !
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-14 gap-2 px-10 text-lg shadow-xl"
                    asChild
                  >
                    <Link
                      href="/register"
                      aria-label="S'inscrire et commencer maintenant"
                    >
                      Commencer maintenant
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
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

const testimonials = [
  {
    content:
      "StudySpace a transformé notre façon de réviser. Les tableaux blancs interactifs sont parfaits pour les maths !",
    name: "Marie Dubois",
    role: "L3 Mathématiques",
    color: "hsl(221, 83%, 60%)",
  },
  {
    content:
      "Enfin une plateforme qui permet vraiment de travailler comme si on était ensemble. L'éditeur collaboratif est génial.",
    name: "Thomas Martin",
    role: "M1 Informatique",
    color: "hsl(158, 64%, 52%)",
  },
  {
    content:
      "Grâce à StudySpace, on peut organiser nos révisions d'examens même à distance. C'est devenu indispensable !",
    name: "Sarah Cohen",
    role: "L2 Droit",
    color: "hsl(45, 93%, 47%)",
  },
];
