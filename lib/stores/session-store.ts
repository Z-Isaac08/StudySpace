import axios from "axios";
import { create } from "zustand";

// Session type matching Prisma schema
export interface Session {
  id: string;
  workspaceId: string;
  createdById: string;
  title: string | null;
  startedAt: string;
  endedAt: string | null;
  duration: number | null;
  canvasState: any | null;
  editorState: any | null;
  createdAt: string;
  workspace?: {
    id: string;
    name: string;
    tag?: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string | null;
  };
}

interface SessionState {
  // Current active session
  currentSession: Session | null;

  // List of sessions for a workspace
  sessions: Session[];

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isSaving: boolean;
  isEnding: boolean;

  // Error state
  error: string | null;
}

interface SessionActions {
  // Fetch sessions for a workspace
  fetchSessions: (workspaceId: string) => Promise<void>;

  // Create and start a new session
  createSession: (workspaceId: string) => Promise<Session>;

  // Get session by ID
  fetchSession: (sessionId: string) => Promise<void>;

  // Update session state (auto-save)
  updateSession: (
    sessionId: string,
    data: {
      canvasState?: any;
      editorState?: any;
    }
  ) => Promise<void>;

  // End a session
  endSession: (
    sessionId: string,
    data?: {
      canvasState?: any;
      editorState?: any;
    }
  ) => Promise<void>;

  // Delete a session
  deleteSession: (sessionId: string) => Promise<void>;

  // Clear current session
  clearCurrentSession: () => void;

  // Clear error
  clearError: () => void;
}

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>((set, get) => ({
  // Initial state
  currentSession: null,
  sessions: [],
  isLoading: false,
  isCreating: false,
  isSaving: false,
  isEnding: false,
  error: null,

  // Fetch sessions for a workspace
  fetchSessions: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(
        `/api/sessions?workspaceId=${workspaceId}`
      );
      set({ sessions: data.data, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          "Erreur lors du chargement des sessions",
        isLoading: false,
      });
      throw error;
    }
  },

  // Create a new session
  createSession: async (workspaceId: string) => {
    set({ isCreating: true, error: null });
    try {
      const { data } = await axios.post("/api/sessions", { workspaceId });
      const session = data.data;

      set({
        currentSession: session,
        sessions: [session, ...get().sessions],
        isCreating: false,
      });

      return session;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          "Erreur lors de la création de la session",
        isCreating: false,
      });
      throw error;
    }
  },

  // Fetch a specific session
  fetchSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/sessions/${sessionId}`);
      set({ currentSession: data.data, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          "Erreur lors du chargement de la session",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update session (auto-save)
  updateSession: async (
    sessionId: string,
    updateData: {
      canvasState?: any;
      editorState?: any;
    }
  ) => {
    set({ isSaving: true, error: null });
    try {
      const { data } = await axios.put(
        `/api/sessions/${sessionId}`,
        updateData
      );
      const updatedSession = data.data;

      set({
        currentSession: updatedSession,
        sessions: get().sessions.map((s) =>
          s.id === sessionId ? updatedSession : s
        ),
        isSaving: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Erreur lors de la sauvegarde",
        isSaving: false,
      });
      // Don't throw - auto-save failures should be silent
      console.error("Auto-save failed:", error);
    }
  },

  // End a session
  endSession: async (
    sessionId: string,
    finalData?: {
      canvasState?: any;
      editorState?: any;
    }
  ) => {
    set({ isEnding: true, error: null });
    try {
      const { data } = await axios.put(
        `/api/sessions/${sessionId}/end`,
        finalData || {}
      );
      const endedSession = data.data;

      set({
        currentSession: null,
        sessions: get().sessions.map((s) =>
          s.id === sessionId ? endedSession : s
        ),
        isEnding: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error || "Erreur lors de la fin de la session",
        isEnding: false,
      });
      throw error;
    }
  },

  // Delete a session
  deleteSession: async (sessionId: string) => {
    try {
      await axios.delete(`/api/sessions/${sessionId}`);

      set({
        sessions: get().sessions.filter((s) => s.id !== sessionId),
        currentSession:
          get().currentSession?.id === sessionId ? null : get().currentSession,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Erreur lors de la suppression",
      });
      throw error;
    }
  },

  // Clear current session
  clearCurrentSession: () => {
    set({ currentSession: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Hook for easier usage
export const useSession = () => {
  const store = useSessionStore();
  return {
    currentSession: store.currentSession,
    sessions: store.sessions,
    isLoading: store.isLoading,
    isCreating: store.isCreating,
    isSaving: store.isSaving,
    isEnding: store.isEnding,
    error: store.error,
    fetchSessions: store.fetchSessions,
    createSession: store.createSession,
    fetchSession: store.fetchSession,
    updateSession: store.updateSession,
    endSession: store.endSession,
    deleteSession: store.deleteSession,
    clearCurrentSession: store.clearCurrentSession,
    clearError: store.clearError,
  };
};
