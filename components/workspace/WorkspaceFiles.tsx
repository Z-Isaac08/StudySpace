"use client";

import { useFiles } from "@/lib/hooks/use-files";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  Download,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceFilesProps {
  workspaceId: string;
  fileCount: number;
  isOwner: boolean;
  currentUserId: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5" />;
  }
  return <FileText className="h-5 w-5" />;
}

export function WorkspaceFiles({
  workspaceId,
  isOwner,
  currentUserId,
}: WorkspaceFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { files, isLoading, isUploading, fetchFiles, uploadFile, deleteFile } =
    useFiles();

  useEffect(() => {
    fetchFiles(workspaceId);
  }, [workspaceId, fetchFiles]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Type de fichier non supporté. Utilisez: images ou PDF");
      return;
    }

    try {
      await uploadFile(workspaceId, file);
      toast.success("Fichier uploadé");
    } catch {
      toast.error("Erreur lors de l'upload");
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Supprimer "${fileName}" ?`)) return;

    try {
      await deleteFile(fileId);
      toast.success("Fichier supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Fichiers ({files.length})</CardTitle>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            size="sm"
            className="gap-2"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => {
              const isImage = file.mimeType.startsWith("image/");
              const canDelete =
                file.uploadedBy.id === currentUserId || isOwner;

              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        isImage
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      )}
                    >
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} · Par {file.uploadedBy.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Preview button for images */}
                    {isImage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewUrl(file.url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Download */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={file.url} download={file.name} target="_blank">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>

                    {/* Delete */}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(file.id, file.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Aucun fichier</p>
            <Button
              variant="outline"
              className="mt-4 gap-2"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Ajouter un fichier
            </Button>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
