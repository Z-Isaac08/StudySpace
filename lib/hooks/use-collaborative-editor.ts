"use client";

/**
 * useCollaborativeEditor Hook
 * Orchestrates all collaborative editing functionality
 */

import { useState, useEffect, useRef, useCallback } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import type { Channel } from "pusher-js";
import type {
  SyncStatus,
  CollaborationUser,
  PresenceData,
  CollaborationProvider,
} from "@/lib/types/collaboration";
import { COLLABORATION_CONFIG } from "@/lib/types/collaboration";
import { createYjsDocument, destroyDocument } from "@/lib/yjs/create-document";
import { setAwarenessUser } from "@/lib/yjs/awareness";
import { toUint8Array, toNumberArray, getUserColor } from "@/lib/yjs/utils";
import { PusherProvider } from "@/lib/yjs/pusher-provider";
import { useConnectionStatus } from "./use-connection-status";
import {
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
} from "y-protocols/awareness";

interface UseCollaborativeEditorOptions {
  sessionId: string;
  userId: string;
  userName: string;
  pusherChannel: Channel | null;
  broadcastEvent: (channel: string, event: string, data: unknown) => Promise<boolean>;
  fetchYjsState: (sessionId: string) => Promise<number[] | null>;
  saveYjsState: (sessionId: string, state: number[]) => Promise<void>;
}

interface UseCollaborativeEditorReturn {
  ydoc: Y.Doc | null;
  awareness: Awareness | null;
  provider: CollaborationProvider | null;
  isLoaded: boolean;
  syncStatus: SyncStatus;
  isOnline: boolean;
  lastSyncedAt: number | null;
  forceResync: () => Promise<void>;
  saveState: () => Promise<void>;
}

