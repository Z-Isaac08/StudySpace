"use client";

import { MotionDiv } from "@/components/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";
import { getErrorMessage } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const verified = searchParams.get("verified") === "true"; // Better Auth ajoute ce param après vérification
  const { sendVerificationEmail, user, refreshSession } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!email) {
      toast.error("Email manquant");
      return;
    }

    setIsResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      await sendVerificationEmail(email);
      setResendSuccess(true);
      toast.success("Email de vérification renvoyé !");
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setResendError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              verified || user?.emailVerified
                ? "bg-success-100 dark:bg-success-900/20"
                : "bg-primary-100 dark:bg-primary-900/20"
            }`}>
              {verified || user?.emailVerified ? (
                <CheckCircle2 className="w-8 h-8 text-success-600 dark:text-success-400" />
              ) : (
                <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            {verified || user?.emailVerified ? "Email vérifié !" : "Vérifiez votre email"}
          </h1>

          {/* Description */}
          {verified || user?.emailVerified ? (
            <div className="mb-6">
              <Alert variant="success" className="mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Votre adresse email a été vérifiée avec succès !
                </AlertDescription>
              </Alert>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Vous pouvez maintenant vous connecter à votre compte.
              </p>
            </div>
          ) : (
            <>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Nous avons envoyé un email de confirmation à{" "}
                {email && (
                  <strong className="text-neutral-900 dark:text-neutral-50 block mt-1">
                    {email}
                  </strong>
                )}
              </p>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6 text-left">
                <p className="text-sm text-primary-900 dark:text-primary-100 font-semibold mb-2">
                  Prochaines étapes :
                </p>
                <ol className="text-sm text-primary-800 dark:text-primary-200 space-y-1 list-decimal list-inside">
                  <li>Ouvrez votre boîte mail</li>
                  <li>Cliquez sur le lien de confirmation</li>
                  <li>Revenez vous connecter</li>
                </ol>
              </div>
            </>
          )}

          {!(verified || user?.emailVerified) && (
            <>
              {/* Resend Success */}
              {resendSuccess && (
                <Alert variant="success" className="mb-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Email renvoyé avec succès !</AlertDescription>
                </Alert>
              )}

              {/* Resend Error */}
              {resendError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{resendError}</AlertDescription>
                </Alert>
              )}

              {/* Resend Button */}
              <Button
                onClick={handleResend}
                disabled={isResending || !email}
                variant="outline"
                className="w-full mb-4"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renvoyer l'email
                  </>
                )}
              </Button>

              {/* Help Text */}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                Vous n'avez pas reçu l'email ? Vérifiez vos spams ou cliquez sur
                "Renvoyer l'email"
              </p>
            </>
          )}

          {/* Back to Login */}
          <Link href="/login">
            <Button variant={verified || user?.emailVerified ? "default" : "ghost"} className="w-full">
              {verified || user?.emailVerified ? "Se connecter" : "Retour à la connexion"}
            </Button>
          </Link>
        </Card>
      </MotionDiv>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
