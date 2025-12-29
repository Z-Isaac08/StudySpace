"use client";

/**
 * Yjs Awareness Configuration
 * StudySpace - Collaborative Editing
 */

import { Awareness } from "y-protocols/awareness";
import {
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import type {
  PresenceData,
  UserState,
  CollaborationUser,
  COLLABORATION_CONFIG,
} from "@/lib/types/collaboration";

/**
 * Set user info in awareness
 */
export function setAwarenessUser(
  awareness: Awareness,
  user: CollaborationUser,
  state: UserState = "online"
): void {
  awareness.setLocalState({
    user,
    state,
    lastActivity: Date.now(),
    cursor: undefined,
  } satisfies PresenceData);
}

/**
 * Update user state in awareness
 */
export function updateAwarenessState(
  awareness: Awareness,
  state: UserState
): void {
  const currentState = awareness.getLocalState() as PresenceData | null;
  if (currentState) {
    awareness.setLocalState({
      ...currentState,
      state,
      lastActivity: Date.now(),
    });
  }
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(awareness: Awareness): void {
  const currentState = awareness.getLocalState() as PresenceData | null;
  if (currentState) {
    awareness.setLocalState({
      ...currentState,
      lastActivity: Date.now(),
    });
  }
}

/**
 * Get all awareness states as a Map
 */
export function getAwarenessStates(
  awareness: Awareness
): Map<number, PresenceData> {
  return awareness.getStates() as Map<number, PresenceData>;
}

/**
 * Get the local client ID
 */
export function getLocalClientId(awareness: Awareness): number {
  return awareness.clientID;
}

/**
 * Encode awareness update for broadcasting
 */
export function encodeAwareness(
  awareness: Awareness,
  changedClients: number[]
): Uint8Array {
  return encodeAwarenessUpdate(awareness, changedClients);
}

/**
 * Apply awareness update from remote
 */
export function applyAwareness(
  awareness: Awareness,
  update: Uint8Array,
  origin: string
): void {
  applyAwarenessUpdate(awareness, update, origin);
}

/**
 * Remove awareness states for given clients
 */
export function removeAwareness(
  awareness: Awareness,
  clientIds: number[]
): void {
  removeAwarenessStates(awareness, clientIds, null);
}

/**
 * Compute user state based on last activity
 */
export function computeUserState(
  lastActivity: number,
  hasCursor: boolean,
  idleTimeout: number = 60000,
  editingTimeout: number = 5000
): UserState {
  const now = Date.now();
  const timeSinceActivity = now - lastActivity;

  if (timeSinceActivity < editingTimeout && hasCursor) {
    return "editing";
  } else if (timeSinceActivity < idleTimeout) {
    return "online";
  }
  return "idle";
}

/**
 * Filter out local client from awareness states
 */
export function getRemoteUsers(
  awareness: Awareness
): Map<number, PresenceData> {
  const states = getAwarenessStates(awareness);
  const localClientId = getLocalClientId(awareness);
  const remoteUsers = new Map<number, PresenceData>();

  states.forEach((state, clientId) => {
    if (clientId !== localClientId) {
      remoteUsers.set(clientId, state);
    }
  });

  return remoteUsers;
}

/**
 * Count active users (excluding idle)
 */
export function countActiveUsers(awareness: Awareness): number {
  const states = getAwarenessStates(awareness);
  let count = 0;

  states.forEach((state) => {
    if (state.state !== "idle") {
      count++;
    }
  });

  return count;
}
