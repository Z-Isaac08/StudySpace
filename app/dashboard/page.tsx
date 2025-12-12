"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/stores/auth-store";
import { LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, checkAuth, logout } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              StudySpace
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                {user.name}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {user.email}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Bienvenue, {user.name.split(" ")[0]} ! 👋
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Vos espaces de travail collaboratifs
          </p>
        </div>

        {/* Empty State */}
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Aucun workspace pour l'instant
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Créez votre premier espace de révision collaboratif pour commencer
              !
            </p>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Créer un workspace
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
