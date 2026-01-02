"use client";

import { useStudySessionStore } from "@/lib/stores/study-session-store";
import { useShallow } from "zustand/react/shallow";

/**
 * Hook for managing study sessions
 * Provides access to study session state and actions
 * Uses useShallow to prevent unnecessary re-renders
 */
export function useStudySession() {
  // Select state with shallow comparison
  const state = useStudySessionStore(
    useShallow((store) => ({
      currentStudySession: store.currentStudySession,
      studySessions: store.studySessions,
      isLoading: store.isLoading,
      isCreating: store.isCreating,
      isSaving: store.isSaving,
      isEnding: store.isEnding,
      error: store.error,
    }))
  );

  // Select actions separately (they're stable references from zustand)
  const actions = useStudySessionStore(
    useShallow((store) => ({
      fetchStudySessions: store.fetchStudySessions,
      createStudySession: store.createStudySession,
      fetchStudySession: store.fetchStudySession,
      updateStudySession: store.updateStudySession,
      endStudySession: store.endStudySession,
      deleteStudySession: store.deleteStudySession,
      clearCurrentStudySession: store.clearCurrentStudySession,
      clearError: store.clearError,
      fetchYjsState: store.fetchYjsState,
      saveYjsState: store.saveYjsState,
      broadcastEvent: store.broadcastEvent,
    }))
  );

  return {
    ...state,
    ...actions,
  };
}
