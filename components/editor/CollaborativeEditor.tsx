"use client";

import { Button } from "@/components/ui/button";
import { useStudySession } from "@/lib/hooks/use-study-session";
import Collaboration from "@tiptap/extension-collaboration";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import type { Channel } from "pusher-js";
import { useEffect, useState } from "react";
import * as Y from "yjs";

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
  const [ydoc] = useState(() => new Y.Doc());
  const { fetchYjsState, saveYjsState } = useStudySession();

  // Load Yjs state from database on mount
  useEffect(() => {
    const loadYjsState = async () => {
      try {
        const yjsState = await fetchYjsState(sessionId);
        if (yjsState && yjsState.length > 0) {
          // Apply saved Yjs state to document
          const update = new Uint8Array(yjsState);
          Y.applyUpdate(ydoc, update);
          console.log("📥 Loaded Yjs state from database");
        }
      } catch (error) {
        console.error("Failed to load Yjs state:", error);
      }
    };

    loadYjsState();
  }, [sessionId, ydoc, fetchYjsState]);

  // Save Yjs state to database periodically (every 30 seconds)
  useEffect(() => {
    const saveState = async () => {
      try {
        const state = Y.encodeStateAsUpdate(ydoc);
        await saveYjsState(sessionId, Array.from(state));
        console.log("💾 Saved Yjs state to database");
      } catch (error) {
        console.error("Failed to save Yjs state:", error);
      }
    };

    // Save every 30 seconds
    const interval = setInterval(saveState, 30000);

    // Save on unmount
    return () => {
      clearInterval(interval);
      saveState();
    };
  }, [sessionId, ydoc, saveYjsState]);

  // Initialize TipTap editor with Yjs collaboration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
  });

  // Pusher WebSocket integration for Yjs synchronization
  useEffect(() => {
    if (!pusherChannel) {
      return;
    }

    console.log("✅ Editor using Pusher channel for real-time sync");

    // Listen for Yjs updates from other clients
    const handleYjsUpdate = (data: { update: number[]; userId: string }) => {
      if (data.userId !== userId) {
        const update = new Uint8Array(data.update);
        Y.applyUpdate(ydoc, update);
        console.log("📥 Received Yjs update from", data.userId);
      }
    };

    // Bind event listeners
    pusherChannel.bind("client-yjs-update", handleYjsUpdate);

    // Send local Yjs updates to other clients via Pusher
    const updateHandler = (update: Uint8Array, origin: any) => {
      if (origin !== "remote" && pusherChannel) {
        pusherChannel.trigger("client-yjs-update", {
          update: Array.from(update),
          userId,
        });
        console.log("📤 Sent Yjs update");
      }
    };

    ydoc.on("update", updateHandler);

    // Cleanup
    return () => {
      ydoc.off("update", updateHandler);
      pusherChannel.unbind("client-yjs-update", handleYjsUpdate);
    };
  }, [pusherChannel, userId, ydoc]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!editor || !onSave) return;

    const interval = setInterval(() => {
      const content = editor.getHTML();
      onSave(content);
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, onSave]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-neutral-50 dark:bg-neutral-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "bg-neutral-200 dark:bg-neutral-800" : ""
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

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />

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

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
