'use client';

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

import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, List, ListOrdered, Lock, Quote } from 'lucide-react';
import type { Channel } from 'pusher-js';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { EditorSkeleton } from './EditorSkeleton';
import { EditorStatusBar } from './EditorStatusBar';
import { OfflineBanner } from './OfflineBanner';

import { useCollaborativeEditor } from '@/lib/hooks/use-collaborative-editor';
import { useStudySession } from '@/lib/hooks/use-study-session';
import { getUserColor } from '@/lib/yjs/utils';

interface CollaborativeEditorProps {
  sessionId: string;
  userId: string;
  userName: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  pusherChannel: Channel | null;
  /** When true: display content read-only, no Pusher/Yjs connection */
  isReadOnly?: boolean;
  /** Callback when user focuses the editor */
  onFocus?: () => void;
  /** Callback when editor content changes */
  onChange?: (content: string) => void;
}

export function CollaborativeEditor({
  sessionId,
  userId,
  userName,
  initialContent = '',
  onSave,
  pusherChannel,
  isReadOnly = false,
  onFocus,
  onChange,
}: CollaborativeEditorProps) {
  const { fetchYjsState, saveYjsState, broadcastEvent } = useStudySession();

  // Deterministic color for user
  const userColor = getUserColor(userId);

  // Use collaborative editor hook
  const { ydoc, awareness, provider, isLoaded, syncStatus, isOnline, lastSyncedAt, forceResync } =
    useCollaborativeEditor({
      sessionId,
      userId,
      userName,
      pusherChannel,
      broadcastEvent,
      fetchYjsState,
      saveYjsState,
      isReadOnly,
    });

  // Initialize TipTap editor with Yjs collaboration
  const editor = useEditor(
    {
      editable: !isReadOnly,
      extensions: [
        // Disable undoRedo in StarterKit - Collaboration has its own undo/redo
        StarterKit.configure({
          undoRedo: false,
        }),
        ...(ydoc
          ? [
              Collaboration.configure({
                document: ydoc,
                field: 'default', // Must match the fragment name in createYjsDocument
              }),
            ]
          : []),
        // Only add carets for live sessions
        ...(!isReadOnly && provider
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
          class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none h-full px-4 py-3',
        },
      },
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
    },
    [ydoc, provider, isReadOnly] // Recreate editor when ydoc, provider, or mode changes
  );

  // Notify parent when editor is focused
  useEffect(() => {
    if (!editor || !onFocus) return;

    const handleFocus = () => {
      onFocus();
    };

    editor.on('focus', handleFocus);

    return () => {
      editor.off('focus', handleFocus);
    };
  }, [editor, onFocus]);

  // Seed with initial content if document is empty
  useEffect(() => {
    if (!editor || !isLoaded || !initialContent || !ydoc) return;

    const fragment = ydoc.getXmlFragment('default');
    if (fragment.length === 0 && editor.isEmpty) {
      editor.commands.setContent(initialContent);
      console.log('📝 Seeded empty document with initial content');
    }
  }, [editor, isLoaded, initialContent, ydoc]);

  // Auto-save HTML content for legacy support (skipped in read-only mode)
  useEffect(() => {
    if (isReadOnly || !editor || !onSave) return;

    const interval = setInterval(() => {
      const content = editor.getHTML();
      onSave(content);
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, onSave, isReadOnly]);

  // Loading state
  if (!editor || !isLoaded) {
    return <EditorSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Offline/Error Banner – hidden in read-only mode */}
      {!isReadOnly && (
        <OfflineBanner isOnline={isOnline} syncStatus={syncStatus} onRetry={forceResync} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-white dark:bg-neutral-950">
        {isReadOnly ? (
          /* Archive badge instead of toolbar */
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-neutral-50 dark:bg-neutral-900 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Session archivée — lecture seule</span>
          </div>
        ) : (
          /* Toolbar with status */
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b bg-neutral-50 dark:bg-neutral-900">
            {/* Formatting buttons */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-neutral-200 dark:bg-neutral-800' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-neutral-200 dark:bg-neutral-800' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1 self-center" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={
                  editor.isActive('heading', { level: 2 })
                    ? 'bg-neutral-200 dark:bg-neutral-800'
                    : ''
                }
              >
                <Heading2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={
                  editor.isActive('bulletList') ? 'bg-neutral-200 dark:bg-neutral-800' : ''
                }
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={
                  editor.isActive('orderedList') ? 'bg-neutral-200 dark:bg-neutral-800' : ''
                }
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={
                  editor.isActive('blockquote') ? 'bg-neutral-200 dark:bg-neutral-800' : ''
                }
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            {/* Status */}
            <EditorStatusBar
              syncStatus={syncStatus}
              lastSyncedAt={lastSyncedAt}
              onRetry={forceResync}
            />
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  );
}
