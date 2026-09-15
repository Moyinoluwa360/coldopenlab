"use client";

import { useTransition } from "react";
import styles from "../../app/admin/admin.module.css";

/**
 * Delete button with a confirmation prompt. `onConfirm` is a server action
 * (bound with its id) that deletes the doc and redirects back to the list.
 */
export function ConfirmDelete({
  onConfirm,
  label = "Delete",
}: {
  onConfirm: () => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={styles.danger}
      disabled={pending}
      onClick={() => {
        if (window.confirm("Delete this permanently? This cannot be undone.")) {
          startTransition(() => {
            void onConfirm();
          });
        }
      }}
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
