"use client";

import { Button } from "@/components/ui/button";
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

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export function TipTapEditor({
  content = "",
  onChange,
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

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
