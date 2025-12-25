"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace-store";

/**
 * Hook for managing workspace list
 * Provides access to workspaces list, pagination, and list-related actions
 */
export function useWorkspaces() {
  const store = useWorkspaceStore();
  return {
    // State
    workspaces: store.workspaces,
    pagination: store.pagination,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    fetchWorkspaces: store.fetchWorkspaces,
    createWorkspace: store.createWorkspace,
    deleteWorkspace: store.deleteWorkspace,
    joinWorkspace: store.joinWorkspace,
    clearWorkspaces: store.clearWorkspaces,
  };
}

/**
 * Hook for managing workspace detail
 * Provides access to current workspace details and member management
 */
export function useWorkspaceDetail() {
  const store = useWorkspaceStore();
  return {
    // State
    workspace: store.currentWorkspace,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    fetchWorkspaceDetail: store.fetchWorkspaceDetail,
    addMember: store.addMember,
    removeMember: store.removeMember,
    updateMemberRole: store.updateMemberRole,
    deleteWorkspace: store.deleteWorkspace,
    clearCurrentWorkspace: store.clearCurrentWorkspace,
  };
}
