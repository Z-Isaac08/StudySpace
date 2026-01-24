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
import { useSyncDemo } from "@tldraw/sync";
import { Loader2, Paintbrush } from "lucide-react";
import { useEffect, useState } from "react";
import { Tldraw } from "tldraw";
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

    return () => {
      // Cleanup
    };
  }, [store, onConnectionStatusChange]);

  // Handle custom event to add images from outside
  const handleMount = (editor: any) => {
    // Add event listener for adding images
    const handleAddImage = (e: CustomEvent<{ url: string; name: string; mimeType: string }>) => {
      const { url, name, mimeType } = e.detail;
      
      if (!mimeType.startsWith("image/")) {
        return; // Only images for now
      }

      const assetId = `asset:${url}` as any;
      
      // Check if asset already exists
      if (!editor.getAsset(assetId)) {
        editor.createAssets([
          {
            id: assetId,
            type: "image",
            typeName: "asset",
            props: {
              name: name,
              src: url,
              w: 500, // Default width, Tldraw will resize if we knew dimensions
              h: 500, 
              mimeType: mimeType,
              isAnimated: false,
            },
            meta: {},
          },
        ]);
      }

      // Create the shape
      editor.createShapes([
        {
          type: "image",
          x: 100, // Default position
          y: 100,
          props: {
            assetId: assetId,
            w: 500, 
            h: 500,
          },
        },
      ]);
      
      // Center on the new shape
      // editor.zoomToSelection(); // Optional
    };

    window.addEventListener("tldraw-add-image", handleAddImage as EventListener);
    
    // Store cleanup function on the editor instance if possible, or just return cleanup for useEffect
    // But handleMount is a callback.
    // Better to use a separate useEffect if we had reference to editor.
    // Since we don't hold editor ref in state, let's attach to window here but we need cleanup.
    // Tldraw onMount gives us the editor. We should probably store it in a Ref or just use the event listener approach carefully.
    
    // We'll attach the listener to the window object and clean it up when the component unmounts
    // But we need 'editor' in the scope.
    (window as any)._tldrawAddImageHandler = handleAddImage;
  };

  useEffect(() => {
    return () => {
       if ((window as any)._tldrawAddImageHandler) {
         window.removeEventListener("tldraw-add-image", (window as any)._tldrawAddImageHandler);
         delete (window as any)._tldrawAddImageHandler;
       }
    };
  }, []);

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
        onMount={handleMount}
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
