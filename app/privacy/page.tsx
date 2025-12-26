import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | StudySpace",
  description:
    "Politique de confidentialité et protection des données de StudySpace",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                StudySpace (&quot;nous&quot;, &quot;notre&quot;, &quot;nos&quot;) s&apos;engage à
                protéger la vie privée de ses utilisateurs. Cette Politique de
                Confidentialité décrit comment nous collectons, utilisons,
                stockons et protégeons vos données personnelles lorsque vous
                utilisez notre plateforme.
              </p>
              <p className="mt-4">
                En utilisant StudySpace, vous acceptez les pratiques décrites
                dans cette politique.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Données collectées
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">
                2.1 Données fournies par vous
              </h3>
              <p>Nous collectons les informations que vous nous fournissez directement :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Informations de compte</strong> : nom, adresse email,
                  mot de passe (hashé)
                </li>
                <li>
                  <strong>Contenu utilisateur</strong> : notes, fichiers,
                  messages que vous créez ou partagez
                </li>
                <li>
                  <strong>Informations de paiement</strong> : traitées par notre
                  prestataire Stripe (nous ne stockons pas vos données
                  bancaires)
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">
                2.2 Données collectées automatiquement
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Données techniques</strong> : adresse IP, type de
                  navigateur, système d&apos;exploitation, pages visitées
                </li>
                <li>
                  <strong>Données d&apos;utilisation</strong> : sessions d&apos;étude créées,
                  workspaces rejoints, durée des sessions
                </li>
                <li>
                  <strong>Cookies</strong> : pour maintenir votre session et
                  améliorer votre expérience
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Utilisation des données
              </h2>
              <p>Nous utilisons vos données personnelles pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Fournir le service</strong> : créer et gérer votre
                  compte, permettre la collaboration
                </li>
                <li>
                  <strong>Améliorer le service</strong> : analyser l&apos;utilisation,
                  corriger les bugs, développer de nouvelles fonctionnalités
                </li>
                <li>
                  <strong>Communication</strong> : vous envoyer des notifications
                  importantes, newsletters (avec votre consentement)
                </li>
                <li>
                  <strong>Sécurité</strong> : détecter et prévenir les fraudes,
                  abus ou violations
                </li>
                <li>
                  <strong>Obligations légales</strong> : respecter les lois et
                  règlements applicables
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Base légale du traitement (RGPD)
              </h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), nous traitons vos données sur les bases suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Exécution du contrat</strong> : pour fournir le service
                  demandé
                </li>
                <li>
                  <strong>Consentement</strong> : pour les newsletters et
                  communications marketing
                </li>
                <li>
                  <strong>Intérêt légitime</strong> : pour améliorer le service et
                  assurer la sécurité
                </li>
                <li>
                  <strong>Obligation légale</strong> : pour respecter nos
                  obligations légales
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Partage des données
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Nous ne vendons jamais vos données</h3>
              <p>
                StudySpace ne vend, ne loue ni n&apos;échange vos données
                personnelles avec des tiers à des fins marketing.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Partages limités</h3>
              <p>Nous pouvons partager vos données avec :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Prestataires de services</strong> : hébergement
                  (Vercel, Neon), paiement (Stripe), email (Resend)
                </li>
                <li>
                  <strong>Autres utilisateurs</strong> : dans le cadre de la
                  collaboration (workspaces partagés, sessions)
                </li>
                <li>
                  <strong>Autorités légales</strong> : si requis par la loi ou
                  pour protéger nos droits
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Stockage et sécurité
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">6.1 Localisation des données</h3>
              <p>
                Vos données sont stockées sur des serveurs sécurisés en Europe
                (région Frankfurt - Allemagne), conformément au RGPD.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Mesures de sécurité</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Mots de passe hashés avec bcrypt</li>
                <li>Authentification sécurisée avec Better Auth</li>
                <li>Sauvegardes régulières</li>
                <li>Accès restreint aux données par notre équipe</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Durée de conservation</h3>
              <p>
                Nous conservons vos données personnelles tant que votre compte
                est actif ou aussi longtemps que nécessaire pour fournir le
                service. Si vous supprimez votre compte, vos données sont
                supprimées définitivement dans un délai de 30 jours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Vos droits (RGPD)</h2>
              <p>Vous disposez des droits suivants concernant vos données :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Droit d&apos;accès</strong> : obtenir une copie de vos
                  données
                </li>
                <li>
                  <strong>Droit de rectification</strong> : corriger des données
                  inexactes
                </li>
                <li>
                  <strong>Droit à l&apos;effacement</strong> : supprimer vos données
                  (&quot;droit à l&apos;oubli&quot;)
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> : recevoir vos données
                  dans un format structuré
                </li>
                <li>
                  <strong>Droit d&apos;opposition</strong> : vous opposer au
                  traitement de vos données
                </li>
                <li>
                  <strong>Droit de limitation</strong> : limiter le traitement de
                  vos données
                </li>
                <li>
                  <strong>Droit de retirer votre consentement</strong> : pour les
                  traitements basés sur le consentement
                </li>
              </ul>
              <p className="mt-4">
                Pour exercer vos droits, contactez-nous à : privacy@studyspace.app
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">8.1 Types de cookies utilisés</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies essentiels</strong> : nécessaires au
                  fonctionnement (session, authentification)
                </li>
                <li>
                  <strong>Cookies analytiques</strong> : pour comprendre
                  l&apos;utilisation du service (Vercel Analytics)
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">8.2 Gestion des cookies</h3>
              <p>
                Vous pouvez gérer les cookies via les paramètres de votre
                navigateur. Notez que la désactivation des cookies essentiels
                peut affecter le fonctionnement du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Données des mineurs
              </h2>
              <p>
                StudySpace est accessible aux utilisateurs de 13 ans et plus. Si
                vous avez entre 13 et 18 ans, vous devez obtenir le consentement
                de vos parents ou tuteurs légaux.
              </p>
              <p className="mt-4">
                Nous ne collectons pas sciemment de données d&apos;enfants de moins
                de 13 ans. Si nous découvrons qu&apos;un enfant de moins de 13 ans
                nous a fourni des données personnelles, nous les supprimerons
                immédiatement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Modifications de la politique
              </h2>
              <p>
                Nous pouvons modifier cette Politique de Confidentialité de
                temps à autre. En cas de modification importante, nous vous en
                informerons par email ou via une notification sur la plateforme.
              </p>
              <p className="mt-4">
                La version la plus récente est toujours disponible sur cette
                page avec la date de dernière mise à jour.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                11. Transferts internationaux
              </h2>
              <p>
                Vos données sont principalement stockées dans l&apos;Union
                Européenne. Si un transfert hors UE est nécessaire, nous nous
                assurons que des garanties appropriées sont en place
                (clauses contractuelles types de la Commission Européenne).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
              <p>
                Pour toute question concernant cette Politique de
                Confidentialité ou l&apos;exercice de vos droits :
              </p>
              <ul className="list-none pl-0 mt-4">
                <li>
                  <strong>Email</strong> : privacy@studyspace.app
                </li>
                <li>
                  <strong>Délégué à la Protection des Données (DPO)</strong> : dpo@studyspace.app
                </li>
                <li>
                  <strong>Formulaire de contact</strong> : /contact
                </li>
              </ul>

              <p className="mt-4">
                Vous avez également le droit de déposer une plainte auprès de
                la Commission Nationale de l&apos;Informatique et des Libertés
                (CNIL) :
              </p>
              <ul className="list-none pl-0 mt-2">
                <li>Site web : https://www.cnil.fr</li>
                <li>Adresse : 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
