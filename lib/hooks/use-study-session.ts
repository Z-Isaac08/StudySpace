"use client";

import { useStudySessionStore } from "@/lib/stores/study-session-store";

/**
 * Hook for managing study sessions
 * Provides access to study session state and actions
 */
export function useStudySession() {
  const store = useStudySessionStore();
  return {
    // State
    currentStudySession: store.currentStudySession,
    studySessions: store.studySessions,
    isLoading: store.isLoading,
    isCreating: store.isCreating,
    isSaving: store.isSaving,
    isEnding: store.isEnding,
    error: store.error,

    // Actions
    fetchStudySessions: store.fetchStudySessions,
    createStudySession: store.createStudySession,
    fetchStudySession: store.fetchStudySession,
    updateStudySession: store.updateStudySession,
    endStudySession: store.endStudySession,
    deleteStudySession: store.deleteStudySession,
    clearCurrentStudySession: store.clearCurrentStudySession,
    clearError: store.clearError,

    // Yjs actions
    fetchYjsState: store.fetchYjsState,
    saveYjsState: store.saveYjsState,

    // Pusher broadcast (server-side events)
    broadcastEvent: store.broadcastEvent,
  };
}
