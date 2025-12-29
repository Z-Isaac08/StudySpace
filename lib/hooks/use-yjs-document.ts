"use client";

/**
 * useYjsDocument Hook
 * Manages Yjs document lifecycle and state
 */

import { useRef, useState, useEffect, useCallback } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import type { UseYjsDocumentReturn } from "@/lib/types/collaboration";
import { createYjsDocument, destroyDocument } from "@/lib/yjs/create-document";
import { toUint8Array } from "@/lib/yjs/utils";

interface UseYjsDocumentOptions {
  sessionId: string;
  fetchInitialState: () => Promise<number[] | null>;
}

export function useYjsDocument({
  sessionId,
  fetchInitialState,
}: UseYjsDocumentOptions): UseYjsDocumentReturn {
  const ydocRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const contentRef = useRef<Y.XmlFragment | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Yjs document
  useEffect(() => {
    const init = async () => {
      // Create new document
      const { ydoc, content, awareness } = createYjsDocument({ sessionId });

      ydocRef.current = ydoc;
      awarenessRef.current = awareness;
      contentRef.current = content;

      // Load initial state from database
      try {
        const initialState = await fetchInitialState();

        if (initialState && initialState.length > 0) {
          const update = toUint8Array(initialState);
          Y.applyUpdate(ydoc, update);
          console.log("📥 Loaded Yjs state from database");
        }
      } catch (error) {
        console.error("Failed to load Yjs state:", error);
      }

      setIsLoaded(true);
    };

    init();

    // Cleanup
    return () => {
      if (ydocRef.current && awarenessRef.current) {
        destroyDocument({
          ydoc: ydocRef.current,
          awareness: awarenessRef.current,
          content: contentRef.current!,
        });
      }
      ydocRef.current = null;
      awarenessRef.current = null;
      contentRef.current = null;
      setIsLoaded(false);
    };
  }, [sessionId]); // Don't include fetchInitialState to avoid recreations

  // Apply update to document
  const applyUpdate = useCallback((update: Uint8Array, origin?: string) => {
    if (ydocRef.current) {
      Y.applyUpdate(ydocRef.current, update, origin);
    }
  }, []);

  // Get encoded state
  const getEncodedState = useCallback((): Uint8Array => {
    if (ydocRef.current) {
      return Y.encodeStateAsUpdate(ydocRef.current);
    }
    return new Uint8Array();
  }, []);

  return {
    ydoc: ydocRef.current!,
    awareness: awarenessRef.current!,
    content: contentRef.current!,
    isLoaded,
    applyUpdate,
    getEncodedState,
  };
}
