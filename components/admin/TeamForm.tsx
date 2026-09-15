"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveTeamMember, deleteTeamMember, type TeamInput } from "@/lib/admin-actions";
import { IMAGE_RATIOS } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";
import { ConfirmDelete } from "./ConfirmDelete";
import styles from "../../app/admin/admin.module.css";

type Props = { member?: TeamInput };

export function TeamForm({ member }: Props) {
  const [form, setForm] = useState<TeamInput>({
    id: member?.id,
    name: member?.name ?? "",
    role: member?.role ?? "",
    bio: member?.bio ?? "",
    photoUrl: member?.photoUrl ?? "",
    photoAlt: member?.photoAlt ?? "",
    order: member?.order ?? 0,
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof TeamInput>(key: K, val: TeamInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.role.trim()) return setError("Role is required.");
    setError("");
    startTransition(() => {
      void saveTeamMember(form);
    });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label htmlFor="name">Name</label>
      <input id="name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required />

      <label htmlFor="role">Role</label>
      <input id="role" type="text" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Co-Founder / Creative Lead" required />

      <label htmlFor="bio">Bio</label>
      <span className={styles.help}>A short paragraph about their experience and what they do.</span>
      <textarea id="bio" rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />

      <label>Photo</label>
      <span className={styles.help}>Cropped to 3:4 (portrait).</span>
      <ImageUpload
        value={form.photoUrl}
        onChange={(url) => set("photoUrl", url)}
        aspect={IMAGE_RATIOS.team}
        type="team"
        ratioLabel="3:4"
      />
      <label htmlFor="photoAlt">Photo alt text</label>
      <span className={styles.help}>Defaults to &ldquo;Portrait of [name], [role]&rdquo; if left blank.</span>
      <input id="photoAlt" type="text" value={form.photoAlt} onChange={(e) => set("photoAlt", e.target.value)} />

      <label htmlFor="order">Display order</label>
      <span className={styles.help}>Lower numbers appear first. The two lowest span wider (co-founders).</span>
      <input id="order" type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} />

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save member"}
        </button>
        <Link className={styles.ghost} href="/admin/team">
          Cancel
        </Link>
        {member?.id && (
          <ConfirmDelete
            label="Delete member"
            onConfirm={async () => {
              await deleteTeamMember(member.id!);
            }}
          />
        )}
      </div>
    </form>
  );
}
