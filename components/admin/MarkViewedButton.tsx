"use client";

import { useTransition } from "react";
import { markEnquiryViewed } from "@/lib/admin-actions";
import styles from "../../app/admin/admin.module.css";

export function MarkViewedButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={styles.ghost}
      disabled={pending}
      onClick={() => startTransition(() => void markEnquiryViewed(id))}
    >
      {pending ? "Marking…" : "Mark viewed"}
    </button>
  );
}
