"use client";

/**
 * PresenceAvatars Component
 * Shows avatars for users in the collaborative session
 */

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PresenceData, UserState } from "@/lib/types/collaboration";
import { getInitials } from "@/lib/yjs/utils";

interface PresenceAvatarsProps {
  users: Map<number, PresenceData>;
  currentUserId: string;
  maxVisible?: number;
  className?: string;
}

const stateLabels: Record<UserState, string> = {
  online: "En ligne",
  idle: "Inactif",
  editing: "En train d'écrire...",
};

const stateColors: Record<UserState, string> = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  editing: "bg-blue-500",
};

export function PresenceAvatars({
  users,
  currentUserId,
  maxVisible = 5,
  className,
}: PresenceAvatarsProps) {
  const userList = Array.from(users.entries());
  const visibleUsers = userList.slice(0, maxVisible);
  const hiddenCount = userList.length - maxVisible;

  if (userList.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center -space-x-2", className)}>
        {visibleUsers.map(([clientId, data]) => {
          const isCurrentUser = data.user?.id === currentUserId;
          const state = data.state || "online";

          return (
            <Tooltip key={clientId}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar
                    className={cn(
                      "h-8 w-8 border-2 border-background ring-2 transition-opacity",
                      state === "idle" && "opacity-60"
                    )}
                    style={{
                      borderColor: data.user?.color || "#888",
                      "--tw-ring-color": data.user?.color || "#888",
                    } as React.CSSProperties}
                  >
                    <AvatarFallback
                      style={{
                        backgroundColor: `${data.user?.color || "#888"}20`,
                        color: data.user?.color || "#888",
                      }}
                      className="text-xs font-medium"
                    >
                      {getInitials(data.user?.name || "?")}
                    </AvatarFallback>
                  </Avatar>

                  {/* State indicator dot */}
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                      stateColors[state]
                    )}
                  />

                  {/* Current user badge */}
                  {isCurrentUser && (
                    <Badge
                      variant="secondary"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 px-1 text-[9px] whitespace-nowrap"
                    >
                      Vous
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">
                    {data.user?.name || "Utilisateur"}
                    {isCurrentUser && " (Vous)"}
                  </span>
                  <span className="text-muted-foreground">
                    {stateLabels[state]}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Hidden users count */}
        {hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{hiddenCount}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <div className="flex flex-col gap-0.5">
                {userList.slice(maxVisible).map(([clientId, data]) => (
                  <span key={clientId}>{data.user?.name || "Utilisateur"}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
