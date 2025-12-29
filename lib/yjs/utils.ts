/**
 * Yjs Utility Functions
 * StudySpace - Collaborative Editing
 */

import { USER_COLORS } from "@/lib/types/collaboration";

/**
 * Generate a deterministic color for a user based on their ID
 * This ensures the same user always gets the same color
 */
export function getUserColor(userId: string): string {
  const hash = userId.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  return USER_COLORS[hash % USER_COLORS.length];
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Encode Uint8Array to base64 string for transport
 */
export function encodeState(state: Uint8Array): string {
  return Buffer.from(state).toString("base64");
}

/**
 * Decode base64 string to Uint8Array
 */
export function decodeState(encoded: string): Uint8Array {
  return new Uint8Array(Buffer.from(encoded, "base64"));
}

/**
 * Convert number array to Uint8Array
 */
export function toUint8Array(arr: number[] | Uint8Array): Uint8Array {
  if (arr instanceof Uint8Array) {
    return arr;
  }
  return new Uint8Array(arr);
}

/**
 * Convert Uint8Array to number array for JSON serialization
 */
export function toNumberArray(arr: Uint8Array): number[] {
  return Array.from(arr);
}

/**
 * Calculate exponential backoff delay
 */
export function getBackoffDelay(
  retryCount: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): number {
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Format relative time for last synced display
 */
export function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) return "Jamais";

  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 5000) return "À l'instant";
  if (diff < 60000) return `Il y a ${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;

  return new Date(timestamp).toLocaleDateString("fr-FR");
}
