"use client";

/**
 * usePresence Hook
 * Manages user presence and state tracking
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";
import type { Awareness } from "y-protocols/awareness";
import type {
  PresenceData,
  UserState,
  CollaborationUser,
  UsePresenceReturn,
} from "@/lib/types/collaboration";
import { COLLABORATION_CONFIG } from "@/lib/types/collaboration";
import {
  setAwarenessUser,
  updateAwarenessState,
  getAwarenessStates,
  getLocalClientId,
  computeUserState,
} from "@/lib/yjs/awareness";

interface UsePresenceOptions {
  awareness: Awareness | null;
  user: CollaborationUser;
  editor?: Editor | null;
}

export function usePresence({
  awareness,
  user,
  editor,
}: UsePresenceOptions): UsePresenceReturn {
  const [users, setUsers] = useState<Map<number, PresenceData>>(new Map());
  const [currentUserState, setCurrentUserState] = useState<UserState>("online");
  const lastActivityRef = useRef<number>(Date.now());

  // Set initial user info in awareness
  useEffect(() => {
    if (!awareness) return;

    setAwarenessUser(awareness, user, "online");
  }, [awareness, user]);

  // Listen to awareness changes
  useEffect(() => {
    if (!awareness) return;

    const updateUsers = () => {
      const states = getAwarenessStates(awareness);
      setUsers(new Map(states));
    };

    const handleChange = () => {
      updateUsers();
    };

    awareness.on("change", handleChange);
    updateUsers(); // Initial fetch

    return () => {
      awareness.off("change", handleChange);
    };
  }, [awareness]);

  // Track editor activity for user state
  useEffect(() => {
    if (!editor || !awareness) return;

    const handleTransaction = () => {
      lastActivityRef.current = Date.now();
      updateAwarenessState(awareness, "editing");
      setCurrentUserState("editing");
    };

    editor.on("transaction", handleTransaction);

    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor, awareness]);

  // Periodically update user state based on activity
  useEffect(() => {
    if (!awareness) return;

    const interval = setInterval(() => {
      const localState = awareness.getLocalState() as PresenceData | null;
      if (!localState) return;

      const hasCursor = !!localState.cursor;
      const newState = computeUserState(
        lastActivityRef.current,
        hasCursor,
        COLLABORATION_CONFIG.IDLE_TIMEOUT,
        COLLABORATION_CONFIG.EDITING_TIMEOUT
      );

      if (newState !== currentUserState) {
        updateAwarenessState(awareness, newState);
        setCurrentUserState(newState);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [awareness, currentUserState]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (awareness) {
      updateAwarenessState(awareness, "editing");
      setCurrentUserState("editing");
    }
  }, [awareness]);

  // Calculate user count (excluding self optionally)
  const userCount = users.size;

  return {
    users,
    userCount,
    currentUserState,
    updateActivity,
  };
}
