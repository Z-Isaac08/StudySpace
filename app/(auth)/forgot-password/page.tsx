"use client";

import { MotionDiv } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post("/api/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex items-center justify-center px-6 py-12"
      >
        <Card className="w-full max-w-md p-8 text-center border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            Email envoyé !
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Nous avons envoyé un lien de réinitialisation à{" "}
            <strong className="text-neutral-900 dark:text-neutral-50">
              {email}
            </strong>
          </p>

          <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
            <p className="text-sm text-primary-900 dark:text-primary-100">
              📧 Vérifiez votre boîte mail et cliquez sur le lien pour
              réinitialiser votre mot de passe.
            </p>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Le lien expire dans 1 heure.
          </p>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </Link>
        </Card>
      </MotionDiv>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-neutral-50 dark:bg-neutral-950">
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
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800"
              >
                <p className="text-sm text-error-700 dark:text-error-300 font-medium">
                  {error}
                </p>
              </MotionDiv>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Email
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
                "Envoyer le lien"
              )}
            </Button>
          </form>
        </Card>

        {/* Back to Login */}
        <p className="mt-6 text-center text-neutral-600 dark:text-neutral-400">
          <Link
            href="/login"
            className="font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </p>
      </MotionDiv>
    </div>
  );
}
