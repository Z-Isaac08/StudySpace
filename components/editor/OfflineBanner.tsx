"use client";

/**
 * OfflineBanner Component
 * Shows a banner when user is offline or sync has errors
 */

import { cn } from "@/lib/utils";
import type { SyncStatus } from "@/lib/types/collaboration";
import { WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OfflineBannerProps {
  isOnline: boolean;
  syncStatus: SyncStatus;
  onRetry?: () => void;
  className?: string;
}

export function OfflineBanner({
  isOnline,
  syncStatus,
  onRetry,
  className,
}: OfflineBannerProps) {
  // Only show banner for offline or error states
  if (isOnline && syncStatus !== "error" && syncStatus !== "offline") {
    return null;
  }

  const isOffline = !isOnline || syncStatus === "offline";
  const isError = syncStatus === "error";

  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      className={cn(
        "mb-4",
        isOffline && "border-orange-500 bg-orange-50 dark:bg-orange-950/30",
        className
      )}
    >
      {isOffline ? (
        <WifiOff className="h-4 w-4 text-orange-600" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle>
        {isOffline ? "Mode hors ligne" : "Erreur de synchronisation"}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          {isOffline
            ? "Vous êtes hors ligne. Les modifications seront synchronisées à la reconnexion."
            : "Une erreur est survenue. Vos modifications sont sauvegardées localement."}
        </span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
