"use client";

/**
 * useConnectionStatus Hook
 * Detects online/offline status and manages connection state
 */

import { useState, useEffect, useCallback } from "react";
import type {
  SyncStatus,
  ConnectionState,
  UseConnectionStatusReturn,
} from "@/lib/types/collaboration";

const initialConnectionState: ConnectionState = {
  status: "connecting",
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  lastSyncedAt: null,
  error: null,
  retryCount: 0,
};

export function useConnectionStatus(): UseConnectionStatusReturn & {
  setStatus: (status: SyncStatus) => void;
  setLastSyncedAt: (timestamp: number) => void;
  setError: (error: Error | null) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
} {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    initialConnectionState
  );

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setConnectionState((prev) => ({
        ...prev,
        isOnline: true,
        status: prev.status === "offline" ? "syncing" : prev.status,
      }));
    };

    const handleOffline = () => {
      setConnectionState((prev) => ({
        ...prev,
        isOnline: false,
        status: "offline",
      }));
    };

    // Set initial state
    if (typeof navigator !== "undefined") {
      setConnectionState((prev) => ({
        ...prev,
        isOnline: navigator.onLine,
      }));
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Set sync status
  const setStatus = useCallback((status: SyncStatus) => {
    setConnectionState((prev) => ({
      ...prev,
      status,
    }));
  }, []);

  // Set last synced timestamp
  const setLastSyncedAt = useCallback((timestamp: number) => {
    setConnectionState((prev) => ({
      ...prev,
      lastSyncedAt: timestamp,
    }));
  }, []);

  // Set error
  const setError = useCallback((error: Error | null) => {
    setConnectionState((prev) => ({
      ...prev,
      error,
      status: error ? "error" : prev.status,
    }));
  }, []);

  // Increment retry count
  const incrementRetry = useCallback(() => {
    setConnectionState((prev) => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  // Reset retry count
  const resetRetry = useCallback(() => {
    setConnectionState((prev) => ({
      ...prev,
      retryCount: 0,
    }));
  }, []);

  return {
    isOnline: connectionState.isOnline,
    syncStatus: connectionState.status,
    connectionState,
    setStatus,
    setLastSyncedAt,
    setError,
    incrementRetry,
    resetRetry,
  };
}
