/**
 * Centralized exports for all hooks
 * Import from @/lib/hooks instead of individual files
 */

export { useAuth } from "./use-auth";
export { useStudySession } from "./use-study-session";
export { useWorkspaces, useWorkspaceDetail } from "./use-workspace";
export { useCollaborativeEditor } from "./use-collaborative-editor";
export { usePresence } from "./use-presence";
export { useConnectionStatus } from "./use-connection-status";
export { usePusherSync } from "./use-pusher-sync";
export { useSessionNotes } from "./use-session-notes";
