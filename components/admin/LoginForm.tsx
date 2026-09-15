"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase-client";
import styles from "../../app/admin/admin.module.css";

export function LoginForm({ from }: { from: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(getClientAuth(), email, password);
      const idToken = await getIdToken(cred.user, true);
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Sign-in failed.");
      }
      router.replace(from);
      router.refresh();
    } catch (err) {
      setError(friendlyError((err as Error).message));
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className={styles.actions}>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function friendlyError(message: string): string {
  if (/auth\/invalid-credential|wrong-password|user-not-found|invalid-email/.test(message)) {
    return "Incorrect email or password.";
  }
  if (/not authorized/i.test(message)) {
    return "This account is not authorized for the admin panel.";
  }
  if (/api-key|configuration|app\/no-app/i.test(message)) {
    return "Firebase isn’t configured yet. Add the keys in .env.local (see README).";
  }
  return message;
}
