import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML, generateJSON } from "@tiptap/html";
import { common, createLowlight } from "lowlight";
import type { Extensions } from "@tiptap/react";

import { CalloutExtension } from "@/lib/blog/tiptap/callout-extension";

const lowlight = createLowlight(common);

export function createBlogEditorExtensions(placeholder?: string): Extensions {
  return [
    StarterKit.configure({
      codeBlock: false,
      horizontalRule: false,
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
    }),
    Image.configure({
      HTMLAttributes: {
        class: "blog-editor-image",
      },
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    CodeBlockLowlight.configure({ lowlight }),
    HorizontalRule,
    CalloutExtension,
    Placeholder.configure({
      placeholder: placeholder ?? "Write your article…",
    }),
  ];
}

export function blogJsonToHtml(json: Record<string, unknown>): string {
  return generateHTML(json, createBlogEditorExtensions());
}

export function blogHtmlToJson(html: string): Record<string, unknown> {
  return generateJSON(html, createBlogEditorExtensions()) as Record<string, unknown>;
}

export function extractPlainTextFromHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export const EMPTY_BLOG_DOCUMENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
