/**
 * Files Store - Zustand store for workspace files
 */

import { upload } from "@vercel/blob/client";
import axios from "axios";
import { create } from "zustand";

export interface WorkspaceFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

interface FilesState {
  files: WorkspaceFile[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
}

interface FilesActions {
  fetchFiles: (workspaceId: string) => Promise<void>;
  uploadFile: (workspaceId: string, file: File) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  clearFiles: () => void;
}

export const useFilesStore = create<FilesState & FilesActions>((set, get) => ({
  files: [],
  isLoading: false,
  isUploading: false,
  error: null,

  fetchFiles: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/files?workspaceId=${workspaceId}`);
      set({ files: data.files, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch files",
        isLoading: false,
      });
    }
  },

  uploadFile: async (workspaceId: string, file: File) => {
    set({ isUploading: true, error: null });
    try {
      await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/files/upload",
        clientPayload: JSON.stringify({ workspaceId }),
      });
      // Refresh files list to get the new file with DB info
      await get().fetchFiles(workspaceId);
    } catch (error: any) {
      set({ error: error.message || "Failed to upload file" });
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },

  deleteFile: async (fileId: string) => {
    try {
      await axios.delete(`/api/files/${fileId}`);
      set((state) => ({
        files: state.files.filter((f) => f.id !== fileId),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Failed to delete file" });
      throw error;
    }
  },

  clearFiles: () => {
    set({ files: [], isLoading: false, isUploading: false, error: null });
  },
}));
