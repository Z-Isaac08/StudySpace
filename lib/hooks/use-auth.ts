"use client";

import { useAuthStore } from "@/lib/stores";

/**
 * Hook personnalisé pour accéder facilement à l'auth
 * Note: L'initialisation est gérée par AuthProvider dans le layout racine
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const signOut = useAuthStore((state) => state.signOut);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const changePassword = useAuthStore((state) => state.changePassword);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const sendVerificationEmail = useAuthStore((state) => state.sendVerificationEmail);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const refreshSession = useAuthStore((state) => state.refreshSession);

  return {
    // État
    user,
    session,
    isLoading,
    isInitialized,
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

    // Profile management
    updateProfile,
    deleteAccount,

    // Session
    refreshSession,
  };
}
