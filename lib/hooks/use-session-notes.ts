"use client";

import { useCallback } from "react";
import { useSessionNotesStore } from "@/lib/stores/index";

/**
 * Hook for managing private session notes
 * Provides access to notes state and actions
 */
export function useSessionNotes() {
  const {
    currentNote,
    isLoading,
    isSaving,
    lastSavedAt,
    error,
    fetchNotes,
    saveNotes,
    clearNotes,
    clearError,
  } = useSessionNotesStore();

  // Memoized fetch
  const handleFetchNotes = useCallback(
    async (sessionId: string) => {
      await fetchNotes(sessionId);
    },
    [fetchNotes]
  );

  // Memoized save
  const handleSaveNotes = useCallback(
    async (sessionId: string, content: string) => {
      await saveNotes(sessionId, content);
    },
    [saveNotes]
  );

  // Memoized clear
  const handleClearNotes = useCallback(() => {
    clearNotes();
  }, [clearNotes]);

  return {
    // State
    currentNote,
    isLoading,
    isSaving,
    lastSavedAt,
    error,

    // Actions
    fetchNotes: handleFetchNotes,
    saveNotes: handleSaveNotes,
    clearNotes: handleClearNotes,
    clearError,
  };
}
