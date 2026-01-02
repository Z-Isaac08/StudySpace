"use client";

/**
 * PrivateNotesEditor Component
 * Simple TipTap editor for private notes (no collaboration)
 * Each user has their own notes per session
 */

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Loader2, Lock } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useSessionNotes } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface PrivateNotesEditorProps {
  sessionId: string;
  className?: string;
}

export function PrivateNotesEditor({
  sessionId,
  className,
}: PrivateNotesEditorProps) {
  const {
    currentNote,
    isLoading,
    isSaving,
    lastSavedAt,
    fetchNotes,
    saveNotes,
    clearNotes,
  } = useSessionNotes();

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Initialize TipTap editor (no collaboration extensions)
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      // Debounced auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveNotes(sessionId, editor.getHTML());
      }, 2000); // 2 second debounce
    },
  });

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes(sessionId);

    return () => {
      clearNotes();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sessionId, fetchNotes, clearNotes]);

  // Set editor content when notes are loaded
  useEffect(() => {
    if (editor && currentNote?.content && !hasInitialized.current) {
      editor.commands.setContent(currentNote.content);
      hasInitialized.current = true;
    }
  }, [editor, currentNote]);

  // Format last saved time
  const formatLastSaved = useCallback((date: Date | null) => {
    if (!date) return null;
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (isLoading || !editor) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Private badge */}
      <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-muted/50 border-b">
        <Lock className="h-3 w-3" />
        <span>Privé - visible uniquement par vous</span>
        {isSaving && (
          <span className="ml-auto flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Sauvegarde...
          </span>
        )}
        {!isSaving && lastSavedAt && (
          <span className="ml-auto text-muted-foreground/70">
            Sauvegardé {formatLastSaved(lastSavedAt)}
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-neutral-50 dark:bg-neutral-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bold") && "bg-neutral-200 dark:bg-neutral-800"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-neutral-200 dark:bg-neutral-800"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") &&
              "bg-neutral-200 dark:bg-neutral-800"
          )}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList") &&
              "bg-neutral-200 dark:bg-neutral-800"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-950">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
