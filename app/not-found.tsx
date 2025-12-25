"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  const homeUrl = isAuthenticated ? "/dashboard" : "/";
  const homeText = isAuthenticated
    ? "Retour au dashboard"
    : "Retour à l'accueil";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
        aria-hidden="true"
      >
        <FileQuestion
          className="h-10 w-10 text-neutral-500 dark:text-neutral-400"
          aria-hidden="true"
        />
      </div>
      <h1
        className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl"
        role="alert"
      >
        Page introuvable
      </h1>
      <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-400">
        Désolé, nous ne trouvons pas la page que vous recherchez.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild>
          <Link href={homeUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {homeText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
