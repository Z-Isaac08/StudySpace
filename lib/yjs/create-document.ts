"use client";

/**
 * Yjs Document Factory
 * StudySpace - Collaborative Editing
 */

import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import type { YjsDocumentBundle, CreateDocumentOptions } from "@/lib/types/collaboration";
import { toUint8Array } from "./utils";

/**
 * Create a new Yjs document with awareness
 */
export function createYjsDocument(options?: CreateDocumentOptions): YjsDocumentBundle {
  const ydoc = new Y.Doc();

  // Apply initial state if provided
  if (options?.initialState && options.initialState.length > 0) {
    const update = toUint8Array(options.initialState);
    Y.applyUpdate(ydoc, update);
  }

  // Get the XML fragment used by TipTap
  // Use "default" to match existing implementation
  const content = ydoc.getXmlFragment("default");

  // Create awareness for presence and cursors
  const awareness = new Awareness(ydoc);

  return { ydoc, content, awareness };
}

/**
 * Encode the current state of a Yjs document
 */
export function encodeDocumentState(ydoc: Y.Doc): Uint8Array {
  return Y.encodeStateAsUpdate(ydoc);
}

/**
 * Apply an update to a Yjs document
 */
export function applyDocumentUpdate(
  ydoc: Y.Doc,
  update: Uint8Array | number[],
  origin?: string
): void {
  const uint8Update = toUint8Array(update);
  Y.applyUpdate(ydoc, uint8Update, origin);
}

/**
 * Get the state vector of a Yjs document
 * Used for comparing states between clients
 */
export function getStateVector(ydoc: Y.Doc): Uint8Array {
  return Y.encodeStateVector(ydoc);
}

/**
 * Compute missing updates between two states
 * Returns updates that the target is missing
 */
export function computeMissingUpdates(
  ydoc: Y.Doc,
  targetStateVector: Uint8Array
): Uint8Array {
  return Y.encodeStateAsUpdate(ydoc, targetStateVector);
}

/**
 * Destroy a Yjs document and clean up resources
 */
export function destroyDocument(bundle: YjsDocumentBundle): void {
  bundle.awareness.destroy();
  bundle.ydoc.destroy();
}

/**
 * Check if two Yjs documents have the same state
 */
export function areStatesEqual(
  stateVector1: Uint8Array,
  stateVector2: Uint8Array
): boolean {
  if (stateVector1.length !== stateVector2.length) {
    return false;
  }
  for (let i = 0; i < stateVector1.length; i++) {
    if (stateVector1[i] !== stateVector2[i]) {
      return false;
    }
  }
  return true;
}
