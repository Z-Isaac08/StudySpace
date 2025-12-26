import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | StudySpace",
  description:
    "Conditions générales d'utilisation de la plateforme StudySpace",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptation des conditions
              </h2>
              <p>
                En accédant et en utilisant StudySpace (&quot;le Service&quot;), vous
                acceptez d&apos;être lié par les présentes Conditions Générales
                d&apos;Utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne
                pas utiliser le Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Description du service
              </h2>
              <p>
                StudySpace est une plateforme de collaboration en ligne destinée
                aux étudiants. Elle permet de créer des espaces de travail
                partagés, de collaborer en temps réel, et de gérer des sessions
                d&apos;étude de groupe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Inscription et compte utilisateur
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Création de compte</h3>
              <p>
                Pour utiliser certaines fonctionnalités du Service, vous devez
                créer un compte. Vous vous engagez à fournir des informations
                exactes, complètes et à jour lors de votre inscription.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Sécurité du compte</h3>
              <p>
                Vous êtes responsable de la confidentialité de votre mot de
                passe et de toute activité effectuée sous votre compte. Vous
                acceptez de nous notifier immédiatement en cas d&apos;utilisation non
                autorisée de votre compte.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Âge minimum</h3>
              <p>
                Vous devez avoir au moins 13 ans pour utiliser StudySpace. Si
                vous avez entre 13 et 18 ans, vous confirmez avoir obtenu le
                consentement de vos parents ou tuteurs légaux.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Utilisation du service
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Licence d&apos;utilisation</h3>
              <p>
                Sous réserve de votre respect des présentes CGU, nous vous
                accordons une licence limitée, non exclusive, non transférable
                et révocable pour utiliser le Service à des fins personnelles et
                éducatives.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Restrictions d&apos;utilisation</h3>
              <p>Vous vous engagez à ne pas :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Utiliser le Service à des fins illégales ou non autorisées
                </li>
                <li>
                  Tenter d&apos;accéder de manière non autorisée à nos systèmes ou
                  réseaux
                </li>
                <li>
                  Publier, télécharger ou partager du contenu illégal,
                  offensant, diffamatoire ou portant atteinte aux droits
                  d&apos;autrui
                </li>
                <li>
                  Utiliser des robots, scripts ou autres moyens automatisés pour
                  accéder au Service
                </li>
                <li>Perturber ou interférer avec le fonctionnement du Service</li>
                <li>Revendre ou exploiter commercialement le Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Contenu utilisateur</h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Propriété du contenu</h3>
              <p>
                Vous conservez tous les droits sur le contenu que vous créez,
                téléchargez ou partagez sur StudySpace (&quot;Contenu
                Utilisateur&quot;).
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Licence accordée à StudySpace</h3>
              <p>
                En publiant du Contenu Utilisateur, vous accordez à StudySpace
                une licence mondiale, non exclusive, libre de redevances pour
                utiliser, reproduire, modifier et afficher ce contenu
                uniquement dans le but de fournir et améliorer le Service.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Responsabilité du contenu</h3>
              <p>
                Vous êtes seul responsable du Contenu Utilisateur que vous
                publiez. StudySpace ne garantit pas l&apos;exactitude, la qualité ou
                la légalité du Contenu Utilisateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Propriété intellectuelle
              </h2>
              <p>
                Le Service et tous les droits de propriété intellectuelle qui y
                sont associés (incluant mais non limité au logiciel, design,
                textes, graphiques, logos) sont la propriété exclusive de
                StudySpace ou de ses concédants de licence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Abonnements et paiements
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">7.1 Plans d&apos;abonnement</h3>
              <p>
                StudySpace propose un plan gratuit et des plans payants. Les
                tarifs et fonctionnalités de chaque plan sont décrits sur notre
                site web.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.2 Paiements</h3>
              <p>
                Les paiements sont traités par des prestataires tiers sécurisés
                (Stripe). Vous acceptez de fournir des informations de paiement
                exactes et à jour.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.3 Renouvellement automatique</h3>
              <p>
                Les abonnements payants sont renouvelés automatiquement sauf
                annulation de votre part. Vous pouvez annuler à tout moment
                depuis votre compte.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.4 Remboursements</h3>
              <p>
                Les paiements ne sont généralement pas remboursables, sauf en
                cas d&apos;erreur de notre part ou si la loi l&apos;exige.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. Résiliation
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">8.1 Par vous</h3>
              <p>
                Vous pouvez supprimer votre compte à tout moment depuis les
                paramètres de votre compte.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">8.2 Par StudySpace</h3>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre
                accès au Service à tout moment, avec ou sans préavis, en cas de
                violation des présentes CGU ou pour toute autre raison
                légitime.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Limitation de responsabilité
              </h2>
              <p>
                Le Service est fourni &quot;tel quel&quot; et &quot;selon
                disponibilité&quot;. StudySpace ne garantit pas que le Service sera
                ininterrompu, sécurisé ou exempt d&apos;erreurs.
              </p>
              <p className="mt-4">
                Dans la mesure permise par la loi, StudySpace ne sera pas
                responsable des dommages indirects, accessoires, spéciaux ou
                consécutifs résultant de votre utilisation du Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Modifications des CGU
              </h2>
              <p>
                Nous nous réservons le droit de modifier les présentes CGU à
                tout moment. Les modifications entreront en vigueur dès leur
                publication. Votre utilisation continue du Service après la
                publication des modifications constitue votre acceptation des
                nouvelles CGU.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Loi applicable</h2>
              <p>
                Les présentes CGU sont régies par le droit français. Tout litige
                sera soumis à la compétence exclusive des tribunaux français.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
              <p>
                Pour toute question concernant ces CGU, vous pouvez nous
                contacter à :
              </p>
              <ul className="list-none pl-0 mt-4">
                <li>Email : support@studyspace.app</li>
                <li>Formulaire de contact : /contact</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
