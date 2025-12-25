import axios from "axios";
import { create } from "zustand";

// StudySession type matching Prisma schema
export interface StudySession {
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

interface StudySessionState {
  // Current active StudySession
  currentStudySession: StudySession | null;

  // List of StudySessions for a workspace
  studySessions: StudySession[];

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isSaving: boolean;
  isEnding: boolean;

  // Error state
  error: string | null;
}

interface StudySessionActions {
  // Fetch StudySessions for a workspace
  fetchStudySessions: (workspaceId: string) => Promise<void>;

  // Create and start a new StudySession
  createStudySession: (workspaceId: string) => Promise<StudySession>;

  // Get StudySession by ID
  fetchStudySession: (sessionId: string) => Promise<void>;

  // Update StudySession state (auto-save)
  updateStudySession: (
    sessionId: string,
    data: {
      canvasState?: any;
      editorState?: any;
    }
  ) => Promise<void>;

  // End a StudySession
  endStudySession: (
    sessionId: string,
    data?: {
      canvasState?: any;
      editorState?: any;
    }
  ) => Promise<void>;

  // Delete a StudySession
  deleteStudySession: (sessionId: string) => Promise<void>;

  // Clear current StudySession
  clearCurrentStudySession: () => void;

  // Clear error
  clearError: () => void;
}

type StudySessionStore = StudySessionState & StudySessionActions;

export const useStudySessionStore = create<StudySessionStore>((set, get) => ({
  // Initial state
  currentStudySession: null,
  studySessions: [],
  isLoading: false,
  isCreating: false,
  isSaving: false,
  isEnding: false,
  error: null,

  // Fetch StudySessions for a workspace
  fetchStudySessions: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(
        `/api/sessions?workspaceId=${workspaceId}`
      );
      set({ studySessions: data.data, isLoading: false });
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

  // Create a new StudySession
  createStudySession: async (workspaceId: string) => {
    set({ isCreating: true, error: null });
    try {
      const { data } = await axios.post("/api/sessions", { workspaceId });
      const studySession = data.data;

      set({
        currentStudySession: studySession,
        studySessions: [studySession, ...get().studySessions],
        isCreating: false,
      });

      return studySession;
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

  // Fetch a specific StudySession
  fetchStudySession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/sessions/${sessionId}`);
      set({ currentStudySession: data.data, isLoading: false });
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

  // Update StudySession (auto-save)
  updateStudySession: async (
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
        currentStudySession: updatedSession,
        studySessions: get().studySessions.map((s) =>
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

  // End a StudySession
  endStudySession: async (
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
        currentStudySession: null,
        studySessions: get().studySessions.map((s) =>
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

  // Delete a StudySession
  deleteStudySession: async (sessionId: string) => {
    try {
      await axios.delete(`/api/sessions/${sessionId}`);

      set({
        studySessions: get().studySessions.filter((s) => s.id !== sessionId),
        currentStudySession:
          get().currentStudySession?.id === sessionId ? null : get().currentStudySession,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Erreur lors de la suppression",
      });
      throw error;
    }
  },

  // Clear current StudySession
  clearCurrentStudySession: () => {
    set({ currentStudySession: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
