"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ContactForm.module.css";

const MARKETING_OPTIONS = [
  "Website",
  "Social media",
  "Blogs or articles",
  "Email marketing",
  "Customer follow-up or CRM",
  "PR",
  "Paid campaigns",
  "Nothing in place yet",
  "Other",
];

export function ContactForm() {
  const router = useRouter();
  const [marketing, setMarketing] = useState<string[]>([]);
  const [marketingError, setMarketingError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleMarketing(value: string) {
    setMarketingError("");
    setMarketing((prev) => {
      const checked = !prev.includes(value);
      if (!checked) return prev.filter((v) => v !== value);
      if (value === "Nothing in place yet") return [value];
      return [...prev.filter((v) => v !== "Nothing in place yet"), value];
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    if (marketing.length === 0) {
      setMarketingError("Please select at least one option.");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      business: String(data.get("business") || ""),
      description: String(data.get("description") || ""),
      customers: String(data.get("customers") || ""),
      marketing,
      website: String(data.get("website") || ""),
      help: String(data.get("help") || ""),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      router.push("/contact/book");
    } catch (err) {
      setSubmitError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <label className={styles.field} htmlFor="name">
            Your name
            <input id="name" name="name" type="text" required autoComplete="name" />
          </label>
          <label className={styles.field} htmlFor="email">
            Email address
            <input id="email" name="email" type="email" required autoComplete="email" />
          </label>
          <label className={styles.field} htmlFor="phone">
            Phone number
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="Include your country code"
            />
          </label>
          <label className={styles.field} htmlFor="business">
            Business name
            <input id="business" name="business" type="text" required autoComplete="organization" />
          </label>
        </div>

        <label className={styles.field} htmlFor="description">
          What does your business do?
          <span className={styles.help} id="description-help">
            Tell us what you sell or the services you provide.
          </span>
          <textarea id="description" name="description" required rows={3} aria-describedby="description-help" />
        </label>

        <label className={styles.field} htmlFor="customers">
          Who are your clients or customers?
          <span className={styles.help} id="customers-help">
            Describe the clients or customers you serve, including the types of businesses or
            consumers you work with.
          </span>
          <textarea id="customers" name="customers" required rows={3} aria-describedby="customers-help" />
        </label>

        <fieldset className={styles.fieldset}>
          <legend>What marketing do you currently have in place?</legend>
          <div className={styles.checks}>
            {MARKETING_OPTIONS.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  name="marketing"
                  value={option}
                  checked={marketing.includes(option)}
                  onChange={() => toggleMarketing(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <p className={styles.formError} role="alert">
            {marketingError}
          </p>
        </fieldset>

        <label className={styles.field} htmlFor="website">
          Website or social page <span className={styles.help}>Optional</span>
          <input type="url" name="website" id="website" placeholder="https://" />
        </label>

        <label className={styles.field} htmlFor="help">
          What would you like help with?
          <span className={styles.help}>
            Tell us what is difficult, missing or taking too much of your time.
          </span>
          <textarea id="help" name="help" rows={4} required />
        </label>

        <p className="small">
          We&rsquo;ll use these details to respond to your enquiry and arrange your call.{" "}
          <Link href="/privacy">Privacy Notice</Link>
        </p>

        {submitError && (
          <p className={styles.formError} role="alert">
            {submitError}
          </p>
        )}

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit and choose a call time"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
    </div>
  );
}
