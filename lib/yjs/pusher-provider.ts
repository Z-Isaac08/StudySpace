"use client";

/**
 * PusherProvider - Yjs Provider using Pusher for transport
 * StudySpace - Collaborative Editing
 */

import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import {
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
} from "y-protocols/awareness";
import type {
  PusherProviderConfig,
  SyncStatus,
  YjsUpdateEvent,
  AwarenessUpdateEvent,
} from "@/lib/types/collaboration";
import { toUint8Array, toNumberArray, debounce, getBackoffDelay } from "./utils";
import { COLLABORATION_CONFIG } from "@/lib/types/collaboration";

type ProviderEventCallback = (data: unknown) => void;

/**
 * PusherProvider class - manages Yjs sync over Pusher
 */
export class PusherProvider {
  private sessionId: string;
  private userId: string;
  private ydoc: Y.Doc;
  private awareness: Awareness;
  private broadcastEvent: (channel: string, event: string, data: unknown) => Promise<boolean>;
  private channelName: string;

  private _syncStatus: SyncStatus = "connecting";
  private _lastSyncedAt: number | null = null;
  private _isDestroyed = false;
  private _retryCount = 0;

  private updateHandler: ((update: Uint8Array, origin: unknown) => void) | null = null;
  private awarenessHandler: ((changes: { added: number[]; updated: number[]; removed: number[] }, origin: string | null) => void) | null = null;

  private eventCallbacks: Map<string, Set<ProviderEventCallback>> = new Map();
  private debouncedBroadcast: ReturnType<typeof debounce>;

  constructor(config: PusherProviderConfig) {
    this.sessionId = config.sessionId;
    this.userId = config.userId;
    this.ydoc = config.ydoc;
    this.awareness = config.awareness;
    this.broadcastEvent = config.broadcastEvent;
    this.channelName = `presence-session-${this.sessionId}`;

    // Create debounced broadcast function
    this.debouncedBroadcast = debounce(
      (event: string, data: unknown) => {
        if (!this._isDestroyed) {
          this.broadcastEvent(this.channelName, event, data);
        }
      },
      COLLABORATION_CONFIG.BROADCAST_DEBOUNCE
    );

    this.setupHandlers();
  }

  /**
   * Get current sync status
   */
  get syncStatus(): SyncStatus {
    return this._syncStatus;
  }

  /**
   * Get last synced timestamp
   */
  get lastSyncedAt(): number | null {
    return this._lastSyncedAt;
  }

  /**
   * Get retry count
   */
  get retryCount(): number {
    return this._retryCount;
  }

  /**
   * Setup Yjs and Awareness event handlers
   */
  private setupHandlers(): void {
    // Handle local Yjs updates
    this.updateHandler = (update: Uint8Array, origin: unknown) => {
      // Don't broadcast updates that came from remote
      if (origin === "remote" || origin === "pusher" || origin === "resync") {
        return;
      }

      // Broadcast to other clients
      this.broadcastEvent(this.channelName, "yjs-update", {
        update: toNumberArray(update),
        userId: this.userId,
      });

      this._lastSyncedAt = Date.now();
      this._syncStatus = "synced";
      this.emit("status-change", { status: this._syncStatus });
    };

    // Handle local awareness updates
    this.awarenessHandler = (
      changes: { added: number[]; updated: number[]; removed: number[] },
      origin: string | null
    ) => {
      // Don't broadcast if update came from remote
      if (origin === "remote") {
        return;
      }

      const changedClients = [
        ...changes.added,
        ...changes.updated,
        ...changes.removed,
      ];

      if (changedClients.length > 0) {
        const update = encodeAwarenessUpdate(this.awareness, changedClients);

        this.broadcastEvent(this.channelName, "awareness-update", {
          update: toNumberArray(update),
          userId: this.userId,
        });
      }
    };

    // Attach handlers
    this.ydoc.on("update", this.updateHandler);
    this.awareness.on("change", this.awarenessHandler);
  }

  /**
   * Handle incoming Yjs update from Pusher
   */
  handleRemoteUpdate(data: YjsUpdateEvent): void {
    if (this._isDestroyed) return;

    // Filter out own messages
    const senderId = data._senderId || data.userId;
    if (senderId === this.userId) {
      return;
    }

    try {
      const update = toUint8Array(data.update);
      Y.applyUpdate(this.ydoc, update, "remote");

      this._lastSyncedAt = Date.now();
      this._syncStatus = "synced";
      this._retryCount = 0;
      this.emit("status-change", { status: this._syncStatus });
      this.emit("remote-update", data);
    } catch (error) {
      console.error("[PusherProvider] Failed to apply remote update:", error);
      this._syncStatus = "error";
      this.emit("error", error);
    }
  }

  /**
   * Handle incoming awareness update from Pusher
   */
  handleRemoteAwareness(data: AwarenessUpdateEvent): void {
    if (this._isDestroyed) return;

    // Filter out own messages
    const senderId = data._senderId || data.userId;
    if (senderId === this.userId) {
      return;
    }

    try {
      const update = toUint8Array(data.update);
      applyAwarenessUpdate(this.awareness, update, "remote");
      this.emit("awareness-update", data);
    } catch (error) {
      console.error("[PusherProvider] Failed to apply awareness update:", error);
    }
  }

  /**
   * Set sync status (called by external connection handlers)
   */
  setSyncStatus(status: SyncStatus): void {
    this._syncStatus = status;
    this.emit("status-change", { status });
  }

  /**
   * Force a full resync by fetching state from server
   */
  async forceResync(fetchState: () => Promise<number[] | null>): Promise<void> {
    if (this._isDestroyed) return;

    this._syncStatus = "syncing";
    this.emit("status-change", { status: this._syncStatus });

    try {
      const remoteState = await fetchState();

      if (remoteState && remoteState.length > 0) {
        const update = toUint8Array(remoteState);
        Y.applyUpdate(this.ydoc, update, "resync");
      }

      this._lastSyncedAt = Date.now();
      this._syncStatus = "synced";
      this._retryCount = 0;
      this.emit("status-change", { status: this._syncStatus });
      this.emit("resync-complete", null);
    } catch (error) {
      console.error("[PusherProvider] Resync failed:", error);
      this._syncStatus = "error";
      this._retryCount++;
      this.emit("error", error);

      // Schedule retry with exponential backoff
      if (this._retryCount < COLLABORATION_CONFIG.MAX_RETRIES) {
        const delay = getBackoffDelay(this._retryCount, COLLABORATION_CONFIG.BASE_RETRY_DELAY);
        setTimeout(() => {
          if (!this._isDestroyed) {
            this.forceResync(fetchState);
          }
        }, delay);
      }
    }
  }

  /**
   * Subscribe to provider events
   */
  on(event: string, callback: ProviderEventCallback): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, new Set());
    }
    this.eventCallbacks.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from provider events
   */
  off(event: string, callback: ProviderEventCallback): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(event: string, data: unknown): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[PusherProvider] Error in ${event} callback:`, error);
        }
      });
    }
  }

  /**
   * Destroy the provider and clean up
   */
  destroy(): void {
    if (this._isDestroyed) return;

    this._isDestroyed = true;

    // Remove Yjs handlers
    if (this.updateHandler) {
      this.ydoc.off("update", this.updateHandler);
      this.updateHandler = null;
    }

    if (this.awarenessHandler) {
      this.awareness.off("change", this.awarenessHandler);
      this.awarenessHandler = null;
    }

    // Clear all event callbacks
    this.eventCallbacks.clear();

    this.emit("destroy", null);
  }
}
