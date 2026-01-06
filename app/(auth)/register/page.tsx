"use client";

import { MotionDiv } from "@/components/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { getErrorMessage } from "@/lib/types";
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isLoading } = useAuth();
  const inviteCode = searchParams.get("inviteCode");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

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
      await signUp(email, password, name);

      toast.success("Compte créé ! Vérifiez votre boîte mail pour la vérification.");

      // Redirect to verify-email with email and invite code if present
      const redirectUrl = inviteCode
        ? `/verify-email?email=${encodeURIComponent(
            email
          )}&inviteCode=${inviteCode}`
        : `/verify-email?email=${encodeURIComponent(email)}`;

      router.push(redirectUrl);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Créer un compte
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Rejoignez les 500 early adopters et révisez efficacement
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

          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Nom complet
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
              <Input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Email
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Mot de passe
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
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
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
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
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
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

          {/* Early Adopter Badge */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
              <span className="text-lg">🎁</span>
            </div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-primary-100">
                Gratuit à vie pour les early adopters
              </p>
              <p className="text-sm text-primary-700 dark:text-primary-300 mt-0.5">
                Vous faites partie des 500 premiers utilisateurs !
              </p>
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
                Création en cours...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
            En créant un compte, vous acceptez nos{" "}
            <Link
              href="/terms"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link
              href="/privacy"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Politique de confidentialité
            </Link>
          </p>
        </form>
      </Card>

      {/* Login Link */}
      <p className="mt-6 text-center text-neutral-600 dark:text-neutral-400">
        Déjà un compte ?{" "}
        <Link
          href={inviteCode ? `/login?inviteCode=${inviteCode}` : "/login"}
          className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </MotionDiv>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
