import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Workspace {
  id: string;
  name: string;
  tag: string;
  inviteCode: string;
  userRole: "OWNER" | "MEMBER";
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    sessions: number;
    files: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface WorkspaceState {
  workspaces: Workspace[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
}

interface WorkspaceActions {
  fetchWorkspaces: (params?: {
    page?: number;
    limit?: number;
    tag?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;
  createWorkspace: (data: { name: string; tag: string }) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  joinWorkspace: (inviteCode: string) => Promise<Workspace>;
  clearWorkspaces: () => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      workspaces: [],
      pagination: null,
      isLoading: false,
      error: null,

      // Fetch workspaces with filters
      fetchWorkspaces: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const queryParams = new URLSearchParams();

          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.tag) queryParams.append("tag", params.tag);
          if (params.search) queryParams.append("search", params.search);
          if (params.sortBy) queryParams.append("sortBy", params.sortBy);
          if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

          const { data } = await axios.get(
            `/api/workspaces?${queryParams.toString()}`
          );

          set({
            workspaces: data.data.data || [],
            pagination: data.data.pagination,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.error || "Failed to fetch workspaces",
            isLoading: false,
          });
          throw error;
        }
      },

      // Create workspace
      createWorkspace: async (workspaceData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post("/api/workspaces", workspaceData);
          const newWorkspace = data.data;

          // Add to local state
          set((state) => ({
            workspaces: [newWorkspace, ...state.workspaces],
            isLoading: false,
          }));

          return newWorkspace;
        } catch (error: any) {
          set({
            error: error.response?.data?.error || "Failed to create workspace",
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete workspace
      deleteWorkspace: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`/api/workspaces/${id}`);

          // Remove from local state
          set((state) => ({
            workspaces: state.workspaces.filter((w) => w.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.error || "Failed to delete workspace",
            isLoading: false,
          });
          throw error;
        }
      },

      // Join workspace
      joinWorkspace: async (inviteCode) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post("/api/workspaces/join", {
            inviteCode: inviteCode.toUpperCase(),
          });
          const newWorkspace = data.data;

          // Add to local state
          set((state) => ({
            workspaces: [newWorkspace, ...state.workspaces],
            isLoading: false,
          }));

          return newWorkspace;
        } catch (error: any) {
          set({
            error: error.response?.data?.error || "Failed to join workspace",
            isLoading: false,
          });
          throw error;
        }
      },

      // Clear workspaces (on logout)
      clearWorkspaces: () => {
        set({
          workspaces: [],
          pagination: null,
          isLoading: false,
          error: null,
        });
      },
    }),
    { name: "WorkspaceStore" }
  )
);

// Convenience hook
export const useWorkspaces = () => {
  const store = useWorkspaceStore();
  return {
    workspaces: store.workspaces,
    pagination: store.pagination,
    isLoading: store.isLoading,
    error: store.error,
    fetchWorkspaces: store.fetchWorkspaces,
    createWorkspace: store.createWorkspace,
    deleteWorkspace: store.deleteWorkspace,
    joinWorkspace: store.joinWorkspace,
    clearWorkspaces: store.clearWorkspaces,
  };
};
