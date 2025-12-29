/**
 * Types for Collaborative Editing System
 * StudySpace - Real-time Collaboration
 */

import type * as Y from "yjs";
import type { Awareness } from "y-protocols/awareness";
import type { Editor } from "@tiptap/react";
import type { Channel } from "pusher-js";

// =============================================================================
// User & Presence Types
// =============================================================================

/** User activity states */
export type UserState = "online" | "idle" | "editing";

/** User information for presence */
export interface CollaborationUser {
  id: string;
  name: string;
  email?: string;
  color: string;
}

/** Presence data structure for awareness */
export interface PresenceData {
  user: CollaborationUser;
  state: UserState;
  lastActivity: number;
  cursor?: CursorPosition;
}

/** Cursor position in the document */
export interface CursorPosition {
  anchor: number;
  head: number;
}

/** Pusher presence member structure */
export interface PresenceMember {
  id: string;
  info: {
    id: string;
    name: string;
    email: string;
    color: string;
  };
}

// =============================================================================
// Sync Status Types
// =============================================================================

/** Synchronization status */
export type SyncStatus = "connecting" | "synced" | "syncing" | "offline" | "error";

/** Connection state details */
export interface ConnectionState {
  status: SyncStatus;
  isOnline: boolean;
  lastSyncedAt: number | null;
  error: Error | null;
  retryCount: number;
}

// =============================================================================
// Yjs Document Types
// =============================================================================

/** Yjs document bundle */
export interface YjsDocumentBundle {
  ydoc: Y.Doc;
  content: Y.XmlFragment;
  awareness: Awareness;
}

/** Options for creating a Yjs document */
export interface CreateDocumentOptions {
  sessionId: string;
  initialState?: Uint8Array | number[];
}

// =============================================================================
// Provider Types
// =============================================================================

/** Pusher provider configuration */
export interface PusherProviderConfig {
  sessionId: string;
  userId: string;
  ydoc: Y.Doc;
  awareness: Awareness;
  broadcastEvent: (channel: string, event: string, data: unknown) => Promise<boolean>;
}

/** Provider interface for TipTap */
export interface CollaborationProvider {
  awareness: Awareness;
  destroy: () => void;
}

// =============================================================================
// Hook Return Types
// =============================================================================

/** Return type for useYjsDocument hook */
export interface UseYjsDocumentReturn {
  ydoc: Y.Doc;
  awareness: Awareness;
  content: Y.XmlFragment;
  isLoaded: boolean;
  applyUpdate: (update: Uint8Array, origin?: string) => void;
  getEncodedState: () => Uint8Array;
}

/** Return type for usePusherSync hook */
export interface UsePusherSyncReturn {
  syncStatus: SyncStatus;
  isConnected: boolean;
  lastSyncedAt: number | null;
  forceResync: () => Promise<void>;
}

/** Return type for usePresence hook */
export interface UsePresenceReturn {
  users: Map<number, PresenceData>;
  userCount: number;
  currentUserState: UserState;
  updateActivity: () => void;
}

/** Return type for useConnectionStatus hook */
export interface UseConnectionStatusReturn {
  isOnline: boolean;
  syncStatus: SyncStatus;
  connectionState: ConnectionState;
}

// =============================================================================
// Component Props Types
// =============================================================================

/** Props for CollaborativeEditor */
export interface CollaborativeEditorProps {
  sessionId: string;
  userId: string;
  userName: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  pusherChannel: Channel | null;
}

/** Props for EditorStatusBar */
export interface EditorStatusBarProps {
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  userCount: number;
}

/** Props for PresenceAvatars */
export interface PresenceAvatarsProps {
  users: Map<number, PresenceData>;
  currentUserId: string;
  maxVisible?: number;
}

/** Props for OfflineBanner */
export interface OfflineBannerProps {
  isOnline: boolean;
  syncStatus: SyncStatus;
  onRetry?: () => void;
}

// =============================================================================
// Event Types
// =============================================================================

/** Yjs update event data */
export interface YjsUpdateEvent {
  update: number[];
  userId: string;
  _senderId?: string;
}

/** Awareness update event data */
export interface AwarenessUpdateEvent {
  update: number[];
  userId: string;
  _senderId?: string;
}

// =============================================================================
// Configuration Constants
// =============================================================================

/** Default configuration values */
export const COLLABORATION_CONFIG = {
  /** Auto-save interval in milliseconds */
  AUTO_SAVE_INTERVAL: 30000,

  /** Idle timeout in milliseconds (1 minute) */
  IDLE_TIMEOUT: 60000,

  /** Editing timeout in milliseconds (5 seconds) */
  EDITING_TIMEOUT: 5000,

  /** Maximum retry attempts */
  MAX_RETRIES: 5,

  /** Base retry delay in milliseconds */
  BASE_RETRY_DELAY: 1000,

  /** Awareness timeout in milliseconds */
  AWARENESS_TIMEOUT: 30000,

  /** Debounce delay for broadcasts in milliseconds */
  BROADCAST_DEBOUNCE: 100,
} as const;

/** Predefined colors for users */
export const USER_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F", // Gold
  "#BB8FCE", // Purple
  "#85C1E9", // Light Blue
  "#F8B500", // Orange
  "#58D68D", // Emerald
] as const;
