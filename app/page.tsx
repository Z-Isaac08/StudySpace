"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MotionDiv, MotionSection } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  comparisonRows,
  faqs,
  features,
  painPoints,
  stats,
  steps,
} from "@/data/landingPageData";
import {
  fadeUpVariants,
  fadeVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {/* Hero Section - AMÉLIORÉ */}
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          className="relative overflow-hidden bg-primary-50 pt-20 pb-16 dark:bg-primary-900/10 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28"
          aria-labelledby="hero-heading"
        >
          <div
            className="absolute inset-0 bg-grid-neutral-900/[0.02] dark:bg-grid-neutral-50/[0.02]"
            aria-hidden="true"
          />
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
              <MotionDiv variants={staggerItemVariants}>
                <Badge
                  variant="outline"
                  className="mb-6 border-primary-300 bg-primary-100/80 text-primary-700 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                >
                  <Zap className="mr-2 h-3 w-3" aria-hidden="true" />
                  Beta privée · Places limitées
                </Badge>
              </MotionDiv>

              {/* Headline AMÉLIORÉ - Plus impactant */}
              <MotionDiv variants={staggerItemVariants}>
                <h1
                  id="hero-heading"
                  className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xl md:text-7xl lg:text-8xl"
                >
                  Arrêtez de jongler entre{" "}
                  <span className="relative inline-block">
                    <span className="line-through decoration-error-500 decoration-[3px] sm:decoration-4">
                      4 apps
                    </span>
                  </span>{" "}
                  pour réviser
                </h1>
                <p className="mt-6 text-2xl font-semibold text-primary-600 dark:text-primary-400">
                  Visio + Tableau + Équations + Fichiers.
                  <br />
                  <span className="text-neutral-900 dark:text-neutral-50">
                    Une seule interface. Zéro friction.
                  </span>
                </p>
              </MotionDiv>

              <MotionDiv variants={staggerItemVariants}>
                <p className="mt-8 text-xl leading-8 text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                  StudySpace réunit tous les outils dont vous avez besoin pour
                  réviser efficacement. Fini le chaos, place à la productivité.
                </p>
              </MotionDiv>

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
                    Obtenir mon accès gratuit
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg border-2"
                  asChild
                >
                  <Link href="#demo" aria-label="Voir la démo">
                    Voir comment ça marche
                  </Link>
                </Button>
              </MotionDiv>

              <MotionDiv
                variants={staggerItemVariants}
                className="mt-12 flex items-center justify-center gap-8 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success-500" />
                  <span>Gratuit pour les early adopters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success-500" />
                  <span>Aucune carte requise</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success-500" />
                  <span>30 secondes pour démarrer</span>
                </div>
              </MotionDiv>
            </MotionDiv>

            {/* App Mockup - Simplifié avec vidéo placeholder */}
            <MotionDiv
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-20 flow-root sm:mt-28"
            >
              <div className="relative rounded-2xl bg-linear-gradient-to-b from-neutral-100/80 to-neutral-200/40 p-2 ring-1 ring-neutral-900/10 backdrop-blur dark:from-neutral-900/40 dark:to-neutral-800/20 dark:ring-neutral-50/10 lg:-m-4 lg:rounded-3xl lg:p-4">
                <div className="rounded-xl bg-background shadow-2xl ring-1 ring-neutral-900/10 dark:ring-neutral-50/10 overflow-hidden">
                  {/* Video placeholder */}
                  <div className="aspect-video bg-neutral-900 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-linear-gradient-to-br from-primary-500/20 to-primary-700/20" />
                    <div className="relative text-center z-10">
                      <Video className="h-16 w-16 text-white mx-auto mb-4" />
                      <p className="text-white text-lg font-medium">
                        Démo vidéo bientôt disponible
                      </p>
                    </div>
                  </div>

                  {/* Badge flottant */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 px-6 py-3 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-medium text-sm">
                        Session en direct
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Pain Points Section - NOUVEAU */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="py-24 bg-neutral-50 dark:bg-neutral-900 sm:py-32"
          aria-labelledby="problems-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="destructive" className="mb-4">
                Le problème
              </Badge>
              <h2
                id="problems-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Réviser à distance, c'est le chaos
              </h2>
              <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                On connaît ces galères. On les a vécues. C'est pour ça qu'on a
                créé StudySpace.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {painPoints.map((pain, index) => (
                <MotionDiv key={index} variants={staggerItemVariants}>
                  <Card className="p-6 border-2 border-neutral-200 dark:border-neutral-800 h-full hover:border-error-300 dark:hover:border-error-700 transition-colors">
                    <div className="mb-4">
                      <pain.icon className="h-12 w-12 text-error-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-neutral-50">
                      {pain.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {pain.description}
                    </p>
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Features Section - AMÉLIORÉ */}
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
                La solution
              </Badge>
              <h2
                id="features-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Tous les outils en un seul endroit
              </h2>
              <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                Une plateforme complète pensée pour les étudiants, pas pour les
                entreprises.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
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

                    {/* Tagline NOUVEAU */}
                    {feature.tagline && (
                      <Badge variant="secondary" className="mb-3">
                        {feature.tagline}
                      </Badge>
                    )}

                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Stat NOUVEAU */}
                    {feature.stat && (
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {feature.stat}
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* How it Works Section - NOUVEAU */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="py-24 bg-primary-50 dark:bg-primary-900/10 sm:py-32"
          aria-labelledby="how-it-works-heading"
          id="demo"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                En 3 étapes simples
              </Badge>
              <h2
                id="how-it-works-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                De 0 à productif en 30 secondes
              </h2>
              <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
                Pas de configuration compliquée. Pas de tutoriel de 20 minutes.
                Juste l'essentiel.
              </p>
            </div>

            <MotionDiv
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            >
              {/* Ligne connectrice (desktop) */}
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-linear-gradient-to-r from-primary-300 via-primary-500 to-primary-300 dark:from-primary-700 dark:via-primary-500 dark:to-primary-700" />

              {steps.map((step, index) => (
                <MotionDiv key={index} variants={staggerItemVariants}>
                  <Card className="relative p-8 text-center h-full">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-bold z-10 shadow-lg">
                      {index + 1}
                    </div>
                    <div className="mt-6">
                      <step.icon className="h-16 w-16 mx-auto mb-4 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                        {step.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-sm font-semibold text-primary-700 dark:text-primary-300">
                        {step.time}
                      </div>
                    </div>
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* Comparison Table - NOUVEAU */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="py-24 sm:py-32"
          aria-labelledby="comparison-heading"
        >
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                id="comparison-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Pourquoi StudySpace ?
              </h2>
              <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
                Comparaison honnête avec les alternatives
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                    <th className="text-left p-4 font-semibold text-neutral-900 dark:text-neutral-50">
                      Fonctionnalité
                    </th>
                    <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                      Discord + Docs
                    </th>
                    <th className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                      Zoom + Miro
                    </th>
                    <th className="p-4 bg-primary-50 dark:bg-primary-900/20 font-semibold text-primary-700 dark:text-primary-300">
                      <Badge className="mb-1">StudySpace</Badge>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-200 dark:border-neutral-800"
                    >
                      <td className="p-4 font-medium text-neutral-900 dark:text-neutral-50">
                        {row.feature}
                      </td>
                      <td className="p-4 text-center">
                        {row.discord ? (
                          <Check className="h-5 w-5 text-success-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-error-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.zoom ? (
                          <Check className="h-5 w-5 text-success-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-error-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary-50/50 dark:bg-primary-900/10">
                        {row.studyspace ? (
                          <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-error-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionSection>

        {/* Stats Section - ENHANCED with animations */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="relative overflow-hidden bg-neutral-50 py-24 dark:bg-neutral-900 sm:py-32"
          aria-labelledby="stats-heading"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-200/10 blur-3xl dark:bg-primary-700/5" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary-300/10 blur-3xl dark:bg-primary-600/5" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="stats-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Simple, rapide, efficace
              </h2>
              <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
                Conçu pour les étudiants qui veulent des résultats, pas des
                complications.
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
                  className="group relative"
                >
                  <Card className="relative h-full p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 border-2 hover:border-primary/50">
                    {/* Gradient accent line */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="text-6xl font-bold bg-linear-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="mt-4 text-lg font-medium text-neutral-700 dark:text-neutral-300">
                      {stat.label}
                    </div>
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </MotionSection>

        {/* FAQ Section - NOUVEAU */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="py-24 sm:py-32"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2
                id="faq-heading"
                className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
              >
                Questions fréquentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </MotionSection>

        {/* Testimonials Section - Ou Early Adopters CTA */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="py-24 bg-neutral-50 dark:bg-neutral-900 sm:py-32"
          aria-labelledby="testimonials-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center py-16 bg-linear-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl border border-primary-200 dark:border-primary-800">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary-600 dark:text-primary-400" />
              <Badge className="mb-4">Places limitées</Badge>
              <h3
                id="testimonials-heading"
                className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-50"
              >
                Rejoignez les premiers testeurs
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto text-lg">
                Participez à la beta privée et influencez le développement de
                StudySpace.
                <br />
                <span className="font-semibold text-primary-700 dark:text-primary-300">
                  342/500 places restantes
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Devenir early adopter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">J'ai déjà un compte</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
                ✓ Gratuit à vie pour les 500 premiers · ✓ Accès prioritaire aux
                nouvelles features
              </p>
            </div>
          </div>
        </MotionSection>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
        role="contentinfo"
      >
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                StudySpace
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                La plateforme de collaboration pour étudiants qui révolutionnera
                vos sessions de révision.
              </p>
              <div className="flex gap-4">
                <Badge variant="outline">Beta privée</Badge>
                <Badge variant="outline">Made with ❤️ pour les étudiants</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Produit
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Légal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    CGU
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {new Date().getFullYear()} StudySpace. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
