"use client";

import { MotionDiv } from "@/components/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { getErrorMessage } from "@/lib/types";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Lien de réinitialisation invalide ou expiré");
      toast.error("Lien de réinitialisation invalide");
    }
    setToken(tokenParam);
  }, [searchParams]);

  // Password strength check
  const passwordStrength = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  };
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Lien de réinitialisation invalide");
      toast.error("Lien de réinitialisation invalide");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    // Validate password strength
    if (!isPasswordStrong) {
      setError("Le mot de passe ne respecte pas les critères de sécurité");
      toast.error("Le mot de passe ne respecte pas les critères de sécurité");
      return;
    }

    try {
      await resetPassword(token, password);

      setSuccess(true);
      toast.success("Mot de passe réinitialisé avec succès !");
      setTimeout(() => router.push("/login?message=Mot de passe modifié avec succès"), 3000);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
              Mot de passe modifié !
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Votre mot de passe a été réinitialisé avec succès.
            </p>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Redirection vers la page de connexion...
            </p>

            <Link href="/login">
              <Button variant="outline" className="w-full">
                Aller à la connexion maintenant
              </Button>
            </Link>
          </Card>
        </MotionDiv>
      </div>
    );
  }

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
            Nouveau mot de passe
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Choisissez un mot de passe sécurisé
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicators */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        passwordStrength.length
                          ? "text-success-500"
                          : "text-neutral-300"
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.length
                          ? "text-success-600 dark:text-success-400"
                          : "text-neutral-500"
                      }
                    >
                      Au moins 8 caractères
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        passwordStrength.hasLetter
                          ? "text-success-500"
                          : "text-neutral-300"
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.hasLetter
                          ? "text-success-600 dark:text-success-400"
                          : "text-neutral-500"
                      }
                    >
                      Contient une lettre
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        passwordStrength.hasNumber
                          ? "text-success-500"
                          : "text-neutral-300"
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.hasNumber
                          ? "text-success-600 dark:text-success-400"
                          : "text-neutral-500"
                      }
                    >
                      Contient un chiffre
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`pl-10 pr-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary-500 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-error-500 focus:ring-error-500"
                      : confirmPassword && password === confirmPassword
                      ? "border-success-500 focus:ring-success-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 transition-all duration-200"
              disabled={isLoading || !isPasswordStrong}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Modification...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </form>
        </Card>

        {/* Help Section */}
        {!token && error ? (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Le lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Demander un nouveau lien
            </Link>
          </div>
        ) : (
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
