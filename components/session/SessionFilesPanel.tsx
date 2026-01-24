"use client";

import { Button } from "@/components/ui/button";
import { useFiles } from "@/lib/hooks/use-files";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Monitor,
  X,
} from "lucide-react";
import { useEffect } from "react";

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

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchFiles(workspaceId);
    }
  }, [isOpen, workspaceId, fetchFiles]);

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
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : files.length > 0 ? (
          <div className="space-y-1">
            {files.map((file) => {
              const isImage = file.mimeType.startsWith("image/");
              return (
                <div
                  key={file.id}
                  onClick={() => window.open(file.url, "_blank")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(file.url, "_blank");
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md text-left text-sm",
                    "hover:bg-accent transition-colors group cursor-pointer"
                  )}
                >
                  {/* Thumbnail for images */}
                  {isImage ? (
                    <div className="h-10 w-10 shrink-0 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded",
                        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      )}
                    >
                      {getFileIcon(file.mimeType)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
                    </p>
                  </div>

                  {/* Add to Board Button (Images only) */}
                  {isImage && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors"
                      title="Ajouter au tableau blanc"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the file
                        
                        window.dispatchEvent(
                          new CustomEvent("tldraw-add-image", {
                            detail: {
                              url: file.url,
                              name: file.name,
                              mimeType: file.mimeType,
                            },
                          })
                        );
                        
                        // Close panel on mobile if needed, or visual feedback
                      }}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  )}
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>Aucun fichier</p>
            <p className="text-xs mt-1">
              Ajoutez des fichiers depuis le workspace
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
