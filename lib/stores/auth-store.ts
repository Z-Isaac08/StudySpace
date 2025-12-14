import { User } from "@/generated/prisma/client";
import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isLoading: false,
        isAuthenticated: false,

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          }),

        setLoading: (loading) => set({ isLoading: loading }),

        // Login action
        login: async (email, password) => {
          set({ isLoading: true });
          try {
            const { data } = await axios.post("/api/auth/login", {
              email,
              password,
            });

            set({
              user: data.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({ isLoading: false });
            throw new Error(
              error.response?.data?.message || "Erreur lors de la connexion"
            );
          }
        },

        // Register action
        register: async (name, email, password) => {
          set({ isLoading: true });
          try {
            const { data } = await axios.post("/api/auth/register", {
              name,
              email,
              password,
            });

            set({
              user: data.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({ isLoading: false });
            throw new Error(
              error.response?.data?.message || "Erreur lors de l'inscription"
            );
          }
        },

        // Logout action
        logout: async () => {
          set({ isLoading: true });
          try {
            await axios.post("/api/auth/logout");

            // Clear auth state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });

            // Clear workspace store
            const { useWorkspaceStore } = await import("./workspace-store");
            useWorkspaceStore.getState().clearWorkspaces();
          } catch (error: any) {
            set({ isLoading: false });
            throw new Error(
              error.response?.data?.message || "Erreur lors de la déconnexion"
            );
          }
        },

        // Check authentication status
        checkAuth: async () => {
          set({ isLoading: true });
          try {
            const { data } = await axios.get("/api/auth/me");

            set({
              user: data.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },
      }),
      {
        name: "auth-storage",
        // Only persist non-sensitive user info
        partialize: (state) => ({
          user: state.user
            ? {
                id: state.user.id,
                email: state.user.email,
                name: state.user.name,
              }
            : null,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);

// Convenience hook
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
  };
};
