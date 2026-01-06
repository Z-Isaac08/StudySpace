"use client";

import { useFiles } from "@/lib/hooks/use-files";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  X,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionFilesPanelProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
}

export function SessionFilesPanel({
  workspaceId,
  isOpen,
  onClose,
}: SessionFilesPanelProps) {
  const { files, isLoading, fetchFiles } = useFiles();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchFiles(workspaceId);
    }
  }, [isOpen, workspaceId, fetchFiles]);

  // Find selected file data
  const selectedFileData = files.find((f) => f.id === selectedFile);
  const isImage = selectedFileData?.mimeType.startsWith("image/");
  const isPdf = selectedFileData?.mimeType === "application/pdf";

  return (
    <div
      className={cn(
        "fixed right-0 top-14 bottom-0 w-96 border-l bg-card shadow-xl",
        "transform transition-transform duration-300 ease-in-out z-40",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
          <span>Fichiers du workspace</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-3.5rem)]">
        {/* File list */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : files.length > 0 ? (
            <div className="space-y-1">
              {files.map((file) => {
                const isActive = selectedFile === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(isActive ? null : file.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md text-left text-sm",
                      "hover:bg-accent transition-colors",
                      isActive && "bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded",
                        file.mimeType.startsWith("image/")
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      )}
                    >
                      {getFileIcon(file.mimeType)}
                    </div>
                    <span className="truncate flex-1">{file.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Aucun fichier</p>
            </div>
          )}
        </div>

        {/* Preview area */}
        {selectedFileData && (
          <div className="border-t p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground truncate flex-1">
                {selectedFileData.name}
              </span>
              <Button variant="ghost" size="sm" className="h-7 gap-1" asChild>
                <a href={selectedFileData.url} target="_blank" rel="noopener">
                  <ExternalLink className="h-3 w-3" />
                  Ouvrir
                </a>
              </Button>
            </div>

            {/* Image preview */}
            {isImage && (
              <div className="rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={selectedFileData.url}
                  alt={selectedFileData.name}
                  className="w-full h-40 object-contain"
                />
              </div>
            )}

            {/* PDF preview */}
            {isPdf && (
              <div className="rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 h-40 flex items-center justify-center">
                <div className="text-center text-muted-foreground text-sm">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>PDF - Cliquer pour ouvrir</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
