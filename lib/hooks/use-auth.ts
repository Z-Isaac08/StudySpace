"use client";

import { useAuthStore } from "@/lib/stores/auth-store";

/**
 * Hook personnalisé pour accéder facilement à l'auth
 * Note: L'initialisation est gérée par AuthProvider dans le layout racine
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const signOut = useAuthStore((state) => state.signOut);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const changePassword = useAuthStore((state) => state.changePassword);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const sendVerificationEmail = useAuthStore((state) => state.sendVerificationEmail);
  const refreshSession = useAuthStore((state) => state.refreshSession);

  return {
    // État
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified ?? false,

    // Actions
    signIn,
    signUp,
    signOut,

    // Password management
    requestPasswordReset,
    resetPassword,
    changePassword,

    // Email verification
    verifyEmail,
    sendVerificationEmail,

    // Session
    refreshSession,
  };
}
