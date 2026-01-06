"use client";

import { useFilesStore } from "@/lib/stores/files-store";

/**
 * Hook pour accéder aux fichiers du workspace
 */
export function useFiles() {
  const files = useFilesStore((state) => state.files);
  const isLoading = useFilesStore((state) => state.isLoading);
  const isUploading = useFilesStore((state) => state.isUploading);
  const error = useFilesStore((state) => state.error);
  const fetchFiles = useFilesStore((state) => state.fetchFiles);
  const uploadFile = useFilesStore((state) => state.uploadFile);
  const deleteFile = useFilesStore((state) => state.deleteFile);
  const clearFiles = useFilesStore((state) => state.clearFiles);

  return {
    // État
    files,
    isLoading,
    isUploading,
    error,

    // Actions
    fetchFiles,
    uploadFile,
    deleteFile,
    clearFiles,
  };
}
