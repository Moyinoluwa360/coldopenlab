"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

/**
 * Visual-only newsletter signup. Per the brief, this is NOT wired to any email
 * provider yet — it deliberately does not send anything. Independent of the
 * contact enquiry form; both require a name and email address.
 * TODO: client to provide — connect to the chosen email/newsletter service.
 */
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className={styles.newsletter}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
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
      <button className="button button--dark" type="submit">
        Subscribe
      </button>
      <p className="small">
        Subscribe to receive emails from Cold Open Lab. You can unsubscribe at any time.
      </p>
      <p className="small" role="status">
        {submitted
          ? "Thanks — newsletter signup isn’t connected yet, so nothing was sent."
          : "Newsletter signup is coming soon."}
      </p>
    </form>
  );
}
