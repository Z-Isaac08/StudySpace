/**
 * Centralized exports for all types
 * Import from @/lib/types instead of individual files
 */

// =============================================================================
// Common Types
// =============================================================================

/**
 * Generic JSON value type for Prisma JSON fields
 * Use this instead of `any` for JSON columns
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Canvas state stored in database (tldraw/Konva state)
 */
export type CanvasState = JsonValue;

/**
 * Editor state stored in database (TipTap/Yjs state)
 */
export interface EditorState {
  yjsState?: number[];
  content?: JsonValue;
  [key: string]: JsonValue | undefined;
}

/**
 * API Error interface for typed error handling
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}

/**
 * Get error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur est survenue";
}

// =============================================================================
// Re-export collaboration types
// =============================================================================

export * from "./collaboration";
