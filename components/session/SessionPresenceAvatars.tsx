"use client";

/**
 * SessionPresenceAvatars Component
 * Displays all session members with their location indicator (editor/canvas/idle).
 * Used in the floating session header for a unified presence view.
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SessionMember, UserLocation } from "@/lib/hooks/use-session-presence";
import { cn } from "@/lib/utils";
import { Paintbrush, Type } from "lucide-react";

interface SessionPresenceAvatarsProps {
  members: SessionMember[];
  currentUserId: string;
  maxVisible?: number;
}

const locationConfig: Record<
  UserLocation,
  { label: string; icon: React.ReactNode; dotColor: string }
> = {
  editor: {
    label: "Sur l'éditeur",
    icon: <Type className="h-2.5 w-2.5" />,
    dotColor: "bg-blue-500",
  },
  canvas: {
    label: "Sur le canvas",
    icon: <Paintbrush className="h-2.5 w-2.5" />,
    dotColor: "bg-purple-500",
  },
  idle: {
    label: "Connecté",
    icon: null,
    dotColor: "bg-green-500",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SessionPresenceAvatars({
  members,
  currentUserId,
  maxVisible = 4,
}: SessionPresenceAvatarsProps) {
  if (members.length === 0) {
    return null;
  }

  // Sort: current user first, then by name
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return a.name.localeCompare(b.name);
  });

  const visibleMembers = sortedMembers.slice(0, maxVisible);
  const hiddenCount = sortedMembers.length - maxVisible;

  return (
    <div className="flex items-center -space-x-1.5">
      {visibleMembers.map((member) => {
        const isCurrentUser = member.id === currentUserId;
        const config = locationConfig[member.location];

        return (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar
                  className={cn(
                    "h-7 w-7 border-2 border-background transition-transform hover:scale-110 hover:z-10",
                    isCurrentUser && "ring-2 ring-primary/30"
                  )}
                  style={{ borderColor: member.color }}
                >
                  <AvatarFallback
                    className="text-[10px] font-medium"
                    style={{
                      backgroundColor: `${member.color}20`,
                      color: member.color,
                    }}
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Location indicator */}
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-background text-white",
                    config.dotColor
                  )}
                >
                  {config.icon}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {member.name}
                  {isCurrentUser && " (Vous)"}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)}
                  />
                  {config.label}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Hidden members count */}
      {hiddenCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
              +{hiddenCount}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <div className="flex flex-col gap-0.5">
              {sortedMembers.slice(maxVisible).map((member) => (
                <span key={member.id} className="flex items-center gap-1">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      locationConfig[member.location].dotColor
                    )}
                  />
                  {member.name}
                </span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
