"use client";

import dynamic from "next/dynamic";
import { toast } from "sonner";

import { CollaborativeEditor } from "@/components/editor/CollaborativeEditor";
import { FloatingSessionHeader } from "@/components/session/FloatingSessionHeader";
import { ConnectionStatusBanner } from "@/components/session/ConnectionStatusBanner";
import { PrivateNotesEditor } from "@/components/session/PrivateNotesEditor";
import { SessionFilesPanel } from "@/components/session/SessionFilesPanel";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@/lib/hooks/use-auth";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useStudySession } from "@/lib/hooks/use-study-session";
import { useConnectionOrchestrator, type SystemStatus } from "@/lib/hooks/use-connection-orchestrator";
import { useSessionPresence } from "@/lib/hooks/use-session-presence";
import { getPusherClient } from "@/lib/pusher/client";
import { cn } from "@/lib/utils";
import { Loader2, NotebookPen, Paintbrush, Type, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { Channel } from "pusher-js";
import { useCallback, useEffect, useState } from "react";

// Dynamic import for TldrawCanvas to avoid SSR issues
const TldrawCanvas = dynamic(
  () => import("@/components/canvas/TldrawCanvas").then((mod) => mod.TldrawCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center text-muted-foreground">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-sm">Chargement du canvas...</p>
        </div>
      </div>
    ),
  }
);

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
    fetchYjsState,
    broadcastEvent,
  } = useStudySession();

  const { confirm, ConfirmationDialog } = useConfirm();

  const [editorContent, setEditorContent] = useState("");
  const [pusherChannel, setPusherChannel] = useState<Channel | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Connection orchestrator for coordinating Pusher and Tldraw connections
  const {
    globalStatus,
    partialReason,
    browserOnline,
    setPusherStatus,
    setTldrawStatus,
    isEditorEnabled,
    isCanvasEnabled,
    retryAll,
  } = useConnectionOrchestrator({ enableTldraw: true });

  // Session presence - unified view of all members
  const {
    members,
    setMyLocation,
    isConnected: isPresenceConnected,
  } = useSessionPresence({
    pusherChannel,
    currentUserId: user?.id || "",
  });

  // Handle Tldraw connection status changes
  const handleTldrawConnectionChange = useCallback(
    (status: SystemStatus) => {
      setTldrawStatus(status);
    },
    [setTldrawStatus]
  );

  // Handle retry all connections
  const handleRetryAll = useCallback(async () => {
    setIsRetrying(true);
    try {
      await retryAll();
    } finally {
      setIsRetrying(false);
    }
  }, [retryAll]);

  // Location callbacks - update presence when user focuses editor or canvas
  const handleEditorFocus = useCallback(() => {
    setMyLocation("editor");
  }, [setMyLocation]);

  const handleCanvasFocus = useCallback(() => {
    setMyLocation("canvas");
  }, [setMyLocation]);

  // Load session on mount
  useEffect(() => {
    fetchStudySession(sessionId);

    return () => {
      clearCurrentStudySession();
    };
  }, [sessionId, fetchStudySession, clearCurrentStudySession]);

  // Pusher connection for real-time collaboration (entire session)
  useEffect(() => {
    if (typeof window === "undefined" || !user || !currentStudySession) return;
    if (currentStudySession.endedAt) return; // Don't connect if session ended

    const pusher = getPusherClient();
    const channelName = `presence-session-${sessionId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Session connected to Pusher");
      setPusherChannel(channel);
      setPusherStatus("connected");
    });

    // Listen for session terminated event (server event, no "client-" prefix)
    channel.bind("session-terminated", () => {
      toast.info("La session a été terminée");
      router.push(`/dashboard/workspace/${currentStudySession.workspaceId}`);
    });

    channel.bind("pusher:subscription_error", () => {
      console.error("❌ Failed to connect session to Pusher");
      setPusherStatus("error");
    });

    // Cleanup
    return () => {
      pusher.unsubscribe(channelName);
      setPusherChannel(null);
    };
  }, [sessionId, user, currentStudySession, router, setPusherStatus]);

  // Initialize editor from saved state
  useEffect(() => {
    if (!currentStudySession) return;

    // Restore editor state
    if (currentStudySession.editorState?.content && typeof currentStudySession.editorState.content === "string") {
      setEditorContent(currentStudySession.editorState.content);
    }
    // Note: Canvas state is now handled by tldraw sync - no need to restore manually
  }, [currentStudySession]);

  // Manual save - editor handles its own Yjs state, tldraw handles its own persistence
  const handleManualSave = async () => {
    if (!currentStudySession) return;
    // Note: Editor auto-saves via useCollaborativeEditor, tldraw via @tldraw/sync
    toast.success("Session sauvegardée");
  };

  // Quit session (leave without terminating for others)
  const handleQuitSession = async () => {
    if (!currentStudySession) return;

    // Check if you're the last member - if so, should terminate instead
    if (members.length <= 1) {
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
      // Note: Editor auto-saves via useCollaborativeEditor, tldraw via @tldraw/sync
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
      // Note: Editor auto-saves via useCollaborativeEditor, tldraw via @tldraw/sync

      // End session with final state
      await endStudySession(sessionId, {
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
        {/* Connection Status Banner */}
        <ConnectionStatusBanner
          globalStatus={globalStatus}
          partialReason={partialReason}
          browserOnline={browserOnline}
          onRetry={handleRetryAll}
          isRetrying={isRetrying}
        />

        {/* Floating Header */}
        <FloatingSessionHeader
          workspaceId={currentStudySession.workspaceId}
          workspaceName={currentStudySession.workspace?.name || "Session"}
          workspaceTag={currentStudySession.workspace?.tag}
          duration={getDuration()}
          members={members}
          currentUserId={user?.id || ""}
          isEnded={isEnded}
          isSaving={isSaving}
          isEnding={isEnding}
          isNotesOpen={isNotesOpen}
          isFilesOpen={isFilesOpen}
          onSave={handleManualSave}
          onQuit={handleQuitSession}
          onTerminate={() => handleTerminateSession(false)}
          onToggleNotes={() => setIsNotesOpen((prev) => !prev)}
          onToggleFiles={() => setIsFilesOpen((prev) => !prev)}
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
                "relative h-full rounded-lg border-2 bg-card overflow-hidden",
                panelColors.border,
                !isCanvasEnabled && "opacity-50"
              )}>
                {/* Canvas Header */}
                <div className={cn(
                  "flex items-center justify-between px-3 py-2 border-b",
                  panelColors.header
                )}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Paintbrush className={cn("h-4 w-4", panelColors.icon)} />
                    <span className="text-muted-foreground">Canvas collaboratif</span>
                  </div>
                  {/* Tldraw has its own toolbar, no need for custom buttons */}
                </div>
                {/* Canvas Area - TldrawCanvas */}
                <div className="relative h-[calc(100%-2.5rem)]">
                  {user && (
                    <TldrawCanvas
                      sessionId={sessionId}
                      userId={user.id}
                      userName={user.name}
                      onConnectionStatusChange={handleTldrawConnectionChange}
                      onFocus={handleCanvasFocus}
                      isEnded={isEnded}
                      isEnabled={isCanvasEnabled}
                      panelColors={panelColors}
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Editor Panel - 40% */}
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className={cn(
                "relative h-full rounded-lg border-2 bg-card p-1",
                panelColors.border,
                !isEditorEnabled && "opacity-50 pointer-events-none"
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
                      onFocus={handleEditorFocus}
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

          {/* Files Panel */}
          <SessionFilesPanel
            workspaceId={currentStudySession.workspaceId}
            isOpen={isFilesOpen}
            onClose={() => setIsFilesOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
