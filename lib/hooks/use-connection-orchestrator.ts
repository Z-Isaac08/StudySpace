"use client";

/**
 * useConnectionOrchestrator Hook
 * Orchestrates connection status between Pusher (editor) and Tldraw sync (canvas).
 * Provides a unified global status and handles retry logic.
 *
 * Architecture:
 * - Monitors both Pusher and Tldraw connection states
 * - Computes a global status: "connected" | "partial" | "disconnected"
 * - Each system retries independently with exponential backoff
 * - Exposes status for UI banners and component disabling
 */

import { useCallback, useEffect, useMemo, useState } from "react";

// Connection status for individual systems
export type SystemStatus = "connected" | "connecting" | "error" | "offline";

// Global aggregated status
export type GlobalConnectionStatus = "connected" | "partial" | "disconnected";

// Which system is having issues (for UI messaging)
export type PartialReason = "pusher" | "tldraw" | "both" | null;

interface ConnectionOrchestratorState {
  /** Pusher/Yjs connection status */
  pusherStatus: SystemStatus;
  /** Tldraw sync connection status */
  tldrawStatus: SystemStatus;
  /** Aggregated global status */
  globalStatus: GlobalConnectionStatus;
  /** Which system is causing partial/disconnected state */
  partialReason: PartialReason;
  /** Is the browser online? */
  browserOnline: boolean;
}

interface UseConnectionOrchestratorOptions {
  /** Enable tldraw status tracking (set false if tldraw not yet implemented) */
  enableTldraw?: boolean;
}

interface UseConnectionOrchestratorReturn extends ConnectionOrchestratorState {
  /** Update Pusher connection status */
  setPusherStatus: (status: SystemStatus) => void;
  /** Update Tldraw connection status */
  setTldrawStatus: (status: SystemStatus) => void;
  /** Check if editor should be interactive */
  isEditorEnabled: boolean;
  /** Check if canvas should be interactive */
  isCanvasEnabled: boolean;
  /** Force retry both connections */
  retryAll: () => void;
  /** Callbacks for retry - to be set by parent */
  setRetryCallbacks: (callbacks: {
    retryPusher?: () => Promise<void>;
    retryTldraw?: () => Promise<void>;
  }) => void;
}

/**
 * Compute global status from individual system statuses
 */
function computeGlobalStatus(
  pusherStatus: SystemStatus,
  tldrawStatus: SystemStatus,
  enableTldraw: boolean
): { globalStatus: GlobalConnectionStatus; partialReason: PartialReason } {
  const pusherOk = pusherStatus === "connected";
  const tldrawOk = tldrawStatus === "connected" || !enableTldraw;

  if (pusherOk && tldrawOk) {
    return { globalStatus: "connected", partialReason: null };
  }

  if (!pusherOk && !tldrawOk && enableTldraw) {
    return { globalStatus: "disconnected", partialReason: "both" };
  }

  if (!pusherOk) {
    return { globalStatus: "partial", partialReason: "pusher" };
  }

  if (!tldrawOk) {
    return { globalStatus: "partial", partialReason: "tldraw" };
  }

  return { globalStatus: "connected", partialReason: null };
}

