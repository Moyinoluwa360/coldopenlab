"use client";

import { useEffect } from "react";
import styles from "./CalendlyEmbed.module.css";

/**
 * Inline Calendly booking widget. The scheduling URL comes from
 * NEXT_PUBLIC_CALENDLY_URL. Until the client provides one, a clear placeholder
 * is shown instead of a broken embed.
 * TODO: client to provide — set NEXT_PUBLIC_CALENDLY_URL.
 */
export function CalendlyEmbed() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;

  useEffect(() => {
    if (!url) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

  if (!url) {
    return (
      <div className={styles.placeholder}>
        <p className="preview-label">Booking calendar</p>
        <h2>Discovery-call booking is being set up.</h2>
        <p>
          The booking calendar will appear here once it&rsquo;s connected. In the meantime, we&rsquo;ll
          reach out to arrange a time.
        </p>
      </div>
    );
  }

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: "320px", height: "700px" }}
      aria-label="Discovery-call booking calendar"
    />
  );
}
