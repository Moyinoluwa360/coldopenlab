"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveBlogPost, deleteBlogPost, type BlogInput } from "@/lib/admin-actions";
import { IMAGE_RATIOS } from "@/lib/types";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { ConfirmDelete } from "./ConfirmDelete";
import styles from "../../app/admin/admin.module.css";

type Props = { post?: BlogInput };

export function BlogForm({ post }: Props) {
  const [form, setForm] = useState<BlogInput>({
    id: post?.id,
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    bodyHtml: post?.bodyHtml ?? "",
    category: post?.category ?? "",
    publishDate: post?.publishDate ?? new Date().toISOString().slice(0, 10),
    published: post?.published ?? false,
    featuredImageUrl: post?.featuredImageUrl ?? "",
    featuredImageAlt: post?.featuredImageAlt ?? "",
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof BlogInput>(key: K, val: BlogInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.excerpt.trim()) return setError("Excerpt is required.");
    setError("");
    startTransition(() => {
      void saveBlogPost(form);
    });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label htmlFor="title">Title</label>
      <input id="title" type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required />

      <label htmlFor="slug">URL slug</label>
      <span className={styles.help}>Leave blank to generate from the title. Used in /blog/your-slug.</span>
      <input id="slug" type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />

      <label htmlFor="category">Category / tag</label>
      <input id="category" type="text" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Being found" />

      <label htmlFor="publishDate">Publish date</label>
      <input id="publishDate" type="date" value={form.publishDate} onChange={(e) => set("publishDate", e.target.value)} />

      <label htmlFor="excerpt">Excerpt</label>
      <span className={styles.help}>Short summary shown on the blog index and in search results.</span>
      <textarea id="excerpt" rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required />

      <label>Featured image</label>
      <span className={styles.help}>Cropped to 16:9.</span>
      <ImageUpload
        value={form.featuredImageUrl}
        onChange={(url) => set("featuredImageUrl", url)}
        aspect={IMAGE_RATIOS.blog}
        type="blog"
        ratioLabel="16:9"
      />
      <label htmlFor="imgAlt">Image alt text</label>
      <span className={styles.help}>Describe the image for screen readers and SEO.</span>
      <input id="imgAlt" type="text" value={form.featuredImageAlt} onChange={(e) => set("featuredImageAlt", e.target.value)} />

      <label>Body</label>
      <RichTextEditor value={form.bodyHtml} onChange={(html) => set("bodyHtml", html)} />

      <label className={styles.checkbox}>
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
        Published {form.published ? "" : "(currently a draft — hidden from the public site)"}
      </label>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save post"}
        </button>
        <Link className={styles.ghost} href="/admin/blog">
          Cancel
        </Link>
        {post?.id && (
          <ConfirmDelete
            label="Delete post"
            onConfirm={async () => {
              await deleteBlogPost(post.id!, form.slug || post.slug);
            }}
          />
        )}
      </div>
    </form>
  );
}
