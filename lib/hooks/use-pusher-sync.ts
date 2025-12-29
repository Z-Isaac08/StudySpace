"use client";

/**
 * usePusherSync Hook
 * Manages Pusher synchronization for Yjs documents
 */

import { useEffect, useRef, useCallback, useState } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import type { Channel } from "pusher-js";
import type {
  SyncStatus,
  UsePusherSyncReturn,
  YjsUpdateEvent,
  AwarenessUpdateEvent,
} from "@/lib/types/collaboration";
import { PusherProvider } from "@/lib/yjs/pusher-provider";
import { useConnectionStatus } from "./use-connection-status";

interface UsePusherSyncOptions {
  sessionId: string;
  userId: string;
  ydoc: Y.Doc | null;
  awareness: Awareness | null;
  pusherChannel: Channel | null;
  broadcastEvent: (channel: string, event: string, data: unknown) => Promise<boolean>;
  fetchYjsState: () => Promise<number[] | null>;
}

export function usePusherSync({
  sessionId,
  userId,
  ydoc,
  awareness,
  pusherChannel,
  broadcastEvent,
  fetchYjsState,
}: UsePusherSyncOptions): UsePusherSyncReturn {
  const providerRef = useRef<PusherProvider | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connecting");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const {
    isOnline,
    setStatus: setConnectionStatus,
    setLastSyncedAt: setConnectionLastSynced,
  } = useConnectionStatus();

  // Initialize provider and bind Pusher events
  useEffect(() => {
    if (!ydoc || !awareness || !pusherChannel) {
      return;
    }

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
      setConnectionStatus(status);
    });

    provider.on("remote-update", () => {
      const now = Date.now();
      setLastSyncedAt(now);
      setConnectionLastSynced(now);
    });

    // Bind Pusher channel events
    const handleYjsUpdate = (data: YjsUpdateEvent) => {
      provider.handleRemoteUpdate(data);
    };

    const handleAwarenessUpdate = (data: AwarenessUpdateEvent) => {
      provider.handleRemoteAwareness(data);
    };

    const handleSubscriptionSucceeded = () => {
      console.log("✅ Pusher sync connected");
      provider.setSyncStatus("synced");

      // Resync on connection to get any missed updates
      provider.forceResync(fetchYjsState);
    };

    const handleSubscriptionError = () => {
      console.error("❌ Pusher sync connection failed");
      provider.setSyncStatus("error");
    };

    // Bind events
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
    sessionId,
    userId,
    ydoc,
    awareness,
    pusherChannel,
    broadcastEvent,
    fetchYjsState,
    setConnectionStatus,
    setConnectionLastSynced,
  ]);

  // Handle online/offline status changes
  useEffect(() => {
    if (!isOnline) {
      setSyncStatus("offline");
    } else if (providerRef.current && syncStatus === "offline") {
      // Coming back online - trigger resync
      setSyncStatus("syncing");
      providerRef.current.forceResync(fetchYjsState);
    }
  }, [isOnline, syncStatus, fetchYjsState]);

  // Force resync function
  const forceResync = useCallback(async () => {
    if (providerRef.current) {
      await providerRef.current.forceResync(fetchYjsState);
    }
  }, [fetchYjsState]);

  return {
    syncStatus,
    isConnected: syncStatus === "synced",
    lastSyncedAt,
    forceResync,
  };
}
