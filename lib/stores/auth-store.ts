import { getAuthErrorMessage } from "@/lib/auth-errors";
import type { Session, User } from "@/lib/auth/client";
import { authClient } from "@/lib/auth/client";
import { CreateUserSchema, LoginSchema } from "@/lib/validations";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;

  requestPasswordReset: (email: string, redirectTo?: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    revokeOtherSessions?: boolean
  ) => Promise<void>;

  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: (email: string, callbackURL?: string) => Promise<void>;

  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;

  refreshSession: () => Promise<void>;
  clearSession: () => void;

  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        session: null,
        isLoading: false,
        isInitialized: false,

        // ========================================
        // SIGN IN
        // ========================================
        signIn: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const validated = LoginSchema.parse({ email, password });

            const result = await authClient.signIn.email(validated, {
              onError: (ctx) => {
                if (ctx.error.status === 403) {
                  throw new Error(
                    "Veuillez vérifier votre adresse email avant de vous connecter."
                  );
                }
                throw new Error(getAuthErrorMessage(ctx.error));
              },
            });

            if (result.error) {
              throw new Error(getAuthErrorMessage(result.error));
            }
            if (result.data?.user) {
              set({
                user: result.data.user,
                session: null,
              });
              await get().refreshSession();
            }
          } catch (error: any) {
            set({ isLoading: false });
            throw new Error(getAuthErrorMessage(error));
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // SIGN UP
        // ========================================
        signUp: async (email: string, password: string, name?: string) => {
          set({ isLoading: true });
          try {
            const validated = CreateUserSchema.parse({
              email,
              password,
              name: name || email.split("@")[0],
            });

            const result = await authClient.signUp.email({
              ...validated,
              callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
            });

            if (result.error) {
              throw new Error(getAuthErrorMessage(result.error));
            }
          } catch (error: any) {
            set({ isLoading: false });
            throw new Error(getAuthErrorMessage(error));
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // SIGN OUT
        // ========================================
        signOut: async () => {
          set({ isLoading: true });
          try {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  set({
                    user: null,
                    session: null,
                  });
                },
              },
            });
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // REQUEST PASSWORD RESET
        // ========================================
        requestPasswordReset: async (email: string, redirectTo?: string) => {
          set({ isLoading: true });
          try {
            const result = await authClient.requestPasswordReset({
              email,
              redirectTo:
                redirectTo ||
                `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
            });

            if (result.error) {
              throw new Error(
                result.error.message ||
                  "Erreur lors de la demande de réinitialisation"
              );
            }
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // RESET PASSWORD
        // ========================================
        resetPassword: async (token: string, newPassword: string) => {
          set({ isLoading: true });
          try {
            const result = await authClient.resetPassword({
              newPassword,
              token,
            });
            if (result.error) {
              throw new Error(
                result.error.message || "Erreur de réinitialisation"
              );
            }
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // CHANGE PASSWORD
        // ========================================
        changePassword: async (
          currentPassword: string,
          newPassword: string,
          revokeOtherSessions = false
        ) => {
          set({ isLoading: true });
          try {
            const result = await authClient.changePassword({
              currentPassword,
              newPassword,
              revokeOtherSessions,
            });
            if (result.error) {
              throw new Error(
                result.error.message || "Erreur de modification du mot de passe"
              );
            }
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // VERIFY EMAIL (manual SPA flow)
        // ========================================
        verifyEmail: async (token: string) => {
          set({ isLoading: true });
          try {
            const result = await authClient.verifyEmail({
              query: { token },
            });
            if (result.error) {
              throw new Error(result.error.message || "Erreur de vérification");
            }
            // refresh user session after verification
            await get().refreshSession();
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // SEND VERIFICATION EMAIL
        // ========================================
        sendVerificationEmail: async (email: string, callbackURL?: string) => {
          set({ isLoading: true });
          try {
            const result = await authClient.sendVerificationEmail({
              email,
              callbackURL:
                callbackURL ||
                `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
            });
            if (result.error) {
              throw new Error(
                result.error.message ||
                  "Erreur d'envoi de l'email de vérification"
              );
            }
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // UPDATE PROFILE
        // ========================================
        updateProfile: async (data: { name?: string; email?: string }) => {
          set({ isLoading: true });
          try {
            // Update name if provided
            if (data.name) {
              const result = await authClient.updateUser({
                name: data.name,
              });
              if (result.error) {
                throw new Error(
                  result.error.message || "Erreur de mise à jour du nom"
                );
              }
            }

            // Change email if provided (requires separate method)
            if (data.email) {
              const result = await authClient.changeEmail({
                newEmail: data.email,
              });
              if (result.error) {
                throw new Error(
                  result.error.message || "Erreur de mise à jour de l'email"
                );
              }
            }

            // Refresh session to get updated user data
            await get().refreshSession();
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // DELETE ACCOUNT
        // ========================================
        deleteAccount: async (password?: string) => {
          set({ isLoading: true });
          try {
            const result = await authClient.deleteUser({
              password,
            });
            if (result.error) {
              throw new Error(
                result.error.message || "Erreur lors de la suppression du compte"
              );
            }
            // Clear session after successful deletion
            get().clearSession();
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // REFRESH SESSION
        // ========================================
        refreshSession: async () => {
          set({ isLoading: true });
          try {
            const { data } = await authClient.getSession();
            if (data?.user && data?.session) {
              set({
                user: data.user,
                session: data.session,
              });
            } else {
              set({ user: null, session: null });
            }
          } catch {
            set({ user: null, session: null });
          } finally {
            set({ isLoading: false });
          }
        },

        // ========================================
        // CLEAR SESSION
        // ========================================
        clearSession: () => {
          set({ user: null, session: null });
        },

        // ========================================
        // INITIALIZE
        // ========================================
        initialize: async () => {
          if (get().isInitialized) return;
          set({ isLoading: true });
          try {
            await get().refreshSession();
          } finally {
            set({ isLoading: false, isInitialized: true });
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          session: state.session,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);
