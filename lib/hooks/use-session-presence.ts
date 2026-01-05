"use client";

/**
 * useSessionPresence Hook
 * Tracks all session members via Pusher presence channel.
 * Provides a unified view of who is in the session and where they are (editor/canvas).
 */

import type { Channel } from "pusher-js";
import { useCallback, useEffect, useState } from "react";

export type UserLocation = "editor" | "canvas" | "idle";

export interface SessionMember {
  id: string;
  name: string;
  email: string;
  color: string;
  location: UserLocation;
}

interface UseSessionPresenceOptions {
  pusherChannel: Channel | null;
  currentUserId: string;
}

interface UseSessionPresenceReturn {
  /** List of all members in the session */
  members: SessionMember[];
  /** Update current user's location */
  setMyLocation: (location: UserLocation) => void;
  /** Current user's location */
  myLocation: UserLocation;
  /** Is connected to presence channel */
  isConnected: boolean;
}

export function useSessionPresence({
  pusherChannel,
  currentUserId,
}: UseSessionPresenceOptions): UseSessionPresenceReturn {
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [myLocation, setMyLocationState] = useState<UserLocation>("idle");
  const [isConnected, setIsConnected] = useState(false);

  // Update my location and broadcast to others
  const setMyLocation = useCallback(
    (location: UserLocation) => {
      setMyLocationState(location);

      // Broadcast location change via client event
      if (pusherChannel) {
        pusherChannel.trigger("client-location-update", {
          userId: currentUserId,
          location,
        });
      }

      // Update in local members list
      setMembers((prev) =>
        prev.map((m) => (m.id === currentUserId ? { ...m, location } : m))
      );
    },
    [pusherChannel, currentUserId]
  );

  useEffect(() => {
    if (!pusherChannel) {
      setIsConnected(false);
      setMembers([]);
      return;
    }

    // Handle subscription success - get initial members
    const handleSubscriptionSucceeded = (data: {
      count: number;
      members: Record<string, { id: string; name: string; email: string; color: string }>;
      me: { id: string; info: { id: string; name: string; email: string; color: string } };
      myID: string;
    }) => {
      setIsConnected(true);

      // Convert members object to array
      const membersList: SessionMember[] = [];

      // Pusher presence channel uses .each() to iterate members
      // @ts-ignore - members.each exists on presence channels
      if (data.members && typeof data.members === "object") {
        Object.entries(data.members).forEach(([id, info]: [string, any]) => {
          membersList.push({
            id: info.id || id,
            name: info.name || "Utilisateur",
            email: info.email || "",
            color: info.color || "#888",
            location: "idle", // Default location
          });
        });
      }

      setMembers(membersList);
    };

    // Handle new member joining
    const handleMemberAdded = (member: {
      id: string;
      info: { id: string; name: string; email: string; color: string };
    }) => {
      setMembers((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m.id === member.info.id)) return prev;
        return [
          ...prev,
          {
            id: member.info.id,
            name: member.info.name || "Utilisateur",
            email: member.info.email || "",
            color: member.info.color || "#888",
            location: "idle",
          },
        ];
      });
    };

    // Handle member leaving
    const handleMemberRemoved = (member: {
      id: string;
      info: { id: string; name: string; email: string; color: string };
    }) => {
      setMembers((prev) => prev.filter((m) => m.id !== member.info.id));
    };

    // Handle location updates from other users
    const handleLocationUpdate = (data: { userId: string; location: UserLocation }) => {
      if (data.userId === currentUserId) return; // Ignore own updates

      setMembers((prev) =>
        prev.map((m) =>
          m.id === data.userId ? { ...m, location: data.location } : m
        )
      );
    };

    // Check if already subscribed
    // @ts-ignore - subscribed exists on channels
    if (pusherChannel.subscribed) {
      // Get current members
      // @ts-ignore - members exists on presence channels
      const channelMembers = pusherChannel.members;
      if (channelMembers) {
        const membersList: SessionMember[] = [];
        channelMembers.each((member: { id: string; info: any }) => {
          membersList.push({
            id: member.info.id || member.id,
            name: member.info.name || "Utilisateur",
            email: member.info.email || "",
            color: member.info.color || "#888",
            location: "idle",
          });
        });
        setMembers(membersList);
        setIsConnected(true);
      }
    }

    // Bind event listeners
    pusherChannel.bind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
    pusherChannel.bind("pusher:member_added", handleMemberAdded);
    pusherChannel.bind("pusher:member_removed", handleMemberRemoved);
    pusherChannel.bind("client-location-update", handleLocationUpdate);

    // Cleanup
    return () => {
      pusherChannel.unbind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
      pusherChannel.unbind("pusher:member_added", handleMemberAdded);
      pusherChannel.unbind("pusher:member_removed", handleMemberRemoved);
      pusherChannel.unbind("client-location-update", handleLocationUpdate);
    };
  }, [pusherChannel, currentUserId]);

  return {
    members,
    setMyLocation,
    myLocation,
    isConnected,
  };
}
