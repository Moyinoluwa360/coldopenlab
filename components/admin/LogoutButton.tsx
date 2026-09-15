"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getClientAuth } from "@/lib/firebase-client";
import { signOut } from "firebase/auth";
import styles from "../../app/admin/admin.module.css";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      await signOut(getClientAuth()).catch(() => {});
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button className={styles.danger} onClick={handleLogout} disabled={loading} type="button">
      {loading ? "Signing out…" : "Log out"}
    </button>
  );
}
