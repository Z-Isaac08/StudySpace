"use client";

/**
 * EditorStatusBar Component
 * Displays sync status and connection information
 */

import { cn } from "@/lib/utils";
import type { SyncStatus } from "@/lib/types/collaboration";
import { formatRelativeTime } from "@/lib/yjs/utils";
import {
  Cloud,
  CloudOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorStatusBarProps {
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  onRetry?: () => void;
  className?: string;
}

const statusConfig: Record<
  SyncStatus,
  {
    icon: typeof Cloud;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  connecting: {
    icon: Loader2,
    label: "Connexion...",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  synced: {
    icon: CheckCircle2,
    label: "Synchronisé",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  syncing: {
    icon: RefreshCw,
    label: "Synchronisation...",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  offline: {
    icon: CloudOff,
    label: "Hors ligne",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  error: {
    icon: AlertCircle,
    label: "Erreur",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

export function EditorStatusBar({
  syncStatus,
  lastSyncedAt,
  onRetry,
  className,
}: EditorStatusBarProps) {
  const config = statusConfig[syncStatus];
  const Icon = config.icon;
  const isAnimating = syncStatus === "connecting" || syncStatus === "syncing";

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
          config.bgColor,
          config.color,
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Icon
                className={cn("h-3.5 w-3.5", isAnimating && "animate-spin")}
              />
              <span>{config.label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-xs">
              <p className="font-medium">{config.label}</p>
              {lastSyncedAt && (
                <p className="text-muted-foreground">
                  Dernière sync: {formatRelativeTime(lastSyncedAt)}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {(syncStatus === "error" || syncStatus === "offline") && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-5 px-1.5 text-xs hover:bg-transparent"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}
