"use client";

import { toast } from "sonner";

import { CollaborativeEditor } from "@/components/editor/CollaborativeEditor";
import { FloatingSessionHeader } from "@/components/session/FloatingSessionHeader";
import { PrivateNotesEditor } from "@/components/session/PrivateNotesEditor";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@/lib/hooks/use-auth";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useStudySession } from "@/lib/hooks/use-study-session";
import { getPusherClient } from "@/lib/pusher/client";
import { cn } from "@/lib/utils";
import { Loader2, NotebookPen, Paintbrush, Type, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { Channel } from "pusher-js";
import { useEffect, useRef, useState } from "react";

// Tag colors for panel accents
const tagPanelColors: Record<string, { border: string; header: string; icon: string }> = {
  maths: {
    border: "border-tag-maths/30",
    header: "border-b-tag-maths/30",
    icon: "text-tag-maths",
  },
  info: {
    border: "border-tag-info/30",
    header: "border-b-tag-info/30",
    icon: "text-tag-info",
  },
  physique: {
    border: "border-tag-physique/30",
    header: "border-b-tag-physique/30",
    icon: "text-tag-physique",
  },
  chimie: {
    border: "border-tag-chimie/30",
    header: "border-b-tag-chimie/30",
    icon: "text-tag-chimie",
  },
  svt: {
    border: "border-success/30",
    header: "border-b-success/30",
    icon: "text-success",
  },
  langues: {
    border: "border-tag-langues/30",
    header: "border-b-tag-langues/30",
    icon: "text-tag-langues",
  },
  droit: {
    border: "border-tag-droit/30",
    header: "border-b-tag-droit/30",
    icon: "text-tag-droit",
  },
  general: {
    border: "border-tag-general/30",
    header: "border-b-tag-general/30",
    icon: "text-tag-general",
  },
  autre: {
    border: "border-neutral-300",
    header: "border-b-neutral-300",
    icon: "text-neutral-500",
  },
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { user } = useAuth();

  const {
    currentStudySession,
    isLoading,
    isEnding,
    isSaving,
    fetchStudySession,
    updateStudySession,
    endStudySession,
    clearCurrentStudySession,
    saveYjsState,
    broadcastEvent,
  } = useStudySession();

  const { confirm, ConfirmationDialog } = useConfirm();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorContent, setEditorContent] = useState("");
  const [canvasDrawing, setCanvasDrawing] = useState(false);
  const [pusherChannel, setPusherChannel] = useState<Channel | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const ydocRef = useRef<any>(null);

  // Auto-save interval ref
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load session on mount
  useEffect(() => {
    fetchStudySession(sessionId);

    return () => {
      clearCurrentStudySession();
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [sessionId, fetchStudySession, clearCurrentStudySession]);

  // Pusher connection for real-time collaboration (entire session)
  useEffect(() => {
    if (typeof window === "undefined" || !user || !currentStudySession) return;
    if (currentStudySession.endedAt) return; // Don't connect if session ended

    const pusher = getPusherClient();
    const channelName = `presence-session-${sessionId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      console.log("✅ Session connected to Pusher");
      setMemberCount(members.count);
      setPusherChannel(channel);
    });

    channel.bind("pusher:member_added", () => {
      setMemberCount((prev) => prev + 1);
    });

    channel.bind("pusher:member_removed", () => {
      // Use functional update to get the latest memberCount
      setMemberCount((prev) => {
        const newCount = prev - 1;
        // Note: Auto-terminate logic removed - session stays active
        // until explicitly terminated by a member
        return newCount;
      });
    });

    // Listen for session terminated event (server event, no "client-" prefix)
    channel.bind("session-terminated", () => {
      toast.info("La session a été terminée");
      router.push(`/dashboard/workspace/${currentStudySession.workspaceId}`);
    });

    channel.bind("pusher:subscription_error", () => {
      console.error("❌ Failed to connect session to Pusher");
    });

    // Cleanup
    return () => {
      pusher.unsubscribe(channelName);
      setPusherChannel(null);
    };
  }, [sessionId, user, currentStudySession]);

  // Initialize canvas and editor from saved state
  useEffect(() => {
    if (!currentStudySession) return;

    // Restore editor state
    if (currentStudySession.editorState?.content) {
      setEditorContent(currentStudySession.editorState.content);
    }

    // Restore canvas state
    if (currentStudySession.canvasState?.dataURL && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = currentStudySession.canvasState.dataURL;
      }
    }

    // Setup canvas drawing
    if (canvasRef.current && !currentStudySession.endedAt) {
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
  }, [currentStudySession]);

  // Auto-save canvas every 60 seconds (editor auto-saves separately via CollaborativeEditor)
  useEffect(() => {
    if (!currentStudySession || currentStudySession.endedAt) return;

    const saveSession = async () => {
      const canvasDataURL = canvasRef.current?.toDataURL();

      await updateStudySession(sessionId, {
        canvasState: canvasDataURL ? { dataURL: canvasDataURL } : undefined,
      });
    };

    // Initial save after 10 seconds
    const initialTimeout = setTimeout(saveSession, 10000);

    // Then auto-save every 60 seconds
    autoSaveIntervalRef.current = setInterval(saveSession, 60000);

    return () => {
      clearTimeout(initialTimeout);
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [currentStudySession, sessionId, updateStudySession]);

  // Manual save (canvas only - editor auto-saves via CollaborativeEditor)
  const handleManualSave = async () => {
    if (!currentStudySession) return;

    const canvasDataURL = canvasRef.current?.toDataURL();

    await updateStudySession(sessionId, {
      canvasState: canvasDataURL ? { dataURL: canvasDataURL } : undefined,
    });

    toast.success("Canvas sauvegardé");
  };

  // Quit session (leave without terminating for others)
  const handleQuitSession = async () => {
    if (!currentStudySession) return;

    // Check if you're the last member - if so, should terminate instead
    if (memberCount <= 1) {
      const confirmed = await confirm({
        title: "Dernière personne dans la session",
        description:
          "Vous êtes la dernière personne dans cette session. La quitter va la terminer automatiquement. Continuer ?",
        confirmText: "Terminer la session",
        variant: "destructive",
      });

      if (!confirmed) return;

      // Terminate session instead of just quitting
      await handleTerminateSession(true);
      return;
    }

    const confirmed = await confirm({
      title: "Quitter la session",
      description:
        "Voulez-vous quitter la session ? Les autres membres pourront continuer à travailler.",
      confirmText: "Quitter",
      variant: "default",
    });

    if (!confirmed) return;

    try {
      // Save current state before quitting
      const canvasDataURL = canvasRef.current?.toDataURL();

      if (ydocRef.current) {
        const Y = await import("yjs");
        const state = Y.encodeStateAsUpdate(ydocRef.current);
        await saveYjsState(sessionId, Array.from(state));
      }

      // Don't end session, just navigate away
      toast.info("Vous avez quitté la session");
      router.push(`/dashboard/workspace/${currentStudySession.workspaceId}`);
    } catch (error) {
      console.error("Error quitting session:", error);
      toast.error("Erreur lors de la sortie de la session");
    }
  };

  // Terminate session (with final save and broadcast)
  const handleTerminateSession = async (isAutoTerminate = false) => {
    if (!currentStudySession) return;

    // Ask confirmation if manual termination
    if (!isAutoTerminate) {
      const confirmed = await confirm({
        title: "Terminer la session",
        description:
          "Cela va terminer la session pour tous les membres. L'état actuel sera sauvegardé. Continuer ?",
        confirmText: "Terminer",
        variant: "destructive",
      });

      if (!confirmed) return;
    }

    try {
      // Final save: Canvas + Editor + Yjs state
      const canvasDataURL = canvasRef.current?.toDataURL();

      // Save Yjs state if available
      if (ydocRef.current) {
        const Y = await import("yjs");
        const state = Y.encodeStateAsUpdate(ydocRef.current);
        await saveYjsState(sessionId, Array.from(state));
      }

      // End session with final state
      await endStudySession(sessionId, {
        canvasState: canvasDataURL ? { dataURL: canvasDataURL } : undefined,
        editorState: { content: editorContent },
      });

      // Broadcast termination to all members via server
      if (!isAutoTerminate) {
        const channelName = `presence-session-${sessionId}`;
        await broadcastEvent(channelName, "session-terminated", {
          odlUserId: user?.id,
        });
      }

      toast.success(
        isAutoTerminate
          ? "Session terminée automatiquement"
          : "Session terminée avec succès"
      );

      router.push(`/dashboard/workspace/${currentStudySession.workspaceId}`);
    } catch (error) {
      console.error("Failed to terminate session:", error);
      toast.error("Erreur lors de la terminaison de la session");
    }
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
    if (!currentStudySession) return "0:00";
    const start = new Date(currentStudySession.startedAt);
    const end = currentStudySession.endedAt
      ? new Date(currentStudySession.endedAt)
      : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hours > 0
      ? `${hours}h${mins.toString().padStart(2, "0")}`
      : `${mins}min`;
  };

  if (isLoading || !currentStudySession) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Chargement de la session...
          </p>
        </div>
      </div>
    );
  }

  const isEnded = !!currentStudySession.endedAt;
  const workspaceTag = currentStudySession.workspace?.tag || "autre";
  const panelColors = tagPanelColors[workspaceTag] || tagPanelColors.autre;

  return (
    <>
      <ConfirmationDialog />
      <div className="relative flex h-screen flex-col overflow-hidden">
        {/* Floating Header */}
        <FloatingSessionHeader
          workspaceId={currentStudySession.workspaceId}
          workspaceName={currentStudySession.workspace?.name || "Session"}
          workspaceTag={currentStudySession.workspace?.tag}
          duration={getDuration()}
          memberCount={memberCount}
          isEnded={isEnded}
          isSaving={isSaving}
          isEnding={isEnding}
          isNotesOpen={isNotesOpen}
          onSave={handleManualSave}
          onQuit={handleQuitSession}
          onTerminate={() => handleTerminateSession(false)}
          onToggleNotes={() => setIsNotesOpen((prev) => !prev)}
        />

        {/* Main content - Split-screen layout */}
        <div className="flex flex-1 overflow-hidden pt-14 px-2 pb-2">
          <div className={cn(
            "flex-1 transition-all duration-300",
            isNotesOpen ? "mr-80" : ""
          )}>
            <ResizablePanelGroup orientation="horizontal" className="h-full">
            {/* Canvas Panel - 60% */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className={cn(
                "relative h-full rounded-lg border-2 bg-card p-1",
                panelColors.border
              )}>
                {/* Canvas Header */}
                <div className={cn(
                  "flex items-center justify-between px-3 py-2 border-b",
                  panelColors.header
                )}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Paintbrush className={cn("h-4 w-4", panelColors.icon)} />
                    <span className="text-muted-foreground">Canvas</span>
                  </div>
                  {!isEnded && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCanvas}
                      className="h-7 text-xs"
                    >
                      Effacer
                    </Button>
                  )}
                </div>
                {/* Canvas Area */}
                <div className="relative h-[calc(100%-2.5rem)]">
                  <canvas
                    ref={canvasRef}
                    className="h-full w-full cursor-crosshair bg-white"
                    style={{ touchAction: "none" }}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Editor Panel - 40% */}
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className={cn(
                "relative h-full rounded-lg border-2 bg-card p-1",
                panelColors.border
              )}>
                {/* Editor Header */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 border-b text-sm font-medium",
                  panelColors.header
                )}>
                  <Type className={cn("h-4 w-4", panelColors.icon)} />
                  <span className="text-muted-foreground">Éditeur collaboratif</span>
                </div>
                {/* Editor Area */}
                <div className="h-[calc(100%-2.5rem)] overflow-hidden">
                  {user && (
                    <CollaborativeEditor
                      sessionId={sessionId}
                      userId={user.id}
                      userName={user.name}
                      initialContent={editorContent}
                      pusherChannel={pusherChannel}
                      onSave={async (content) => {
                        setEditorContent(content);
                        await updateStudySession(sessionId, {
                          editorState: { content },
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          {/* Notes Sidebar */}
          <div
            className={cn(
              "fixed right-0 top-14 bottom-0 w-80 border-l bg-card shadow-xl",
              "transform transition-transform duration-300 ease-in-out",
              isNotesOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Sidebar Header */}
            <div className={cn(
              "flex items-center justify-between px-4 py-3 border-b",
              panelColors.header
            )}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <NotebookPen className={cn("h-4 w-4", panelColors.icon)} />
                <span className="text-muted-foreground">Mes notes</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsNotesOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Notes Editor */}
            <div className="h-[calc(100%-3.5rem)]">
              {isNotesOpen && (
                <PrivateNotesEditor sessionId={sessionId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
