"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect } from "react";

/**
 * Hook personnalisé pour accéder facilement à l'auth
 * et initialiser la session au montage du composant
 */
export function useAuth() {
  const store = useAuthStore();

  // Initialiser la session au premier render
  useEffect(() => {
    if (!store.isInitialized) {
      store.initialize();
    }
  }, [store]);

  return {
    // État
    user: store.user,
    session: store.session,
    isLoading: store.isLoading,
    isAuthenticated: !!store.user,
    isEmailVerified: store.user?.emailVerified ?? false,

    // Actions
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,

    // Password management
    requestPasswordReset: store.requestPasswordReset,
    resetPassword: store.resetPassword,
    changePassword: store.changePassword,

    // Email verification
    verifyEmail: store.verifyEmail,
    sendVerificationEmail: store.sendVerificationEmail,

    // Session
    refreshSession: store.refreshSession,
  };
}