export function useCollaborativeEditor({
  sessionId,
  userId,
  userName,
  pusherChannel,
  broadcastEvent,
  fetchYjsState,
  saveYjsState,
}: UseCollaborativeEditorOptions): UseCollaborativeEditorReturn {
  // Core refs
  const ydocRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const providerRef = useRef<PusherProvider | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connecting");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // Connection status
  const { isOnline, setStatus, setLastSyncedAt: setConnectionLastSynced } =
    useConnectionStatus();

  // Channel name
  const channelName = `presence-session-${sessionId}`;

  // User color (deterministic)
  const userColor = getUserColor(userId);

  // Create user object
  const user: CollaborationUser = {
    id: userId,
    name: userName,
    color: userColor,
  };

  // Initialize Yjs document and load state
  useEffect(() => {
    const init = async () => {
      // Create document
      const { ydoc, awareness, content } = createYjsDocument({ sessionId });

      ydocRef.current = ydoc;
      awarenessRef.current = awareness;

      // Set user in awareness with deterministic color
      setAwarenessUser(awareness, user, "online");

      // Load initial state
      try {
        const initialState = await fetchYjsState(sessionId);
        if (initialState && initialState.length > 0) {
          const update = toUint8Array(initialState);
          Y.applyUpdate(ydoc, update);
          console.log("📥 Loaded Yjs state from database");
        }
      } catch (error) {
        console.error("Failed to load initial Yjs state:", error);
      }

      setIsLoaded(true);
    };

    init();

    // Cleanup
    return () => {
      if (ydocRef.current && awarenessRef.current) {
        // Save state before destroying
        const state = Y.encodeStateAsUpdate(ydocRef.current);
        saveYjsState(sessionId, toNumberArray(state)).catch(console.error);

        destroyDocument({
          ydoc: ydocRef.current,
          awareness: awarenessRef.current,
          content: ydocRef.current.getXmlFragment("default"),
        });
      }
      ydocRef.current = null;
      awarenessRef.current = null;
    };
  }, [sessionId]); // Only recreate on sessionId change

  // Setup Pusher sync
  useEffect(() => {
    if (!pusherChannel || !ydocRef.current || !awarenessRef.current || !isLoaded) {
      return;
    }

    const ydoc = ydocRef.current;
    const awareness = awarenessRef.current;

    // Create provider
    const provider = new PusherProvider({
      sessionId,
      userId,
      ydoc,
      awareness,
      broadcastEvent,
    });

    providerRef.current = provider;

    // Listen to provider events
    provider.on("status-change", (data: unknown) => {
      const { status } = data as { status: SyncStatus };
      setSyncStatus(status);
      setStatus(status);
    });

    provider.on("remote-update", () => {
      const now = Date.now();
      setLastSyncedAt(now);
      setConnectionLastSynced(now);
    });

    // Bind Pusher events
    const handleYjsUpdate = (data: {
      update: number[];
      userId: string;
      _senderId?: string;
    }) => {
      provider.handleRemoteUpdate(data);
    };

    const handleAwarenessUpdate = (data: {
      update: number[];
      userId: string;
      _senderId?: string;
    }) => {
      provider.handleRemoteAwareness(data);
    };

    const handleSubscriptionSucceeded = async () => {
      console.log("✅ Collaborative editor connected");
      provider.setSyncStatus("synced");
      setSyncStatus("synced");

      // Resync to get any missed updates
      const remoteState = await fetchYjsState(sessionId);
      if (remoteState && remoteState.length > 0) {
        const update = toUint8Array(remoteState);
        Y.applyUpdate(ydoc, update, "resync");
      }
    };

    const handleSubscriptionError = () => {
      console.error("❌ Collaborative editor connection failed");
      provider.setSyncStatus("error");
      setSyncStatus("error");
    };

    pusherChannel.bind("yjs-update", handleYjsUpdate);
    pusherChannel.bind("awareness-update", handleAwarenessUpdate);
    pusherChannel.bind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
    pusherChannel.bind("pusher:subscription_error", handleSubscriptionError);

    // Cleanup
    return () => {
      pusherChannel.unbind("yjs-update", handleYjsUpdate);
      pusherChannel.unbind("awareness-update", handleAwarenessUpdate);
      pusherChannel.unbind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
      pusherChannel.unbind("pusher:subscription_error", handleSubscriptionError);

      provider.destroy();
      providerRef.current = null;
    };
  }, [
    pusherChannel,
    isLoaded,
    sessionId,
    userId,
    broadcastEvent,
    fetchYjsState,
    setStatus,
    setConnectionLastSynced,
  ]);

  // Auto-save periodically
  useEffect(() => {
    if (!ydocRef.current || !isLoaded) return;

    const save = async () => {
      if (ydocRef.current) {
        try {
          const state = Y.encodeStateAsUpdate(ydocRef.current);
          await saveYjsState(sessionId, toNumberArray(state));
          console.log("💾 Auto-saved Yjs state");
        } catch (error) {
          console.error("Failed to auto-save:", error);
        }
      }
    };

    saveIntervalRef.current = setInterval(
      save,
      COLLABORATION_CONFIG.AUTO_SAVE_INTERVAL
    );

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
      // Save on cleanup
      save();
    };
  }, [sessionId, isLoaded, saveYjsState]);

  // Handle online/offline
  useEffect(() => {
    if (!isOnline) {
      setSyncStatus("offline");
    } else if (syncStatus === "offline" && providerRef.current) {
      setSyncStatus("syncing");
      providerRef.current.forceResync(() => fetchYjsState(sessionId));
    }
  }, [isOnline, syncStatus, fetchYjsState, sessionId]);

  // Force resync
  const forceResync = useCallback(async () => {
    if (providerRef.current) {
      await providerRef.current.forceResync(() => fetchYjsState(sessionId));
    }
  }, [fetchYjsState, sessionId]);

  // Manual save
  const saveState = useCallback(async () => {
    if (ydocRef.current) {
      const state = Y.encodeStateAsUpdate(ydocRef.current);
      await saveYjsState(sessionId, toNumberArray(state));
    }
  }, [sessionId, saveYjsState]);

  // Provider object for TipTap
  const provider: CollaborationProvider | null = awarenessRef.current
    ? {
        awareness: awarenessRef.current,
        destroy: () => providerRef.current?.destroy(),
      }
    : null;

  return {
    ydoc: ydocRef.current,
    awareness: awarenessRef.current,
    provider,
    isLoaded,
    syncStatus,
    isOnline,
    lastSyncedAt,
    forceResync,
    saveState,
  };
}
