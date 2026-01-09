"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    url: string;
    mimeType: string;
  } | null;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function FileViewerModal({
  isOpen,
  onClose,
  file,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: FileViewerModalProps) {
  const [zoom, setZoom] = useState(1);

  const isImage = file?.mimeType.startsWith("image/");
  const isPdf = file?.mimeType === "application/pdf";

  // Reset zoom when file changes
  useEffect(() => {
    setZoom(1);
  }, [file?.url]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          if (hasNext && onNext) onNext();
          break;
        case "ArrowLeft":
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case "+":
        case "=":
          setZoom((z) => Math.min(z + 0.25, 3));
          break;
        case "-":
          setZoom((z) => Math.max(z - 0.25, 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 0.25, 0.5));
  }, []);

  if (!isOpen || !file) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-white text-sm font-medium truncate max-w-md">
          {file.name}
        </span>
        <div className="flex items-center gap-1">
          {isImage && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-xs w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-5 bg-white/30 mx-1" />
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              window.open(file.url, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={file.url} download={file.name}>
              <Download className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation arrows */}
      {hasPrevious && onPrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {hasNext && onNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Content */}
      <div
        className="max-w-[90vw] max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isImage && (
          <img
            src={file.url}
            alt={file.name}
            className={cn(
              "max-h-[85vh] object-contain rounded-lg transition-transform duration-200"
            )}
            style={{ transform: `scale(${zoom})` }}
          />
        )}

        {isPdf && (
          <iframe
            src={file.url}
            title={file.name}
            className="w-[80vw] h-[85vh] rounded-lg bg-white"
          />
        )}
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
        Échap pour fermer · Flèches pour naviguer
        {isImage && " · +/- pour zoomer"}
      </div>
    </div>
  );
}
