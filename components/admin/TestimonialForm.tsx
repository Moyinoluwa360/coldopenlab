"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveTestimonial, deleteTestimonial, type TestimonialInput } from "@/lib/admin-actions";
import { ConfirmDelete } from "./ConfirmDelete";
import styles from "../../app/admin/admin.module.css";

type Props = { testimonial?: TestimonialInput };

export function TestimonialForm({ testimonial }: Props) {
  const [form, setForm] = useState<TestimonialInput>({
    id: testimonial?.id,
    quote: testimonial?.quote ?? "",
    clientName: testimonial?.clientName ?? "",
    clientRole: testimonial?.clientRole ?? "",
    category: testimonial?.category ?? "",
    published: testimonial?.published ?? false,
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof TestimonialInput>(key: K, val: TestimonialInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.quote.trim()) return setError("Quote is required.");
    setError("");
    startTransition(() => {
      void saveTestimonial(form);
    });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label htmlFor="quote">Quote</label>
      <span className={styles.help}>Only publish approved, verified client quotes.</span>
      <textarea id="quote" rows={4} value={form.quote} onChange={(e) => set("quote", e.target.value)} required />

      <label htmlFor="clientName">Client name</label>
      <input id="clientName" type="text" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />

      <label htmlFor="clientRole">Client role</label>
      <input id="clientRole" type="text" value={form.clientRole} onChange={(e) => set("clientRole", e.target.value)} placeholder="e.g. Founder" />

      <label htmlFor="category">Associated category</label>
      <input id="category" type="text" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Consumer & lifestyle business" />

      <label className={styles.checkbox}>
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
        Published {form.published ? "" : "(currently a draft — hidden from the public site)"}
      </label>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save testimonial"}
        </button>
        <Link className={styles.ghost} href="/admin/testimonials">
          Cancel
        </Link>
        {testimonial?.id && (
          <ConfirmDelete
            label="Delete testimonial"
            onConfirm={async () => {
              await deleteTestimonial(testimonial.id!);
            }}
          />
        )}
      </div>
    </form>
  );
}
