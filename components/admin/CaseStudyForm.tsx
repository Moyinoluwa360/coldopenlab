"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveCaseStudy, deleteCaseStudy, type CaseStudyInput } from "@/lib/admin-actions";
import { IMAGE_RATIOS } from "@/lib/types";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { ConfirmDelete } from "./ConfirmDelete";
import styles from "../../app/admin/admin.module.css";

type Props = { study?: CaseStudyInput };

export function CaseStudyForm({ study }: Props) {
  const [form, setForm] = useState({
    id: study?.id,
    title: study?.title ?? "",
    slug: study?.slug ?? "",
    clientCategory: study?.clientCategory ?? "",
    summary: study?.summary ?? "",
    bodyHtml: study?.bodyHtml ?? "",
    proofTagsText: (study?.proofTags ?? []).join(", "),
    workInProgress: study?.workInProgress ?? false,
    published: study?.published ?? false,
    heroImageUrl: study?.heroImageUrl ?? "",
    heroImageAlt: study?.heroImageAlt ?? "",
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.summary.trim()) return setError("Summary is required.");
    setError("");
    const payload: CaseStudyInput = {
      id: form.id,
      title: form.title,
      slug: form.slug,
      clientCategory: form.clientCategory,
      summary: form.summary,
      bodyHtml: form.bodyHtml,
      proofTags: form.proofTagsText.split(",").map((t) => t.trim()).filter(Boolean),
      workInProgress: form.workInProgress,
      published: form.published,
      heroImageUrl: form.heroImageUrl,
      heroImageAlt: form.heroImageAlt,
    };
    startTransition(() => {
      void saveCaseStudy(payload);
    });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label htmlFor="title">Title</label>
      <input id="title" type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required />

      <label htmlFor="slug">URL slug</label>
      <span className={styles.help}>Leave blank to generate from the title.</span>
      <input id="slug" type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />

      <label htmlFor="clientCategory">Client category</label>
      <span className={styles.help}>e.g. &ldquo;Consumer &amp; lifestyle / Food business&rdquo;.</span>
      <input id="clientCategory" type="text" value={form.clientCategory} onChange={(e) => set("clientCategory", e.target.value)} />

      <label htmlFor="summary">Summary</label>
      <span className={styles.help}>Shown on the case-study cards and index.</span>
      <textarea id="summary" rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} required />

      <label htmlFor="proofTags">Proof / tools-used tags</label>
      <span className={styles.help}>Comma-separated, e.g. &ldquo;Content planning, Video editing, Campaign testing&rdquo;.</span>
      <input id="proofTags" type="text" value={form.proofTagsText} onChange={(e) => set("proofTagsText", e.target.value)} />

      <label>Hero image</label>
      <span className={styles.help}>Cropped to 3:2. Optional.</span>
      <ImageUpload
        value={form.heroImageUrl}
        onChange={(url) => set("heroImageUrl", url)}
        aspect={IMAGE_RATIOS.caseStudy}
        type="case-study"
        ratioLabel="3:2"
      />
      <label htmlFor="imgAlt">Image alt text</label>
      <input id="imgAlt" type="text" value={form.heroImageAlt} onChange={(e) => set("heroImageAlt", e.target.value)} />

      <label>Full write-up</label>
      <RichTextEditor value={form.bodyHtml} onChange={(html) => set("bodyHtml", html)} />

      <label className={styles.checkbox}>
        <input type="checkbox" checked={form.workInProgress} onChange={(e) => set("workInProgress", e.target.checked)} />
        Work in progress (shows a &ldquo;Work in progress&rdquo; label)
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
        Published {form.published ? "" : "(currently a draft — hidden from the public site)"}
      </label>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save case study"}
        </button>
        <Link className={styles.ghost} href="/admin/case-studies">
          Cancel
        </Link>
        {study?.id && (
          <ConfirmDelete
            label="Delete case study"
            onConfirm={async () => {
              await deleteCaseStudy(study.id!, form.slug || study.slug);
            }}
          />
        )}
      </div>
    </form>
  );
}
