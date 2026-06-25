"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";

import { BlogEditorToolbar } from "@/features/admin/blog/components/blog-editor-toolbar";
import { createBlogEditorExtensions, EMPTY_BLOG_DOCUMENT } from "@/lib/blog";

interface BlogRichTextEditorProps {
  initialJson?: Record<string, unknown>;
  onChange: (payload: { json: Record<string, unknown>; html: string }) => void;
}

export function BlogRichTextEditor({ initialJson, onChange }: BlogRichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: createBlogEditorExtensions("Start writing your article…"),
    content: initialJson ?? EMPTY_BLOG_DOCUMENT,
    editorProps: {
      attributes: {
        class:
          "blog-editor-content min-h-[320px] rounded-b-xl border border-border bg-background px-4 py-3 focus:outline-none",
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange({
        json: currentEditor.getJSON() as Record<string, unknown>,
        html: currentEditor.getHTML(),
      });
    },
  });

  useEffect(() => {
    if (!editor || !initialJson) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(initialJson);
    if (current !== incoming) {
      editor.commands.setContent(initialJson);
    }
  }, [editor, initialJson]);

  return (
    <div className="space-y-0">
      <BlogEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
