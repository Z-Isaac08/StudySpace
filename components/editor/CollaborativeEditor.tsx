"use client";

/**
 * CollaborativeEditor Component
 * Real-time collaborative text editor using TipTap + Yjs + Pusher
 *
 * Features:
 * - Real-time sync via Yjs CRDTs
 * - Cursor tracking with awareness
 * - Auto-save with periodic persistence
 * - Offline support with resync
 * - Deterministic user colors
 */

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import type { Channel } from "pusher-js";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "./EditorSkeleton";
import { EditorStatusBar } from "./EditorStatusBar";
import { OfflineBanner } from "./OfflineBanner";
import { PresenceAvatars } from "./PresenceAvatars";

import { useCollaborativeEditor } from "@/lib/hooks/use-collaborative-editor";
import { useStudySession } from "@/lib/hooks/use-study-session";
import type { PresenceData } from "@/lib/types/collaboration";
import { getUserColor } from "@/lib/yjs/utils";

interface CollaborativeEditorProps {
  sessionId: string;
  userId: string;
  userName: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  pusherChannel: Channel | null;
}

export function CollaborativeEditor({
  sessionId,
  userId,
  userName,
  initialContent = "",
  onSave,
  pusherChannel,
}: CollaborativeEditorProps) {
  const { fetchYjsState, saveYjsState, broadcastEvent } = useStudySession();
  const [presenceUsers, setPresenceUsers] = useState<Map<number, PresenceData>>(
    new Map()
  );

  // Deterministic color for user
  const userColor = getUserColor(userId);

  // Use collaborative editor hook
  const {
    ydoc,
    awareness,
    provider,
    isLoaded,
    syncStatus,
    isOnline,
    lastSyncedAt,
    forceResync,
  } = useCollaborativeEditor({
    sessionId,
    userId,
    userName,
    pusherChannel,
    broadcastEvent,
    fetchYjsState,
    saveYjsState,
  });

  // Initialize TipTap editor with Yjs collaboration
  const editor = useEditor(
    {
      extensions: [
        // Disable undoRedo in StarterKit - Collaboration has its own undo/redo
        StarterKit.configure({
          undoRedo: false,
        }),
        ...(ydoc
          ? [
              Collaboration.configure({
                document: ydoc,
                field: "default", // Must match the fragment name in createYjsDocument
              }),
            ]
          : []),
        ...(provider
          ? [
              CollaborationCaret.configure({
                provider: provider,
                user: {
                  name: userName,
                  color: userColor,
                },
              }),
            ]
          : []),
      ],
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose-base max-w-none focus:outline-none h-full px-4 py-3",
        },
      },
    },
    [ydoc, provider] // Recreate editor when ydoc or provider changes
  );

  // Track presence/awareness
  useEffect(() => {
    if (!awareness) return;

    const updateUsers = () => {
      const states = awareness.getStates() as Map<number, PresenceData>;
      setPresenceUsers(new Map(states));
    };

    awareness.on("change", updateUsers);
    updateUsers();

    return () => {
      awareness.off("change", updateUsers);
    };
  }, [awareness]);

  // Seed with initial content if document is empty
  useEffect(() => {
    if (!editor || !isLoaded || !initialContent || !ydoc) return;

    const fragment = ydoc.getXmlFragment("default");
    if (fragment.length === 0 && editor.isEmpty) {
      editor.commands.setContent(initialContent);
      console.log("📝 Seeded empty document with initial content");
    }
  }, [editor, isLoaded, initialContent, ydoc]);

  // Auto-save HTML content for legacy support
  useEffect(() => {
    if (!editor || !onSave) return;

    const interval = setInterval(() => {
      const content = editor.getHTML();
      onSave(content);
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, onSave]);

  // Loading state
  if (!editor || !isLoaded) {
    return <EditorSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Offline/Error Banner */}
      <OfflineBanner
        isOnline={isOnline}
        syncStatus={syncStatus}
        onRetry={forceResync}
      />

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-white dark:bg-neutral-950">
        {/* Toolbar with status */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b bg-neutral-50 dark:bg-neutral-900">
          {/* Formatting buttons */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold")
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }
            >
              <Bold className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic")
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }
            >
              <Italic className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1 self-center" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 })
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }
            >
              <Heading2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={
                editor.isActive("bulletList")
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={
                editor.isActive("orderedList")
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }
            >
              <ListOrdered className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={
                editor.isActive("blockquote")
                  ? "bg-neutral-200 dark:bg-neutral-800"
                  : ""
              }
            >
              <Quote className="h-4 w-4" />
            </Button>

          </div>

          {/* Status and presence */}
          <div className="flex items-center gap-3">
            <PresenceAvatars
              users={presenceUsers}
              currentUserId={userId}
              maxVisible={4}
            />
            <EditorStatusBar
              syncStatus={syncStatus}
              lastSyncedAt={lastSyncedAt}
              onRetry={forceResync}
            />
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  );
}
