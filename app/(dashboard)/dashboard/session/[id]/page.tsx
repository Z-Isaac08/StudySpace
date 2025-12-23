"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/stores/session-store";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Paintbrush,
  Save,
  Square,
  Type,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const {
    currentSession,
    isLoading,
    isEnding,
    isSaving,
    fetchSession,
    updateSession,
    endSession,
    clearCurrentSession,
  } = useSession();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorContent, setEditorContent] = useState("");
  const [canvasDrawing, setCanvasDrawing] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // Auto-save interval ref
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load session on mount
  useEffect(() => {
    fetchSession(sessionId);

    return () => {
      clearCurrentSession();
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [sessionId, fetchSession, clearCurrentSession]);

  // Initialize canvas and editor from saved state
  useEffect(() => {
    if (!currentSession) return;

    // Restore editor state
    if (currentSession.editorState?.content) {
      setEditorContent(currentSession.editorState.content);
    }

    // Restore canvas state
    if (currentSession.canvasState?.dataURL && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = currentSession.canvasState.dataURL;
      }
    }

    // Setup canvas drawing
    if (canvasRef.current && !currentSession.endedAt) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to match container
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      const startDrawing = (e: MouseEvent) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
      };

      const draw = (e: MouseEvent) => {
        if (!isDrawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
      };

      const stopDrawing = () => {
        isDrawing = false;
      };

      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mouseout", stopDrawing);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mouseout", stopDrawing);
      };
    }
  }, [currentSession]);

  // Auto-save every 60 seconds
  useEffect(() => {
    if (!currentSession || currentSession.endedAt) return;

    const saveSession = async () => {
      const canvasDataURL = canvasRef.current?.toDataURL();

      await updateSession(sessionId, {
        canvasState: canvasDataURL ? { dataURL: canvasDataURL } : undefined,
        editorState: { content: editorContent },
      });

      setLastSaveTime(new Date());
    };

    // Initial save after 5 seconds
    const initialTimeout = setTimeout(saveSession, 10000);

    // Then auto-save every 60 seconds
    autoSaveIntervalRef.current = setInterval(saveSession, 60000);

    return () => {
      clearTimeout(initialTimeout);
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [currentSession, sessionId, editorContent, updateSession]);

  // Manual save
  const handleManualSave = async () => {
    if (!currentSession) return;

    const canvasDataURL = canvasRef.current?.toDataURL();

    await updateSession(sessionId, {
      canvasState: canvasDataURL ? { dataURL: canvasDataURL } : undefined,
      editorState: { content: editorContent },
    });

    setLastSaveTime(new Date());
  };

  // End session
  const handleEndSession = async () => {
    if (!currentSession) return;

    if (
      !confirm(
        "Êtes-vous sûr de vouloir terminer cette session ? L'état actuel sera sauvegardé."
      )
    ) {
      return;
    }

    const canvasDataURL = canvasRef.current?.toDataURL();

    await endSession(sessionId, {
      canvasState: canvasDataURL ? { dataURL: canvasDataURL } : undefined,
      editorState: { content: editorContent },
    });

    toast.success("Session terminée avec succès");

    router.push(`/dashboard/workspace/${currentSession.workspaceId}`);
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Calculate session duration
  const getDuration = () => {
    if (!currentSession) return "0:00";
    const start = new Date(currentSession.startedAt);
    const end = currentSession.endedAt
      ? new Date(currentSession.endedAt)
      : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hours > 0
      ? `${hours}h${mins.toString().padStart(2, "0")}`
      : `${mins}min`;
  };

  if (isLoading || !currentSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Chargement de la session...
          </p>
        </div>
      </div>
    );
  }

  const isEnded = !!currentSession.endedAt;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/workspace/${currentSession.workspaceId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              {currentSession.workspace?.name || "Session"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{getDuration()}</span>
              {isEnded && <span className="text-error-500">• Terminée</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSaveTime && !isEnded && (
            <span className="hidden text-xs text-muted-foreground sm:block">
              Sauvegardé {new Date(lastSaveTime).toLocaleTimeString()}
            </span>
          )}
          {isSaving && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Sauvegarde...
            </span>
          )}
          {!isEnded && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Sauvegarder</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEndSession}
                disabled={isEnding}
                className="gap-2"
              >
                {isEnding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Terminer</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="whiteboard" className="flex h-full flex-col">
          <TabsList className="mx-4 mt-4 sm:mx-6">
            <TabsTrigger value="whiteboard" className="gap-2">
              <Paintbrush className="h-4 w-4" />
              Tableau blanc
            </TabsTrigger>
            <TabsTrigger value="editor" className="gap-2">
              <Type className="h-4 w-4" />
              Éditeur
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="whiteboard"
            className="mt-4 flex-1 px-4 sm:px-6 pb-4"
          >
            <Card className="h-full">
              <CardContent className="relative h-full p-0">
                <canvas
                  ref={canvasRef}
                  className="h-full w-full cursor-default rounded-lg border"
                  style={{ touchAction: "none" }}
                />
                {!isEnded && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCanvas}
                    className="absolute bottom-4 right-4"
                  >
                    Effacer
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="mt-4 flex-1 px-4 sm:px-6 pb-4">
            <Card className="h-full">
              <CardContent className="h-full p-4">
                <Textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Prenez des notes ici..."
                  className="h-full resize-none font-mono text-sm"
                  disabled={isEnded}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
