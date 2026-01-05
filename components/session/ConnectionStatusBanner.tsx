"use client";

/**
 * ConnectionStatusBanner Component
 * Displays connection status warnings and errors for the session.
 * Shows different states: partial (one system down) or disconnected (all down).
 */

import { Button } from "@/components/ui/button";
import {
  type GlobalConnectionStatus,
  type PartialReason,
  getConnectionMessage,
} from "@/lib/hooks/use-connection-orchestrator";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusBannerProps {
  /** Global connection status */
  globalStatus: GlobalConnectionStatus;
  /** Which system is causing the issue */
  partialReason: PartialReason;
  /** Is browser online? */
  browserOnline: boolean;
  /** Retry callback */
  onRetry?: () => void;
  /** Is retry in progress? */
  isRetrying?: boolean;
}

export function ConnectionStatusBanner({
  globalStatus,
  partialReason,
  browserOnline,
  onRetry,
  isRetrying = false,
}: ConnectionStatusBannerProps) {
  // Don't show anything if connected
  if (globalStatus === "connected") {
    return null;
  }

  const message = getConnectionMessage(globalStatus, partialReason);
  if (!message) return null;

  const isDisconnected = globalStatus === "disconnected";
  const isOffline = !browserOnline;

  return (
    <>
      {/* Partial connection - Warning banner */}
      {!isDisconnected && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-2",
            "bg-amber-50 dark:bg-amber-950/50",
            "border-b border-amber-200 dark:border-amber-800",
            "text-amber-800 dark:text-amber-200"
          )}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <div className="text-sm">
              <span className="font-medium">{message.title}</span>
              <span className="hidden sm:inline"> — {message.description}</span>
            </div>
          </div>

          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="h-7 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900"
            >
              <RefreshCw
                className={cn("h-3 w-3 mr-1", isRetrying && "animate-spin")}
              />
              {isRetrying ? "..." : "Réessayer"}
            </Button>
          )}
        </div>
      )}

      {/* Full disconnection - Overlay */}
      {isDisconnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-lg bg-white dark:bg-neutral-900 p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              {isOffline ? (
                <WifiOff className="h-12 w-12 text-red-500 mb-4" />
              ) : (
                <Wifi className="h-12 w-12 text-red-500 mb-4" />
              )}

              <h2 className="text-xl font-semibold text-foreground mb-2">
                {isOffline ? "Pas de connexion internet" : message.title}
              </h2>

              <p className="text-muted-foreground mb-6">
                {isOffline
                  ? "Vérifiez votre connexion internet et réessayez."
                  : message.description}
              </p>

              {onRetry && (
                <Button
                  onClick={onRetry}
                  disabled={isRetrying || isOffline}
                  className="w-full"
                >
                  <RefreshCw
                    className={cn("h-4 w-4 mr-2", isRetrying && "animate-spin")}
                  />
                  {isRetrying ? "Reconnexion..." : "Réessayer la connexion"}
                </Button>
              )}

              {isOffline && (
                <p className="text-xs text-muted-foreground mt-4">
                  La reconnexion sera automatique dès que vous serez en ligne.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Overlay for individual disabled components
 */
interface ComponentDisabledOverlayProps {
  /** Is the component disabled? */
  disabled: boolean;
  /** Type of component */
  type: "editor" | "canvas";
  /** Custom message */
  message?: string;
}

export function ComponentDisabledOverlay({
  disabled,
  type,
  message,
}: ComponentDisabledOverlayProps) {
  if (!disabled) return null;

  const defaultMessage =
    type === "editor"
      ? "Éditeur temporairement indisponible"
      : "Canvas temporairement indisponible";

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 dark:bg-black/30 backdrop-blur-[1px]">
      <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm text-muted-foreground">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
}
