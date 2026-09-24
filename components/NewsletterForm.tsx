"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Footer newsletter signup. Posts to /api/newsletter, which forwards the
 * name + email to the client's Google Sheet via an Apps Script webhook.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <form
      className={styles.newsletter}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setStatus("submitting");
        try {
          const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: data.get("name"), email: data.get("email") }),
          });
          if (!res.ok) throw new Error("request failed");
          setStatus("success");
          form.reset();
        } catch {
          setStatus("error");
        }
      }}
    >
      <div className={styles.newsletterFields}>
        <label htmlFor="newsletter-name">
          Your name
          <input type="text" id="newsletter-name" name="name" required autoComplete="name" />
        </label>
        <label htmlFor="newsletter-email">
          Email address
          <input type="email" id="newsletter-email" name="email" required autoComplete="email" />
        </label>
      </div>
      <button className="button button--dark" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>
      <p className="small">
        Subscribe to receive emails from Cold Open Lab. You can unsubscribe at any time.
      </p>
      {status === "success" && (
        <p className="small" role="status">
          Thanks — you&rsquo;re on the list.
        </p>
      )}
      {status === "error" && (
        <p className="small" role="status">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
