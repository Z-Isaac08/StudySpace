"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Channel } from "pusher-js";
import { useEffect, useState } from "react";

interface PresenceMember {
  id: string;
  info: {
    id: string;
    name: string;
    email: string;
    color: string;
  };
}

interface SessionPresenceProps {
  pusherChannel: Channel | null;
  currentUserId: string;
}

export function SessionPresence({
  pusherChannel,
  currentUserId,
}: SessionPresenceProps) {
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!pusherChannel) {
      setIsConnected(false);
      setMembers([]);
      return;
    }

    // Check if already subscribed
    // @ts-ignore - pusherChannel.subscribed exists
    if (pusherChannel.subscribed) {
      setIsConnected(true);

      // Get current members
      // @ts-ignore - members property exists on presence channels
      const channelMembers = pusherChannel.members;
      if (channelMembers) {
        const membersList: PresenceMember[] = [];
        channelMembers.each((member: PresenceMember) => {
          membersList.push(member);
        });
        setMembers(membersList);
      }
    }

    // Handle subscription success
    const handleSubscriptionSucceeded = (members: any) => {
      setIsConnected(true);
      console.log("✅ SessionPresence connected");

      const membersList: PresenceMember[] = [];
      members.each((member: PresenceMember) => {
        membersList.push(member);
      });
      setMembers(membersList);
    };

    // Handle member added
    const handleMemberAdded = (member: PresenceMember) => {
      setMembers((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m.id === member.id)) return prev;
        return [...prev, member];
      });
      console.log(`👋 ${member.info.name} joined the session`);
    };

    // Handle member removed
    const handleMemberRemoved = (member: PresenceMember) => {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      console.log(`👋 ${member.info.name} left the session`);
    };

    // Bind event listeners
    pusherChannel.bind(
      "pusher:subscription_succeeded",
      handleSubscriptionSucceeded
    );
    pusherChannel.bind("pusher:member_added", handleMemberAdded);
    pusherChannel.bind("pusher:member_removed", handleMemberRemoved);

    // Cleanup
    return () => {
      pusherChannel.unbind(
        "pusher:subscription_succeeded",
        handleSubscriptionSucceeded
      );
      pusherChannel.unbind("pusher:member_added", handleMemberAdded);
      pusherChannel.unbind("pusher:member_removed", handleMemberRemoved);
    };
  }, [pusherChannel]);

  // Don't render if not connected
  if (!isConnected || members.length === 0) {
    return null;
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {members.length}{" "}
            {members.length === 1 ? "participant" : "participants"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {members.slice(0, 5).map((member) => (
            <div key={member.id} className="relative">
              <Avatar
                className="h-8 w-8 border-2"
                style={{ borderColor: member.info.color }}
              >
                <AvatarFallback
                  style={{
                    backgroundColor: member.info.color + "20",
                    color: member.info.color,
                  }}
                >
                  {getInitials(member.info.name)}
                </AvatarFallback>
              </Avatar>
              {member.id === currentUserId && (
                <Badge
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-4 px-1 text-[10px]"
                >
                  Vous
                </Badge>
              )}
            </div>
          ))}

          {members.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              +{members.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Member list */}
      <div className="mt-3 flex flex-wrap gap-2">
        {members.map((member) => (
          <Badge
            key={member.id}
            variant="outline"
            className="gap-1"
            style={{ borderColor: member.info.color }}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: member.info.color }}
            />
            {member.info.name}
            {member.id === currentUserId && " (Vous)"}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
