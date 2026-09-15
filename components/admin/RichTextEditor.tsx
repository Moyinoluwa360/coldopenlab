"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import styles from "./RichTextEditor.module.css";

/**
 * Minimal rich-text editor (Tiptap) for blog and case-study bodies.
 * Emits sanitized-on-render HTML via onChange; the public RichText component
 * sanitizes again before display.
 */
export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false, // required for Next.js SSR
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: styles.editable },
    },
  });

  if (!editor) return <div className={styles.loading}>Loading editor…</div>;

  const btn = (active: boolean) => `${styles.tool} ${active ? styles.toolActive : ""}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </button>
        <button
          type="button"
          className={btn(editor.isActive("link"))}
          onClick={() => {
            const prev = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Link URL", prev || "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().unsetLink().run();
            } else {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
          }}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
