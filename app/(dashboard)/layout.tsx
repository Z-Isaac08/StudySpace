"use client";

import { Header } from "@/components/layout/Header";
import { MobileSidebar, Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, signOut, refreshSession } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
      router.push("/login"); // Rediriger quand même
    }
  };

  // Loading state - show while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect (but wait for check)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
      >
        Aller au contenu principal
      </a>

      {/* Desktop Sidebar - hidden on mobile */}
      <Sidebar onLogout={handleLogout} />

      {/* Mobile Sidebar - drawer that opens from left */}
      <MobileSidebar
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        onLogout={handleLogout}
      />

      {/* Main content area - responsive padding */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          user={{ ...user, image: user.image ?? null }}
          onLogout={handleLogout}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Page content */}
        <main id="main-content" className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
