import axios from "axios";
import { create } from "zustand";

// SessionNote type matching Prisma schema
export interface SessionNote {
  id: string | null;
  sessionId: string;
  userId: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface SessionNotesState {
  // Current note for the active session
  currentNote: SessionNote | null;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Last saved timestamp
  lastSavedAt: Date | null;

  // Error state
  error: string | null;
}

interface SessionNotesActions {
  // Fetch notes for current user in a session
  fetchNotes: (sessionId: string) => Promise<void>;

  // Save notes (debounced save)
  saveNotes: (sessionId: string, content: string) => Promise<void>;

  // Clear current note
  clearNotes: () => void;

  // Clear error
  clearError: () => void;
}

type SessionNotesStore = SessionNotesState & SessionNotesActions;

export const useSessionNotesStore = create<SessionNotesStore>((set) => ({
  // Initial state
  currentNote: null,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,
  error: null,

  // Fetch notes for a session
  fetchNotes: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/sessions/${sessionId}/notes`);
      set({
        currentNote: data.data,
        isLoading: false,
        lastSavedAt: data.data?.updatedAt
          ? new Date(data.data.updatedAt)
          : null,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          "Erreur lors du chargement des notes",
        isLoading: false,
      });
    }
  },

  // Save notes
  saveNotes: async (sessionId: string, content: string) => {
    set({ isSaving: true, error: null });
    try {
      const { data } = await axios.put(`/api/sessions/${sessionId}/notes`, {
        content,
      });
      set({
        currentNote: data.data,
        isSaving: false,
        lastSavedAt: new Date(),
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          "Erreur lors de la sauvegarde des notes",
        isSaving: false,
      });
      // Silent failure for auto-save
      console.error("Notes auto-save failed:", error);
    }
  },

  // Clear notes
  clearNotes: () => {
    set({ currentNote: null, lastSavedAt: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
