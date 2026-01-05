"use client";

/**
 * TldrawCanvas Component
 * Collaborative whiteboard using tldraw with @tldraw/sync
 *
 * Architecture:
 * - Uses @tldraw/sync for real-time collaboration (separate from Yjs+Pusher)
 * - Room ID = session ID (same "room" concept as the study session)
 * - Connection status reported to parent via callbacks
 */

import { cn } from "@/lib/utils";
import { Loader2, Paintbrush } from "lucide-react";
import { useEffect, useState } from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

import type { SystemStatus } from "@/lib/hooks/use-connection-orchestrator";

interface TldrawCanvasProps {
  /** Session ID used as room ID for sync */
  sessionId: string;
  /** User ID for presence */
  userId: string;
  /** User name for presence */
  userName: string;
  /** Callback when connection status changes */
  onConnectionStatusChange?: (status: SystemStatus) => void;
  /** Callback when user focuses the canvas */
  onFocus?: () => void;
  /** Whether the session has ended (read-only mode) */
  isEnded?: boolean;
  /** Is the canvas enabled (from connection orchestrator) */
  isEnabled?: boolean;
  /** Panel colors from workspace tag */
  panelColors?: {
    border: string;
    header: string;
    icon: string;
  };
}

export function TldrawCanvas({
  sessionId,
  userId,
  userName,
  onConnectionStatusChange,
  onFocus,
  isEnded = false,
  isEnabled = true,
}: TldrawCanvasProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use tldraw sync demo for collaboration
  // The roomId should be unique per session
  const roomId = `studyspace-${sessionId}`;

  // useSyncDemo returns a store that handles all sync
  const store = useSyncDemo({
    roomId,
    // User info for presence
    userInfo: {
      id: userId,
      name: userName,
    },
  });

  // Track connection status
  useEffect(() => {
    if (!store) {
      onConnectionStatusChange?.("connecting");
      return;
    }

    // Store is ready, we're connected
    setIsLoading(false);
    onConnectionStatusChange?.("connected");
    setHasError(false);

    // Listen for connection issues
    const handleError = () => {
      setHasError(true);
      onConnectionStatusChange?.("error");
    };

    // tldraw store has events we can listen to
    // For now, we consider having the store as being connected
    // In production, you'd want to hook into actual connection events

    return () => {
      // Cleanup
    };
  }, [store, onConnectionStatusChange]);

  // Loading state
  if (isLoading || !store) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center text-muted-foreground">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-sm">Chargement du canvas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center text-muted-foreground p-8">
          <Paintbrush className={cn("mx-auto h-12 w-12 mb-4 text-red-500")} />
          <h3 className="text-lg font-medium mb-2">Erreur de connexion</h3>
          <p className="text-sm">Impossible de se connecter au canvas collaboratif.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full",
        !isEnabled && "pointer-events-none opacity-50"
      )}
      onPointerDown={onFocus}
    >
      <Tldraw
        store={store}
        // Hide UI elements if session ended (read-only feeling)
        hideUi={isEnded}
        // Tldraw handles its own persistence via the sync store
      />

      {/* Read-only overlay for ended sessions */}
      {isEnded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm">
            Session terminée - Mode lecture seule
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Lightweight placeholder for when tldraw is not yet loaded
 * or when we want to show a preview without the full editor
 */
export function TldrawCanvasPlaceholder({
  panelColors,
}: {
  panelColors?: {
    icon: string;
  };
}) {
  return (
    <div className="flex h-full items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center text-muted-foreground p-8">
        <Paintbrush className={cn("mx-auto h-16 w-16 mb-4", panelColors?.icon)} />
        <h3 className="text-lg font-medium mb-2">Canvas collaboratif</h3>
        <p className="text-sm max-w-md">
          Dessinez, annotez et collaborez en temps réel avec les autres membres de la session.
        </p>
      </div>
    </div>
  );
}
