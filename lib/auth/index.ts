import { EMAIL_CONFIG, resend } from "@/lib/email/resend";
import ChangeEmailTemplate from "@/lib/email/templates/change-email";
import ResetPasswordEmail from "@/lib/email/templates/reset-password-email";
import VerificationEmail from "@/lib/email/templates/verification-email";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days - durée totale de la session
    updateAge: 60 * 60 * 24, // 1 day - refresh la session si utilisée après 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes - durée du cache avant re-vérification DB
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour

    sendResetPassword: async ({ user, url, token }, request) => {
      // En développement, toujours afficher le lien dans la console
      if (process.env.NODE_ENV !== "production") {
        logger.log("=".repeat(80));
        logger.log("🔐 EMAIL DE RESET (DEV MODE)");
        logger.log("Pour:", user.email);
        logger.log("Lien de réinitialisation:", url);
        logger.log("=".repeat(80));
        return; // Ne pas envoyer d'email en dev
      }

      // En production, envoyer l'email réel
      try {
        const { data, error } = await resend.emails.send({
          from: `${EMAIL_CONFIG.from}`,
          to: user.email,
          subject: "Réinitialisation de votre mot de passe",
          react: ResetPasswordEmail({
            resetUrl: url,
            name: user.name || user.email,
          }),
        });

        if (error) {
          logger.error("Erreur envoi email reset:", error);
          throw error;
        }

        logger.info("✅ Email de reset envoyé:", data?.id);
      } catch (error) {
        logger.error("Erreur critique envoi email:", error);
        throw error;
      }
    },

    onPasswordReset: async ({ user }, request) => {
      logger.info(`✅ Mot de passe réinitialisé pour: ${user.email}`);
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
        // En développement, toujours afficher le lien dans la console
        if (process.env.NODE_ENV !== "production") {
          logger.log("=".repeat(80));
          logger.log("📧 CHANGEMENT D'EMAIL (DEV MODE)");
          logger.log("Utilisateur:", user.email);
          logger.log("Nouvel email:", newEmail);
          logger.log("Lien de vérification:", url);
          logger.log("=".repeat(80));
          return; // Ne pas envoyer d'email en dev
        }

        // En production, envoyer l'email réel au NOUVEAU email
        try {
          const { data, error } = await resend.emails.send({
            from: `${EMAIL_CONFIG.from}`,
            to: newEmail, // Important: envoyer au NOUVEAU email
            subject: "Vérifiez votre nouvelle adresse email",
            react: ChangeEmailTemplate({
              verificationUrl: url,
              newEmail: newEmail,
              name: user.name || user.email,
            }),
          });

          if (error) {
            logger.error("Erreur envoi email changement:", error);
            throw error;
          }

          logger.info("✅ Email de changement envoyé à:", newEmail, "- ID:", data?.id);
        } catch (error) {
          logger.error("Erreur critique envoi email:", error);
          throw error;
        }
      },
    },
  },

  emailVerification: {
    sendOnSignUp: true, // Toujours envoyer pour afficher le lien en dev
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      // En développement, toujours afficher le lien dans la console
      if (process.env.NODE_ENV !== "production") {
        logger.log("=".repeat(80));
        logger.log("📧 EMAIL DE VÉRIFICATION (DEV MODE)");
        logger.log("Pour:", user.email);
        logger.log("Lien de vérification:", url);
        logger.log("=".repeat(80));
        return; // Ne pas envoyer d'email en dev
      }

      // En production, envoyer l'email réel
      try {
        const { data, error } = await resend.emails.send({
          from: `${EMAIL_CONFIG.from}`,
          to: user.email,
          subject: "Vérifiez votre adresse email",
          react: VerificationEmail({
            verificationUrl: url,
            name: user.name || user.email,
          }),
        });

        if (error) {
          logger.error("Erreur envoi email vérification:", error);
          throw error;
        }

        logger.info("✅ Email de vérification envoyé:", data?.id);
      } catch (error) {
        logger.error("Erreur critique envoi email:", error);
        throw error;
      }
    },
  },
});
