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

export interface WorkspaceDetail extends Workspace {
  description: string | null;
  members: Array<{
    id: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  }>;
  studySessions: Array<{
    id: string;
    title: string | null;
    startedAt: string;
    endedAt: string | null;
    duration: number | null;
    createdById: string;
    createdBy: {
      id: string;
      name: string;
    };
  }>;
  files: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
    uploadedBy: {
      id: string;
      name: string;
    };
  }>;
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
  currentWorkspace: WorkspaceDetail | null;
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
  fetchWorkspaceDetail: (id: string) => Promise<WorkspaceDetail>;
  createWorkspace: (data: { name: string; tag: string }) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  joinWorkspace: (inviteCode: string) => Promise<Workspace>;
  addMember: (workspaceId: string, email: string) => Promise<void>;
  removeMember: (workspaceId: string, userId: string) => Promise<void>;
  updateMemberRole: (
    workspaceId: string,
    userId: string,
    role: "OWNER" | "MEMBER"
  ) => Promise<void>;
  clearWorkspaces: () => void;
  clearCurrentWorkspace: () => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    (set) => ({
      // Initial state
      workspaces: [],
      currentWorkspace: null,
      pagination: null,
      isLoading: false,
      error: null,

      // Fetch workspaces with filters
      fetchWorkspaces: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const queryParams = new URLSearchParams();

          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.tag) queryParams.append("tag", params.tag);
          if (params.search) queryParams.append("search", params.search);
          if (params.sortBy) queryParams.append("sortBy", params.sortBy);
          if (params.sortOrder)
            queryParams.append("sortOrder", params.sortOrder);

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

      // Fetch workspace detail
      fetchWorkspaceDetail: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.get(`/api/workspaces/${id}`);
          const workspace = data.data;

          set({
            currentWorkspace: workspace,
            isLoading: false,
          });

          return workspace;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error || "Failed to fetch workspace detail",
            isLoading: false,
          });
          throw error;
        }
      },

      // Add member to workspace
      addMember: async (workspaceId, email) => {
        try {
          await axios.post(`/api/workspaces/${workspaceId}/members`, {
            email,
          });

          // Refresh workspace detail
          const { data } = await axios.get(`/api/workspaces/${workspaceId}`);
          set({ currentWorkspace: data.data });
        } catch (error: any) {
          throw error;
        }
      },

      // Remove member from workspace
      removeMember: async (workspaceId, userId) => {
        try {
          await axios.delete(
            `/api/workspaces/${workspaceId}/members/${userId}`
          );

          // Refresh workspace detail
          const { data } = await axios.get(`/api/workspaces/${workspaceId}`);
          set({ currentWorkspace: data.data });
        } catch (error: any) {
          throw error;
        }
      },

      // Update member role
      updateMemberRole: async (workspaceId, userId, role) => {
        try {
          await axios.patch(`/api/workspaces/${workspaceId}/members`, {
            userId,
            role,
          });

          // Refresh workspace detail
          const { data } = await axios.get(`/api/workspaces/${workspaceId}`);
          set({ currentWorkspace: data.data });
        } catch (error: any) {
          throw error;
        }
      },

      // Clear workspaces (on logout)
      clearWorkspaces: () => {
        set({
          workspaces: [],
          currentWorkspace: null,
          pagination: null,
          isLoading: false,
          error: null,
        });
      },

      // Clear current workspace
      clearCurrentWorkspace: () => {
        set({ currentWorkspace: null });
      },
    }),
    { name: "WorkspaceStore" }
  )
);
