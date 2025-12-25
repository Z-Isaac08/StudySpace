"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

/**
 * Provider qui initialise l'auth au chargement de l'app
 * À placer dans le layout racine
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize once on mount, no dependencies to avoid infinite loops
    useAuthStore.getState().initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