export function useConnectionOrchestrator(
  options: UseConnectionOrchestratorOptions = {}
): UseConnectionOrchestratorReturn {
  const { enableTldraw = true } = options;

  // Individual system statuses
  const [pusherStatus, setPusherStatusInternal] =
    useState<SystemStatus>("connecting");
  const [tldrawStatus, setTldrawStatusInternal] = useState<SystemStatus>(
    enableTldraw ? "connecting" : "connected"
  );

  // Browser online status
  const [browserOnline, setBrowserOnline] = useState(true);

  // Retry callbacks (set by parent components)
  const [retryCallbacks, setRetryCallbacksInternal] = useState<{
    retryPusher?: () => Promise<void>;
    retryTldraw?: () => Promise<void>;
  }>({});

  // Monitor browser online/offline
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setBrowserOnline(true);
      console.log("🌐 [ConnectionOrchestrator] Browser online");
    };

    const handleOffline = () => {
      setBrowserOnline(false);
      console.log("📴 [ConnectionOrchestrator] Browser offline");
    };

    // Set initial state
    setBrowserOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update statuses based on browser online state
  useEffect(() => {
    if (!browserOnline) {
      setPusherStatusInternal("offline");
      if (enableTldraw) {
        setTldrawStatusInternal("offline");
      }
    }
  }, [browserOnline, enableTldraw]);

  // Compute global status
  const { globalStatus, partialReason } = useMemo(
    () => computeGlobalStatus(pusherStatus, tldrawStatus, enableTldraw),
    [pusherStatus, tldrawStatus, enableTldraw]
  );

  // Status setters with logging
  const setPusherStatus = useCallback((status: SystemStatus) => {
    console.log(`📡 [ConnectionOrchestrator] Pusher: ${status}`);
    setPusherStatusInternal(status);
  }, []);

  const setTldrawStatus = useCallback(
    (status: SystemStatus) => {
      if (!enableTldraw) return;
      console.log(`🎨 [ConnectionOrchestrator] Tldraw: ${status}`);
      setTldrawStatusInternal(status);
    },
    [enableTldraw]
  );

  // Retry callbacks setter
  const setRetryCallbacks = useCallback(
    (callbacks: {
      retryPusher?: () => Promise<void>;
      retryTldraw?: () => Promise<void>;
    }) => {
      setRetryCallbacksInternal(callbacks);
    },
    []
  );

  // Retry all connections
  const retryAll = useCallback(async () => {
    console.log("🔄 [ConnectionOrchestrator] Retrying all connections...");

    if (pusherStatus !== "connected" && retryCallbacks.retryPusher) {
      setPusherStatusInternal("connecting");
      try {
        await retryCallbacks.retryPusher();
      } catch (error) {
        console.error("[ConnectionOrchestrator] Pusher retry failed:", error);
        setPusherStatusInternal("error");
      }
    }

    if (
      enableTldraw &&
      tldrawStatus !== "connected" &&
      retryCallbacks.retryTldraw
    ) {
      setTldrawStatusInternal("connecting");
      try {
        await retryCallbacks.retryTldraw();
      } catch (error) {
        console.error("[ConnectionOrchestrator] Tldraw retry failed:", error);
        setTldrawStatusInternal("error");
      }
    }
  }, [pusherStatus, tldrawStatus, enableTldraw, retryCallbacks]);

  // Compute if components should be interactive
  const isEditorEnabled =
    pusherStatus === "connected" || pusherStatus === "connecting";
  const isCanvasEnabled =
    !enableTldraw ||
    tldrawStatus === "connected" ||
    tldrawStatus === "connecting";

  // Log global status changes
  useEffect(() => {
    console.log(
      `🔗 [ConnectionOrchestrator] Global: ${globalStatus}${
        partialReason ? ` (${partialReason})` : ""
      }`
    );
  }, [globalStatus, partialReason]);

  return {
    pusherStatus,
    tldrawStatus,
    globalStatus,
    partialReason,
    browserOnline,
    setPusherStatus,
    setTldrawStatus,
    isEditorEnabled,
    isCanvasEnabled,
    retryAll,
    setRetryCallbacks,
  };
}

/**
 * Get user-friendly message for connection status
 */
export function getConnectionMessage(
  globalStatus: GlobalConnectionStatus,
  partialReason: PartialReason
): { title: string; description: string } | null {
  switch (globalStatus) {
    case "connected":
      return null;

    case "partial":
      if (partialReason === "pusher") {
        return {
          title: "Éditeur hors ligne",
          description:
            "L'éditeur collaboratif est temporairement indisponible. Reconnexion en cours...",
        };
      }
      if (partialReason === "tldraw") {
        return {
          title: "Canvas hors ligne",
          description:
            "Le canvas collaboratif est temporairement indisponible. Reconnexion en cours...",
        };
      }
      return null;

    case "disconnected":
      return {
        title: "Connexion perdue",
        description:
          "Impossible de se connecter aux serveurs. Vérifiez votre connexion internet.",
      };

    default:
      return null;
  }
}
