"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { Button } from "./button";
import { cn } from "@/utils";

interface TipTapEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  onSave?: () => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  onSave,
  placeholder = "Commencez à écrire votre histoire...",
  className,
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4 border border-moon-700",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent-primary hover:text-accent-primary-hover underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage as any).markdown?.getMarkdown() || "";
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-noctalys max-w-none",
          "focus:outline-none",
          "min-h-[500px] p-6",
          "text-moon-300"
        ),
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    const currentMarkdown = (editor?.storage as any)?.markdown?.getMarkdown() || "";
    if (editor && content !== currentMarkdown) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL de l'image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("URL du lien:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Toolbar */}
      {editable && (
        <div className="border-moon-700 bg-moon-900 flex flex-wrap items-center gap-2 rounded-lg border p-2">
          {/* Text Formatting */}
          <div className="border-moon-700 flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("bold") && "bg-moon-800 text-accent-primary"
              )}
              title="Gras (Ctrl+B)"
            >
              <span className="font-bold">B</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("italic") && "bg-moon-800 text-accent-primary"
              )}
              title="Italique (Ctrl+I)"
            >
              <span className="italic">I</span>
            </Button>
          </div>

          {/* Headings */}
          <div className="border-moon-700 flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                "h-8 px-2 text-xs font-semibold",
                editor.isActive("heading", { level: 1 }) && "bg-moon-800 text-accent-primary"
              )}
              title="Titre 1"
            >
              H1
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                "h-8 px-2 text-xs font-semibold",
                editor.isActive("heading", { level: 2 }) && "bg-moon-800 text-accent-primary"
              )}
              title="Titre 2"
            >
              H2
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                "h-8 px-2 text-xs font-semibold",
                editor.isActive("heading", { level: 3 }) && "bg-moon-800 text-accent-primary"
              )}
              title="Titre 3"
            >
              H3
            </Button>
          </div>

          {/* Lists */}
          <div className="border-moon-700 flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("bulletList") && "bg-moon-800 text-accent-primary"
              )}
              title="Liste à puces"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("orderedList") && "bg-moon-800 text-accent-primary"
              )}
              title="Liste numérotée"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Quote */}
          <div className="border-moon-700 flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("blockquote") && "bg-moon-800 text-accent-primary"
              )}
              title="Citation"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Link & Image */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={setLink}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("link") && "bg-moon-800 text-accent-primary"
              )}
              title="Ajouter un lien"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="h-8 w-8 p-0"
              title="Ajouter une image"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Save button (if provided) */}
          {onSave && (
            <div className="ml-auto">
              <Button type="button" size="sm" onClick={onSave} className="h-8">
                Sauvegarder
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div
        className={cn(
          "border-moon-700 bg-moon-900 overflow-auto rounded-lg border",
          !editable && "bg-moon-900/50"
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
