import Link from "next/link";
import type { Metadata } from "next";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";

export const metadata: Metadata = {
  title: "Choose a Discovery-Call Time | Cold Open Lab",
  description: "Select a discovery-call time with Cold Open Lab.",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <>
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">Thanks for the details</p>
          <h1>Choose a time for your call.</h1>
          <p className="lead">
            Your enquiry has been saved. Pick an available time below and we&rsquo;ll confirm your
            discovery call.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CalendlyEmbed />
          <p className="small muted" style={{ marginTop: 24 }}>
            Already booked?{" "}
            <Link className="text-link" href="/contact/confirmation">
              View the confirmation page
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
