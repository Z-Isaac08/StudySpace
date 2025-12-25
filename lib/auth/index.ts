import { EMAIL_CONFIG, resend } from "@/lib/email/resend";
import ResetPasswordEmail from "@/lib/email/templates/reset-password-email";
import VerificationEmail from "@/lib/email/templates/verification-email";
import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour

    sendResetPassword: async ({ user, url, token }, request) => {
      // En développement, toujours afficher le lien dans la console
      if (process.env.NODE_ENV !== "production") {
        console.log("=".repeat(80));
        console.log("🔐 EMAIL DE RESET (DEV MODE)");
        console.log("Pour:", user.email);
        console.log("Lien de réinitialisation:", url);
        console.log("=".repeat(80));
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
          console.error("Erreur envoi email reset:", error);
          throw error;
        }

        console.log("✅ Email de reset envoyé:", data?.id);
      } catch (error) {
        console.error("Erreur critique envoi email:", error);
        throw error;
      }
    },

    onPasswordReset: async ({ user }, request) => {
      console.log(`✅ Mot de passe réinitialisé pour: ${user.email}`);
    },
  },

  emailVerification: {
    sendOnSignUp: true, // Toujours envoyer pour afficher le lien en dev
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      // En développement, toujours afficher le lien dans la console
      if (process.env.NODE_ENV !== "production") {
        console.log("=".repeat(80));
        console.log("📧 EMAIL DE VÉRIFICATION (DEV MODE)");
        console.log("Pour:", user.email);
        console.log("Lien de vérification:", url);
        console.log("=".repeat(80));
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
          console.error("Erreur envoi email vérification:", error);
          throw error;
        }

        console.log("✅ Email de vérification envoyé:", data?.id);
      } catch (error) {
        console.error("Erreur critique envoi email:", error);
        throw error;
      }
    },
  },
});
