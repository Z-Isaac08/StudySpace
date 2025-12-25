"use client";

import { MotionDiv } from "@/components/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Veuillez entrer votre adresse email");
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccess(true);
      toast.success("Email de réinitialisation envoyé !");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de l'email");
      toast.error(err.message || "Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Mot de passe oublié ?
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Pas de problème ! Nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          {success ? (
            // Success State
            <div className="text-center space-y-4">
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Un email de réinitialisation a été envoyé à{" "}
                  <strong className="font-semibold">{email}</strong>
                </AlertDescription>
              </Alert>

              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 text-left">
                <p className="text-sm text-primary-900 dark:text-primary-100 font-semibold mb-2">
                  Prochaines étapes :
                </p>
                <ol className="text-sm text-primary-800 dark:text-primary-200 space-y-1 list-decimal list-inside">
                  <li>Consultez votre boîte mail</li>
                  <li>Cliquez sur le lien de réinitialisation</li>
                  <li>Créez un nouveau mot de passe</li>
                </ol>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Vous n'avez pas reçu l'email ? Vérifiez vos spams ou réessayez
                dans quelques minutes.
              </p>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Entrez l'adresse email associée à votre compte
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </Button>
            </form>
          )}
        </Card>

        {/* Additional Help */}
        {!success && (
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Connectez-vous
            </Link>
          </p>
        )}
      </MotionDiv>
    </div>
  );
}
