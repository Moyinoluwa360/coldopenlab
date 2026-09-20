import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery-Call Confirmation | Cold Open Lab",
  description: "Your discovery-call booking information.",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <section className="section section--hero">
      <div className="container">
        <p className="eyebrow">Booking confirmed</p>
        <h1>Your discovery call is booked.</h1>
        <p className="lead">
          We look forward to hearing more about your business. Have any useful website links,
          examples or questions ready for the conversation.
        </p>
        <p>Calendly will send you a calendar invite with the date, time and meeting link.</p>
        <Link className="button" href="/blog">
          Explore the blog <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
