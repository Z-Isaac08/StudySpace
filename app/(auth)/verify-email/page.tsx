"use client";

import { MotionDiv } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      await axios.post("/api/auth/resend-verification", { email });
      setResendSuccess(true);
    } catch (err: any) {
      setResendError(
        err.response?.data?.message || "Erreur lors de l'envoi de l'email"
      );
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
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            Vérifiez votre email
          </h1>

          {/* Description */}
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
              📧 Prochaines étapes :
            </p>
            <ol className="text-sm text-primary-800 dark:text-primary-200 space-y-1 list-decimal list-inside">
              <li>Ouvrez votre boîte mail</li>
              <li>Cliquez sur le lien de confirmation</li>
              <li>Revenez vous connecter</li>
            </ol>
          </div>

          {/* Resend Success */}
          {resendSuccess && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 mb-4"
            >
              <div className="flex items-center gap-2 text-success-700 dark:text-success-300">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Email renvoyé avec succès !
                </p>
              </div>
            </MotionDiv>
          )}

          {/* Resend Error */}
          {resendError && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 mb-4"
            >
              <p className="text-sm text-error-700 dark:text-error-300 font-medium">
                {resendError}
              </p>
            </MotionDiv>
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

          {/* Back to Login */}
          <Link href="/login">
            <Button variant="ghost" className="w-full">
              Retour à la connexion
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
