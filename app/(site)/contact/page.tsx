import type { Metadata } from "next";
import { PAGE_META } from "@/lib/site";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.contact.title },
  description: PAGE_META.contact.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">Book a discovery call</p>
          <h1>Tell us what is happening in your business.</h1>
          <p className="lead">
            Choose a discovery-call time that works for you. We&rsquo;ll discuss your current
            communications, the customers you want to reach and where Cold Open Lab could help.
          </p>
          <p>Have any useful website links, examples or questions ready for the conversation.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CalendlyEmbed />
        </div>
      </section>
    </>
  );
}
