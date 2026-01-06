import { CanvasState, EditorState, getErrorMessage } from "@/lib/types";
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
  canvasState: CanvasState | null;
  editorState: EditorState | null;
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
      canvasState?: CanvasState;
      editorState?: EditorState;
    }
  ) => Promise<void>;

  // End a StudySession
  endStudySession: (
    sessionId: string,
    data?: {
      canvasState?: CanvasState;
      editorState?: EditorState;
    }
  ) => Promise<void>;

  // Delete a StudySession
  deleteStudySession: (sessionId: string) => Promise<void>;

  // Yjs state management
  fetchYjsState: (sessionId: string) => Promise<number[] | null>;
  saveYjsState: (sessionId: string, yjsState: number[]) => Promise<void>;

  // Pusher broadcast (server-side events)
  broadcastEvent: (
    channel: string,
    event: string,
    data: unknown
  ) => Promise<boolean>;

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
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
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
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
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
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
      throw error;
    }
  },

  // Update StudySession (auto-save)
  updateStudySession: async (
    sessionId: string,
    updateData: {
      canvasState?: CanvasState;
      editorState?: EditorState;
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
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
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
      canvasState?: CanvasState;
      editorState?: EditorState;
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
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
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
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  // Fetch Yjs state for collaborative editing
  fetchYjsState: async (sessionId: string) => {
    try {
      const { data } = await axios.get(`/api/sessions/${sessionId}/yjs`);
      return data.data.yjsState || null;
    } catch (error: unknown) {
      console.error("Failed to fetch Yjs state:", error);
      return null;
    }
  },

  // Save Yjs state to database
  saveYjsState: async (sessionId: string, yjsState: number[]) => {
    try {
      await axios.post(`/api/sessions/${sessionId}/yjs`, { yjsState });
    } catch (error: unknown) {
      console.error("Failed to save Yjs state:", error);
      // Silent failure for auto-save
    }
  },

  // Broadcast event via server (more reliable than client events)
  broadcastEvent: async (channel: string, event: string, data: unknown) => {
    try {
      await axios.post("/api/pusher/broadcast", { channel, event, data });
      return true;
    } catch (error: unknown) {
      console.error("Failed to broadcast event:", error);
      return false;
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
